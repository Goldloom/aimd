import {
  generateAimdFromMarkdown,
  generateAimdFromPrompt,
  normalizeAimdContent,
  validateAimdContent,
} from './parser.js';

export interface LlmGenerateOptions {
  sourceText: string;
  title: string;
  sourceType: 'prompt' | 'markdown';
  model?: string;
  baseUrl?: string;
  apiKey?: string;
  allowFallback?: boolean;
}

export interface LlmGenerateResult {
  content: string;
  model: string;
  provider: string;
  repaired: boolean;
  fallbackUsed: boolean;
}

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4.1-mini';

const SYSTEM_PROMPT = [
  'You generate AIMD documents.',
  'Return AIMD only. Do not wrap the output in Markdown code fences.',
  'Preserve source facts. Do not invent exact API paths, numeric values, or field names unless the source states them.',
  'If you infer a flow, schema, test, or rule from weak evidence, mark it with ASSUMPTION or OPEN in :::ai.',
  'If a constraint is explicit and critical, place it in CRITICAL[n].',
  'Emit valid AIMD with front matter and ::: blocks.',
  'Use aimd: "1.3" in front matter.',
  'Prefer these blocks when justified: :::intent, :::flow, :::api, :::schema, :::rules, :::test, :::ai.',
  'Do not include :::human unless the source explicitly contains human-only notes.',
  'Output must be directly saveable as a .aimd file.',
].join(' ');

export async function generateAimdWithLlm(options: LlmGenerateOptions): Promise<LlmGenerateResult> {
  const baseUrl = options.baseUrl || process.env.AIMD_LLM_BASE_URL || DEFAULT_BASE_URL;
  const apiKey = options.apiKey || process.env.AIMD_LLM_API_KEY || process.env.OPENAI_API_KEY;
  const model = options.model || process.env.AIMD_LLM_MODEL || DEFAULT_MODEL;
  const fallback = buildRuleBasedDraft(options.sourceText, options.title, options.sourceType);

  if (!apiKey) {
    if (options.allowFallback !== false) {
      return {
        content: fallback,
        model,
        provider: 'openai-compatible',
        repaired: false,
        fallbackUsed: true,
      };
    }
    throw new Error('Missing API key. Set AIMD_LLM_API_KEY or OPENAI_API_KEY.');
  }

  try {
    const draft = await callChatCompletion({
      apiKey,
      baseUrl,
      model,
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildGenerationPrompt(options.sourceText, options.title, options.sourceType, fallback),
    });

    const normalized = normalizeAimdContent(stripCodeFence(draft), `${options.title}.aimd`);
    const issues = validateAimdContent(normalized);
    const errorIssues = issues.filter(issue => issue.severity === 'error');

    if (errorIssues.length === 0) {
      return {
        content: normalized,
        model,
        provider: 'openai-compatible',
        repaired: false,
        fallbackUsed: false,
      };
    }

    const repaired = await callChatCompletion({
      apiKey,
      baseUrl,
      model,
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildRepairPrompt(options.sourceText, options.title, normalized, errorIssues),
    });

    const repairedNormalized = normalizeAimdContent(stripCodeFence(repaired), `${options.title}.aimd`);
    const repairedIssues = validateAimdContent(repairedNormalized).filter(issue => issue.severity === 'error');

    if (repairedIssues.length === 0) {
      return {
        content: repairedNormalized,
        model,
        provider: 'openai-compatible',
        repaired: true,
        fallbackUsed: false,
      };
    }

    if (options.allowFallback !== false) {
      return {
        content: fallback,
        model,
        provider: 'openai-compatible',
        repaired: true,
        fallbackUsed: true,
      };
    }

    throw new Error(`LLM output remained invalid after repair: ${repairedIssues.map(issue => issue.code).join(', ')}`);
  } catch (error) {
    if (options.allowFallback !== false) {
      return {
        content: fallback,
        model,
        provider: 'openai-compatible',
        repaired: false,
        fallbackUsed: true,
      };
    }
    throw error;
  }
}

function buildRuleBasedDraft(sourceText: string, title: string, sourceType: 'prompt' | 'markdown'): string {
  return sourceType === 'markdown'
    ? generateAimdFromMarkdown(sourceText, title)
    : generateAimdFromPrompt(sourceText, title);
}

function buildGenerationPrompt(
  sourceText: string,
  title: string,
  sourceType: 'prompt' | 'markdown',
  fallback: string
): string {
  return [
    `Title: ${title}`,
    `Source type: ${sourceType}`,
    '',
    'Source input:',
    sourceText.trim(),
    '',
    'Rule-based draft to improve:',
    fallback.trim(),
    '',
    'Produce a better AIMD document than the rule-based draft.',
    'Keep explicit facts from the source.',
    'If information is missing, mark uncertainty in :::ai instead of inventing details.',
  ].join('\n');
}

function buildRepairPrompt(
  sourceText: string,
  title: string,
  invalidDraft: string,
  issues: Array<{ code: string; message: string; line?: number }>
): string {
  const issueText = issues
    .map(issue => `- ${issue.code}${issue.line ? `@L${issue.line}` : ''}: ${issue.message}`)
    .join('\n');

  return [
    `Title: ${title}`,
    '',
    'Original source:',
    sourceText.trim(),
    '',
    'Invalid AIMD draft:',
    invalidDraft.trim(),
    '',
    'Validator errors:',
    issueText,
    '',
    'Repair the AIMD. Return AIMD only. Preserve facts. Do not invent new evidence.',
  ].join('\n');
}

async function callChatCompletion(args: {
  apiKey: string;
  baseUrl: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}): Promise<string> {
  const response = await fetch(`${args.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify({
      model: args.model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: args.systemPrompt },
        { role: 'user', content: args.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();

  if (Array.isArray(content)) {
    const text = content
      .map(item => item.text ?? '')
      .join('')
      .trim();
    if (text) return text;
  }

  throw new Error('LLM response did not contain message content.');
}

function stripCodeFence(text: string): string {
  return text
    .replace(/^```[a-zA-Z0-9_-]*\s*/m, '')
    .replace(/\s*```$/, '')
    .trim();
}
