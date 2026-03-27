import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { generateAimdFromPrompt, generateAimdFromMarkdown } from '../parser.js';
import { generateAimdWithLlm } from '../llm.js';

interface GenerateOptions {
  prompt?: string;
  promptFile?: string;
  out?: string;
  title?: string;
  llm?: boolean;
  model?: string;
  baseUrl?: string;
  strict?: boolean;
}

export async function generateCommand(options: GenerateOptions) {
  const promptText = getPromptText(options);
  if (!promptText) {
    console.error(chalk.red('prompt or prompt-file is required.'));
    process.exit(1);
  }

  const outPath = options.out ? path.resolve(options.out) : path.resolve('generated.aimd');
  const title = options.title ?? path.basename(outPath, '.aimd');
  const sourceType = inferSourceType(options.promptFile, promptText);

  if (options.llm) {
    const result = await generateAimdWithLlm({
      sourceText: promptText,
      title,
      sourceType,
      model: options.model,
      baseUrl: options.baseUrl,
      allowFallback: !options.strict,
    });

    fs.writeFileSync(outPath, result.content, 'utf-8');

    const note = result.fallbackUsed
      ? chalk.yellow(' (LLM failed or returned invalid AIMD, fallback applied)')
      : result.repaired
        ? chalk.cyan(' (LLM + repair loop)')
        : chalk.cyan(' (LLM)');

    console.log(chalk.green(`✓ AIMD generated: ${outPath}`) + note);
    console.log(chalk.gray(`  provider=${result.provider} model=${result.model}`));
    return;
  }

  const generated = sourceType === 'markdown'
    ? generateAimdFromMarkdown(promptText, title)
    : generateAimdFromPrompt(promptText, title);

  fs.writeFileSync(outPath, generated, 'utf-8');
  console.log(chalk.green(`✓ AIMD generated: ${outPath}`));
}

function getPromptText(options: { prompt?: string; promptFile?: string }): string {
  if (options.prompt?.trim()) return options.prompt.trim();
  if (options.promptFile) {
    const resolved = path.resolve(options.promptFile);
    if (!fs.existsSync(resolved)) return '';
    return fs.readFileSync(resolved, 'utf-8').trim();
  }
  return '';
}

function inferSourceType(promptFile: string | undefined, content: string): 'prompt' | 'markdown' {
  if (promptFile && /\.(md|markdown)$/i.test(promptFile)) return 'markdown';
  if (/^\s*#\s+/m.test(content) || /^\s*[-*+]\s+/m.test(content) || /^\s*\|.*\|\s*$/m.test(content)) {
    return 'markdown';
  }
  return 'prompt';
}
