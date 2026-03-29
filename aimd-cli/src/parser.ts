import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  AimdBlock,
  AimdFrontMatter,
  AbbrevMap,
  ParsedAimd,
  BLOCK_TARGET,
  ValidationIssue,
  AcpRole,
} from './types.js';

const BLOCK_RE = /^:::(\S+)([^\n]*)\n([\s\S]*?)^:::/gm;

const ROLE_BLOCKS: Record<AcpRole, Set<string>> = {
  general: new Set(['intent', 'flow', 'api', 'schema', 'rules', 'test', 'diff', 'ref']),
  frontend: new Set(['intent', 'flow', 'api', 'rules', 'test', 'diff']),
  backend: new Set(['intent', 'flow', 'api', 'schema', 'rules', 'test', 'diff', 'ref']),
  data: new Set(['intent', 'flow', 'schema', 'rules', 'diff', 'ref']),
  qa: new Set(['intent', 'flow', 'api', 'schema', 'rules', 'test', 'diff']),
  review: new Set(['intent', 'flow', 'api', 'schema', 'rules', 'test', 'diff', 'ref']),
};

interface SchemaCandidate {
  name: string;
  lines: string[];
  evidence: 'table' | 'keyword';
}

interface GenerationAnalysis {
  title: string;
  slug: string;
  summary: string;
  flowSteps: string[];
  apiEntries: string[];
  schemaCandidates: SchemaCandidate[];
  ruleItems: string[];
  criticalItems: string[];
  testItems: string[];
  verifiedItems: string[];
  assumptions: string[];
  openItems: string[];
  domainHints: string[];
}

interface MarkdownSection {
  heading: string | null;
  body: string;
}

interface MarkdownTable {
  heading: string | null;
  headers: string[];
  rows: string[][];
}

const FLOW_SECTION_RE = /(flow|workflow|process|sequence|procedure|steps|timeline|흐름|절차|단계|시나리오)/i;
const RULE_SECTION_RE = /(rule|constraint|security|policy|guideline|requirement|convention|규칙|제약|정책|보안|요구사항)/i;
const TEST_SECTION_RE = /(test|qa|acceptance|scenario|criteria|검증|테스트|시나리오|인수)/i;
const API_SECTION_RE = /(api|endpoint|route|interface|webhook|contract|엔드포인트|라우트|인터페이스)/i;
const STRONG_RULE_RE = /(must not|must|never|required|do not|cannot|반드시|필수|금지|하지 말|허용하지 않|절대)/i;
const SOFT_RULE_RE = /(should|prefer|avoid|권장|지양|가능하면)/i;

export function parseFile(filePath: string): ParsedAimd {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return parseContent(raw);
}

export function parseContent(raw: string): ParsedAimd {
  const { data, content } = matter(raw);
  const frontMatter = data as AimdFrontMatter;
  const blocks: AimdBlock[] = [];

  let prose = content;
  const matches = [...content.matchAll(BLOCK_RE)];

  for (const match of matches) {
    const [fullMatch, type, attrs, blockContent] = match;
    blocks.push({
      type: type.trim(),
      attrs: attrs.trim(),
      content: blockContent.trim(),
      raw: fullMatch,
    });
    prose = prose.replace(fullMatch, '');
  }

  return { frontMatter, blocks, prose: prose.trim(), raw };
}

export function parseAbbr(blocks: AimdBlock[]): AbbrevMap {
  const map: AbbrevMap = {};
  for (const block of blocks) {
    if (block.type !== 'abbr') continue;
    for (const line of block.content.split('\n')) {
      const stripped = line.replace(/#.*$/, '').trim();
      const match = stripped.match(/^(\S+)\s*=\s*(.+)$/);
      if (match) {
        map[match[1].trim()] = match[2].trim();
      }
    }
  }
  return map;
}

function resolveInherits(
  filePath: string,
  visited = new Set<string>()
): { stateBlocks: AimdBlock[]; rulesBlocks: AimdBlock[] } {
  const resolved = path.resolve(filePath);
  if (visited.has(resolved)) {
    return { stateBlocks: [], rulesBlocks: [] };
  }
  visited.add(resolved);

  const parsed = parseFile(filePath);
  const { frontMatter, blocks } = parsed;

  let stateBlocks = blocks.filter(block => block.type === 'state');
  let rulesBlocks = blocks.filter(block => block.type === 'rules');

  const inherits = frontMatter.inherits;
  if (!inherits) return { stateBlocks, rulesBlocks };

  const inheritList = Array.isArray(inherits) ? inherits : [inherits];
  const dir = path.dirname(filePath);

  for (const rel of inheritList) {
    const parentPath = path.resolve(dir, rel);
    if (!fs.existsSync(parentPath)) continue;
    const parent = resolveInherits(parentPath, visited);
    stateBlocks = [...parent.stateBlocks, ...stateBlocks];
    rulesBlocks = [...parent.rulesBlocks, ...rulesBlocks];
  }

  return { stateBlocks, rulesBlocks };
}

export function generateAimdFromMarkdown(content: string, filename: string): string {
  const projectName = deriveProjectName(filename);
  const body = matter(content).content.trim();
  const title = extractFirstHeading(body) ?? projectName;
  const analysis = analyzeSource(body, title);

  return renderGeneratedAimd(
    analysis,
    {
      aimd: '1.4',
      project: projectName,
      source: 'markdown',
      generatedBy: 'rule-based-generator',
    },
    {
      sourceLabel: 'Source Markdown',
      sourceText: body,
    }
  );
}

export function generateAimdFromPrompt(promptText: string, title?: string): string {
  const intentTitle = title?.trim() || firstSentence(promptText) || 'generated-aimd';
  const projectName = deriveProjectName(intentTitle);
  const analysis = analyzeSource(promptText.trim(), intentTitle);

  return renderGeneratedAimd(
    analysis,
    {
      aimd: '1.4',
      project: projectName,
      source: 'prompt',
      generatedBy: 'rule-based-generator',
    },
    {
      sourceLabel: 'Source Prompt',
      sourceText: promptText.trim(),
    }
  );
}

export function normalizeAimdContent(raw: string, filename: string): string {
  const parsed = parseContent(raw);
  const { data, content } = matter(raw);
  const frontMatter = data as AimdFrontMatter;
  const projectName = frontMatter.project?.toString() || deriveProjectName(filename);
  const analysisText = (parsed.prose || content).trim();

  if (parsed.blocks.length === 0) {
    return generateAimdFromMarkdown(content, filename);
  }

  const title = extractFirstHeading(analysisText) ?? projectName;
  const analysis = analyzeSource(analysisText, title);
  const existingTypes = new Set(parsed.blocks.map(block => block.type));
  const prefixes: string[] = [];

  if (!existingTypes.has('intent')) prefixes.push(renderIntentBlock(analysis));
  if (!existingTypes.has('rules') && analysis.ruleItems.length > 0) prefixes.push(renderRulesBlock(analysis));
  if (!existingTypes.has('state')) prefixes.push(renderStateBlock(analysis, 'normalized'));
  if (!existingTypes.has('flow') && analysis.flowSteps.length > 0) prefixes.push(renderFlowBlock(analysis));
  if (!existingTypes.has('api') && analysis.apiEntries.length > 0) prefixes.push(renderApiBlock(analysis));
  if (!existingTypes.has('schema')) {
    for (const candidate of analysis.schemaCandidates) {
      prefixes.push(renderSchemaBlock(candidate));
    }
  }
  if (!existingTypes.has('test') && analysis.testItems.length > 0) prefixes.push(renderTestBlock(analysis));

  const normalizedBody = [prefixes.join('\n\n'), content.trim()].filter(Boolean).join('\n\n').trim();

  return stringifyWithFrontMatter(normalizedBody, {
    ...frontMatter,
    aimd: '1.4',
    project: projectName,
    source: frontMatter.source ?? 'normalized',
    generatedBy: frontMatter.generatedBy ?? 'rule-based-generator',
  });
}

export function validateAimdFile(filePath: string): ValidationIssue[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return validateAimdContent(raw, filePath);
}

export function validateAimdContent(raw: string, filePath?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const parsed = parseContent(raw);
  const { frontMatter } = parsed;
  const body = matter(raw).content;

  if (!frontMatter.aimd) {
    issues.push({
      severity: 'warning',
      code: 'frontmatter.missing_aimd',
      message: 'front matter is missing the aimd version field.',
    });
  }

  if (parsed.blocks.length === 0) {
    issues.push({
      severity: 'warning',
      code: 'structure.no_blocks',
      message: 'No AIMD structural blocks were found. The file still looks like plain Markdown.',
    });
  }

  issues.push(...scanFenceIssues(body));
  issues.push(...scanDirectiveIssues(parsed.blocks));
  issues.push(...scanRefIssues(raw, filePath));

  return issues;
}

export function buildForAi(filePath: string): string {
  const parsed = parseFile(filePath);
  const { blocks, prose } = parsed;

  const { stateBlocks: inheritedState, rulesBlocks: inheritedRules } =
    resolveInherits(filePath);

  const ownState = blocks.filter(block => block.type === 'state');
  const ownRules = blocks.filter(block => block.type === 'rules');

  const mergedState = dedupeBlocks([...inheritedState, ...ownState]);
  const mergedRules = dedupeBlocks([...inheritedRules, ...ownRules]);

  const sharedBlocks = blocks.filter(block => {
    const target = BLOCK_TARGET[block.type as keyof typeof BLOCK_TARGET] ?? 'shared';
    return target === 'shared';
  });

  const parts: string[] = [];

  if (mergedState.length > 0) {
    parts.push('<!-- STATE CONTEXT (inherited + own) -->');
    for (const block of mergedState) {
      parts.push(`:::state ${block.attrs}\n${block.content}\n:::`);
    }
  }

  for (const block of mergedRules) {
    parts.push(`:::rules ${block.attrs}\n${block.content}\n:::`);
  }

  for (const block of sharedBlocks) {
    parts.push(`:::${block.type} ${block.attrs}\n${block.content}\n:::`);
  }

  if (prose) parts.push(prose);

  return parts.join('\n\n');
}

export function buildForAcp(filePath: string, role: AcpRole = 'general'): string {
  const parsed = parseFile(filePath);
  const { frontMatter, blocks, prose } = parsed;
  const projectName = frontMatter.project?.toString() || deriveProjectName(path.basename(filePath));
  const roleSet = ROLE_BLOCKS[role];

  const { stateBlocks: inheritedState, rulesBlocks: inheritedRules } =
    resolveInherits(filePath);

  const ownState = blocks.filter(block => block.type === 'state');
  const ownRules = blocks.filter(block => block.type === 'rules');
  const mergedState = dedupeBlocks([...inheritedState, ...ownState]);
  const mergedRules = dedupeBlocks([...inheritedRules, ...ownRules]);

  const sharedBlocks = blocks.filter(block => roleSet.has(block.type));
  const parts: string[] = [];

  const firstSummary = (firstParagraph(prose) || `${projectName} ${role} handoff`).trim();
  parts.push(':::summary');
  parts.push(firstSummary);
  parts.push(':::');

  for (const block of mergedState) {
    parts.push(`:::state role:${role}\n${block.content}\n:::`);
  }

  for (const block of mergedRules) {
    if (roleSet.has('rules')) parts.push(`:::rules ${block.attrs}\n${block.content}\n:::`);
  }

  for (const block of sharedBlocks) {
    if (block.type === 'rules' || block.type === 'state' || block.type === 'human') {
      continue;
    }
    parts.push(`:::${block.type} ${block.attrs}\n${block.content}\n:::`);
  }

  return stringifyWithFrontMatter(parts.join('\n\n'), {
    acp: '0.1',
    role,
    source: path.basename(filePath),
    project: projectName,
  });
}

export function buildForHuman(filePath: string): string {
  const parsed = parseFile(filePath);
  const { blocks, prose } = parsed;

  const parts: string[] = [];

  for (const block of blocks) {
    const target = BLOCK_TARGET[block.type as keyof typeof BLOCK_TARGET] ?? 'shared';
    if (target === 'ai') continue;

    if (block.type === 'schema') {
      parts.push(schemaToTable(block));
    } else if (block.type === 'api') {
      parts.push(apiToMarkdown(block));
    } else if (block.type === 'abbr') {
      parts.push(abbrToMarkdown(block));
    } else if (target === 'human') {
      parts.push(block.content);
    } else {
      parts.push(`\`\`\`\n${block.content}\n\`\`\``);
    }
  }

  if (prose) parts.push(prose);

  return parts.join('\n\n');
}

function schemaToTable(block: AimdBlock): string {
  const lines = block.content.split('\n').filter(line => line.trim());
  const rows = lines.map(line => {
    const isPk = line.trimStart().startsWith('#');
    const clean = line.replace(/^#/, '').trim();
    const [fieldPart, ...rest] = clean.split(/\s+@/);
    const [name, typePart] = fieldPart.split(':').map(part => part.trim());
    const required = typePart?.endsWith('!') ? 'Yes' : '';
    const type = typePart?.replace(/[!?]/g, '') ?? '';
    const annotations = rest.map(item => `@${item}`).join(' ');
    const pk = isPk ? ' (PK)' : '';
    return `| ${name}${pk} | ${type} | ${required} | ${annotations} |`;
  });

  return [
    `### ${block.attrs || 'Schema'}`,
    '| Field | Type | Required | Annotations |',
    '|-------|------|----------|-------------|',
    ...rows,
  ].join('\n');
}

function apiToMarkdown(block: AimdBlock): string {
  const lines = block.content.split('\n');
  const parts: string[] = ['### API'];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('@auth')) parts.push(`- **Auth:** ${trimmed.replace('@auth:', '').trim()}`);
    else if (trimmed.startsWith('@param')) parts.push(`- **Param:** ${trimmed.replace('@param', '').trim()}`);
    else if (trimmed.startsWith('@query')) parts.push(`- **Query:** ${trimmed.replace('@query', '').trim()}`);
    else if (trimmed.startsWith('@ok')) parts.push(`- **Response:** ${trimmed.replace('@ok', '').trim()}`);
    else if (trimmed.startsWith('@err')) parts.push(`- **Error:** ${trimmed.replace('@err', '').trim()}`);
    else parts.push(`\`${trimmed}\``);
  }

  return parts.join('\n');
}

function abbrToMarkdown(block: AimdBlock): string {
  const lines = block.content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const rows = lines
    .map(line => {
      const match = line.replace(/#.*$/, '').trim().match(/^(\S+)\s*=\s*(.+)$/);
      return match ? `| \`${match[1]}\` | ${match[2].trim()} |` : '';
    })
    .filter(Boolean);

  return ['### Abbreviations', '| Abbr | Full |', '|------|------|', ...rows].join('\n');
}

function analyzeSource(sourceText: string, fallbackTitle: string): GenerationAnalysis {
  const cleanSource = sourceText.trim();
  const title = (extractFirstHeading(cleanSource) ?? fallbackTitle.trim()) || 'Untitled';
  const slug = slugify(title);
  const sections = splitMarkdownSections(cleanSource);
  const summary = firstParagraph(cleanSource) || firstSentence(cleanSource) || title;

  const domainHints = inferDomainHints(`${title}\n${cleanSource}`);
  const apiEntries = uniqueStrings(extractApiEntries(cleanSource), 10);
  const schemaCandidates = extractSchemaCandidates(cleanSource, title);
  const ruleItems = uniqueStrings(extractRuleItems(cleanSource, sections), 8);
  const criticalItems = uniqueStrings(ruleItems.filter(item => STRONG_RULE_RE.test(item)), 3);
  let flowSteps = uniqueStrings(extractFlowSteps(cleanSource, sections), 8);
  let testItems = uniqueStrings(extractTestItems(cleanSource, sections), 8);

  const verifiedItems: string[] = [];
  const assumptions: string[] = [];
  const openItems: string[] = [];

  if (apiEntries.length > 0) {
    verifiedItems.push(`Extracted ${apiEntries.length} explicit API pattern(s) from source text.`);
  }
  if (schemaCandidates.some(candidate => candidate.evidence === 'table')) {
    verifiedItems.push('Converted one or more schema-like Markdown tables into AIMD schema blocks.');
  }
  if (ruleItems.length > 0) {
    verifiedItems.push(`Normalized ${ruleItems.length} rule or constraint statement(s) from source prose.`);
  }

  if (flowSteps.length === 0) {
    const inferredFlow = inferFlowTemplate(domainHints, apiEntries, schemaCandidates);
    if (inferredFlow.length > 0) {
      flowSteps = inferredFlow;
      assumptions.push('Flow block was inferred from feature keywords because the source did not provide explicit ordered steps.');
    } else {
      openItems.push('The main execution flow is not explicit in the source.');
    }
  }

  if (schemaCandidates.length === 0) {
    const inferredFields = inferFieldLines(cleanSource);
    if (inferredFields.length > 0) {
      schemaCandidates.push({
        name: inferSchemaName(title),
        lines: inferredFields,
        evidence: 'keyword',
      });
      assumptions.push('Schema candidates were inferred from repeated domain keywords in the source.');
    }
  }

  if (testItems.length === 0) {
    testItems = inferTestItems(domainHints, flowSteps, apiEntries, criticalItems);
    if (testItems.length > 0) {
      assumptions.push('Test scenarios were inferred from visible requirements and constraints.');
    } else {
      openItems.push('Acceptance criteria or QA scenarios are not explicit in the source.');
    }
  }

  if (apiEntries.length === 0 && mentionsApiWithoutShape(cleanSource)) {
    openItems.push('API concerns are mentioned, but explicit routes or methods were not found.');
  }

  if (criticalItems.length === 0 && hasConstraintLanguage(cleanSource)) {
    openItems.push('Constraint language exists in prose, but no stable CRITICAL items could be normalized automatically.');
  }

  return {
    title,
    slug,
    summary,
    flowSteps,
    apiEntries,
    schemaCandidates,
    ruleItems,
    criticalItems,
    testItems,
    verifiedItems: uniqueStrings(verifiedItems, 5),
    assumptions: uniqueStrings(assumptions, 5),
    openItems: uniqueStrings(openItems, 5),
    domainHints,
  };
}

function renderGeneratedAimd(
  analysis: GenerationAnalysis,
  frontMatterData: Record<string, unknown>,
  source?: { sourceLabel: string; sourceText: string }
): string {
  const parts: string[] = [];

  parts.push(renderIntentBlock(analysis));

  for (const candidate of analysis.schemaCandidates) {
    parts.push(renderSchemaBlock(candidate));
  }

  if (analysis.apiEntries.length > 0) parts.push(renderApiBlock(analysis));
  if (analysis.flowSteps.length > 0) parts.push(renderFlowBlock(analysis));
  if (analysis.ruleItems.length > 0) parts.push(renderRulesBlock(analysis));
  if (analysis.testItems.length > 0) parts.push(renderTestBlock(analysis));

  parts.push(renderStateBlock(analysis, String(frontMatterData.source ?? 'unknown')));

  if (source?.sourceText?.trim()) {
    parts.push(`## ${source.sourceLabel}\n\n${source.sourceText.trim()}`);
  }

  return stringifyWithFrontMatter(parts.join('\n\n').trim(), frontMatterData);
}

function renderIntentBlock(analysis: GenerationAnalysis): string {
  const lines = [
    `:::intent ${analysis.slug}`,
    `goal: ${analysis.title}`,
    `summary: ${analysis.summary}`,
  ];
  if (analysis.domainHints.length > 0) {
    lines.push(`domains: ${analysis.domainHints.join(', ')}`);
  }
  lines.push(':::');
  return lines.join('\n');
}

function renderSchemaBlock(candidate: SchemaCandidate): string {
  return [`:::schema ${candidate.name}`, ...candidate.lines, ':::'].join('\n');
}

function renderApiBlock(analysis: GenerationAnalysis): string {
  return [':::api', ...analysis.apiEntries, ':::'].join('\n');
}

function renderFlowBlock(analysis: GenerationAnalysis): string {
  const lines = [`:::flow ${analysis.slug}`];
  analysis.flowSteps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`);
  });
  lines.push(':::');
  return lines.join('\n');
}

function renderRulesBlock(analysis: GenerationAnalysis): string {
  return [':::rules', ...analysis.ruleItems.map(item => `- ${item}`), ':::'].join('\n');
}

function renderTestBlock(analysis: GenerationAnalysis): string {
  return [':::test ' + analysis.slug, ...analysis.testItems.map(item => `✓ ${item}`), ':::'].join('\n');
}

function renderStateBlock(analysis: GenerationAnalysis, sourceKind: string): string {
  let idx = 1;
  const lines = [':::state', `n1: generated_from=${sourceKind}_input_via_rule_based_generator`];

  analysis.verifiedItems.forEach(item => lines.push(`v${idx++}: ${item.replace(/\s+/g, '_').toLowerCase()}`));

  let oIdx = 1;
  analysis.assumptions.forEach(item => lines.push(`a${oIdx++}: ${item.replace(/\s+/g, '_').toLowerCase()}`));

  let openIdx = 1;
  analysis.openItems.forEach(item => lines.push(`o${openIdx++}: ${item.replace(/\s+/g, '_').toLowerCase()}`));

  if (analysis.openItems.length === 0) {
    lines.push('o1: confirm_which_constraints_are_critical_before_acp_extraction');
  }

  lines.push(':::');
  return lines.join('\n');
}

function splitMarkdownSections(text: string): MarkdownSection[] {
  const lines = stripCodeFences(text).split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let currentHeading: string | null = null;
  let currentBody: string[] = [];

  const pushSection = () => {
    if (currentHeading !== null || currentBody.some(line => line.trim())) {
      sections.push({
        heading: currentHeading,
        body: currentBody.join('\n').trim(),
      });
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      pushSection();
      currentHeading = headingMatch[1].trim();
      currentBody = [];
      continue;
    }
    currentBody.push(line);
  }

  pushSection();
  return sections;
}

function extractFlowSteps(text: string, sections: MarkdownSection[]): string[] {
  const sectionSteps = uniqueStrings(
    sections
      .filter(section => section.heading && FLOW_SECTION_RE.test(section.heading))
      .flatMap(section => extractListItems(section.body))
      .map(normalizeListItem),
    8
  );
  if (sectionSteps.length > 0) return sectionSteps;

  const ordered = uniqueStrings(
    text
      .split(/\r?\n/)
      .map(line => line.match(/^\s*\d+\.\s+(.+)$/)?.[1]?.trim() ?? '')
      .filter(Boolean),
    8
  );
  if (ordered.length > 0) return ordered;

  return uniqueStrings(
    text
      .split(/\r?\n/)
      .map(line => line.match(/^\s*[-*+]\s+(.+)$/)?.[1]?.trim() ?? '')
      .filter(item => /->|then|validate|request|response|처리|검증|응답/i.test(item)),
    8
  );
}

function extractApiEntries(text: string): string[] {
  const entries: string[] = [];
  const clean = stripCodeFences(text);
  const methodMatches = clean.matchAll(/\b(GET|POST|PUT|PATCH|DELETE)\s+([/A-Za-z0-9._~:@!$&'()*+,;=%-]+)(?:\s*->\s*([^\n]+))?/g);

  for (const match of methodMatches) {
    const method = match[1];
    const route = ensureLeadingSlash(match[2]);
    const response = match[3]?.trim();
    entries.push(response ? `${method} ${route} -> ${response}` : `${method} ${route}`);
  }

  return uniqueStrings(entries, 10);
}

function extractSchemaCandidates(text: string, title: string): SchemaCandidate[] {
  const tables = extractMarkdownTables(text);
  const candidates: SchemaCandidate[] = [];

  for (const table of tables) {
    if (!looksLikeSchemaTable(table.headers)) continue;
    const entityName = inferSchemaName(table.heading || title);
    const lines = table.rows
      .map(row => tableRowToSchemaLine(table.headers, row))
      .filter((line): line is string => Boolean(line));

    if (lines.length > 0) {
      candidates.push({
        name: entityName,
        lines: uniqueStrings(lines, 16),
        evidence: 'table',
      });
    }
  }

  return candidates;
}

function extractRuleItems(text: string, sections: MarkdownSection[]): string[] {
  const candidates = new Set<string>();

  const sectionBodies = sections
    .filter(section => section.heading && RULE_SECTION_RE.test(section.heading))
    .map(section => section.body);

  for (const body of sectionBodies) {
    for (const item of extractListItems(body)) {
      const normalized = normalizeRuleItem(item);
      if (normalized) candidates.add(normalized);
    }
  }

  for (const item of extractListItems(text)) {
    if (STRONG_RULE_RE.test(item) || SOFT_RULE_RE.test(item)) {
      const normalized = normalizeRuleItem(item);
      if (normalized) candidates.add(normalized);
    }
  }

  for (const sentence of splitSentences(text)) {
    if (STRONG_RULE_RE.test(sentence) || SOFT_RULE_RE.test(sentence)) {
      const normalized = normalizeRuleItem(sentence);
      if (normalized) candidates.add(normalized);
    }
  }

  return [...candidates];
}

function extractTestItems(text: string, sections: MarkdownSection[]): string[] {
  const sectionItems = uniqueStrings(
    sections
      .filter(section => section.heading && TEST_SECTION_RE.test(section.heading))
      .flatMap(section => extractListItems(section.body))
      .map(normalizeListItem),
    8
  );

  if (sectionItems.length > 0) return sectionItems;

  return uniqueStrings(
    extractListItems(text)
      .map(normalizeListItem)
      .filter(item => /(valid|invalid|error|success|reject|return|throws|cache|sql|happy path|실패|성공|검증|예외)/i.test(item)),
    8
  );
}

function inferFlowTemplate(
  domainHints: string[],
  apiEntries: string[],
  schemaCandidates: SchemaCandidate[]
): string[] {
  const hasApi = apiEntries.length > 0;
  const hasSchema = schemaCandidates.length > 0;

  if (domainHints.includes('payment-retry')) {
    return [
      'retry request -> validate payment state and retry eligibility',
      'eligible retry -> execute payment retry with idempotency guard',
      'retry result -> persist outcome and return stable response',
    ];
  }

  if (domainHints.includes('auth-login')) {
    return [
      'Req(credentials) -> validate input',
      'valid input -> load subject and verify secret',
      'authenticated -> issue session or token and return response',
    ];
  }

  if (domainHints.includes('password-reset')) {
    return [
      'Req(identifier) -> issue reset challenge',
      'challenge verified -> accept new secret',
      'secret updated -> invalidate prior sessions and confirm reset',
    ];
  }

  if (domainHints.includes('signup')) {
    return [
      'Req(signup payload) -> validate input',
      'valid payload -> create subject and persist profile',
      'created subject -> trigger follow-up verification and return result',
    ];
  }

  if (domainHints.includes('upload')) {
    return [
      'Req(file, metadata) -> validate authorization and file constraints',
      'valid file -> store object and persist metadata',
      'stored artifact -> return reference and status',
    ];
  }

  if (domainHints.includes('search')) {
    return [
      'Req(query, filters) -> validate query',
      'valid query -> execute search and ranking',
      'results -> apply filters or pagination and respond',
    ];
  }

  if (domainHints.includes('notification')) {
    return [
      'trigger received -> compose notification payload',
      'payload ready -> dispatch through target channel',
      'dispatch result -> record delivery status and expose outcome',
    ];
  }

  if (hasApi) {
    return [
      'request received -> validate input and authorization',
      'validated request -> execute core domain logic',
      'domain result -> persist state changes and return response',
    ];
  }

  if (hasSchema) {
    return [
      'request or event received -> validate incoming payload',
      'validated payload -> apply domain processing and update entities',
      'updated state -> return or publish resulting output',
    ];
  }

  return [];
}

function inferTestItems(
  domainHints: string[],
  flowSteps: string[],
  apiEntries: string[],
  criticalItems: string[]
): string[] {
  const tests: string[] = [];

  if (apiEntries.length > 0) {
    tests.push('happy path request -> returns expected success response');
    tests.push('invalid input -> validation error');
  }

  if (domainHints.includes('payment-retry')) {
    tests.push('duplicate retry request -> produces stable idempotent outcome');
    tests.push('gateway failure during retry -> state remains consistent');
  }

  if (domainHints.includes('auth-login')) {
    tests.push('invalid credentials -> authentication rejected');
  }

  if (domainHints.includes('password-reset')) {
    tests.push('expired or invalid reset challenge -> rejected');
  }

  if (flowSteps.length > 0) {
    tests.push('main flow step sequence -> completes without skipped transitions');
  }

  if (criticalItems.some(item => /idempotency|duplicate|중복/i.test(item))) {
    tests.push('duplicate submission -> no unsafe duplicate side effects');
  }

  return uniqueStrings(tests, 6);
}

function inferFieldLines(text: string): string[] {
  const fields: string[] = [];
  const lower = text.toLowerCase();

  const addField = (condition: boolean, line: string) => {
    if (condition) fields.push(line);
  };

  addField(/\b(id|uuid|identifier)\b/i.test(text) || /(식별자|아이디)/.test(text), '#id: uuid');
  addField(/\bemail\b/i.test(lower) || /이메일/.test(text), 'email: string! @format(email)');
  addField(/\bpassword\b/i.test(lower) || /비밀번호/.test(text), 'password: string!');
  addField(/\buser\s*id\b/i.test(lower) || /사용자\s*id/.test(text), 'userId: uuid!');
  addField(/\bname\b/i.test(lower) || /이름/.test(text), 'name: string!');
  addField(/\b(phone|mobile)\b/i.test(lower) || /전화|휴대폰/.test(text), 'phoneNumber: string?');
  addField(/\b(amount|price|total)\b/i.test(lower) || /금액|가격|합계/.test(text), 'amount: decimal! @min(0)');
  addField(/\b(status|state)\b/i.test(lower) || /상태/.test(text), 'status: string!');
  addField(/\btoken\b/i.test(lower) || /토큰/.test(text), 'token: string!');
  addField(/\b(code|otp)\b/i.test(lower) || /코드|인증번호/.test(text), 'code: string!');

  return uniqueStrings(fields, 8);
}

function inferDomainHints(text: string): string[] {
  const hints: string[] = [];
  const normalized = text.toLowerCase();

  if ((/payment|결제/.test(normalized) && /retry|재시도/.test(normalized)) || /idempotenc/.test(normalized)) {
    hints.push('payment-retry');
  }
  if ((/login|signin|sign-in|auth/.test(normalized) || /로그인|인증/.test(text)) && !/password reset|비밀번호 재설정/.test(normalized)) {
    hints.push('auth-login');
  }
  if (/password reset|reset password|forgot password/i.test(text) || /비밀번호.*재설정|비밀번호.*초기화/.test(text)) {
    hints.push('password-reset');
  }
  if (/signup|sign up|register|onboard/i.test(text) || /회원가입|가입/.test(text)) {
    hints.push('signup');
  }
  if (/upload|attachment|file/i.test(text) || /업로드|첨부/.test(text)) {
    hints.push('upload');
  }
  if (/search|query|filter/i.test(text) || /검색|조회|필터/.test(text)) {
    hints.push('search');
  }
  if (/notification|email|sms|push/i.test(text) || /알림|이메일|문자|푸시/.test(text)) {
    hints.push('notification');
  }

  return uniqueStrings(hints, 4);
}

function extractMarkdownTables(text: string): MarkdownTable[] {
  const lines = stripCodeFences(text).split(/\r?\n/);
  const tables: MarkdownTable[] = [];
  let currentHeading: string | null = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      currentHeading = headingMatch[1].trim();
      continue;
    }

    if (!isMarkdownTableRow(line) || index + 1 >= lines.length || !isMarkdownTableSeparator(lines[index + 1].trim())) {
      continue;
    }

    const rowLines = [line, lines[index + 1].trim()];
    index += 2;
    while (index < lines.length && isMarkdownTableRow(lines[index].trim())) {
      rowLines.push(lines[index].trim());
      index += 1;
    }
    index -= 1;

    const headers = parseMarkdownTableRow(rowLines[0]);
    const rows = rowLines.slice(2).map(parseMarkdownTableRow).filter(row => row.length > 0);
    tables.push({ heading: currentHeading, headers, rows });
  }

  return tables;
}

function looksLikeSchemaTable(headers: string[]): boolean {
  const normalized = headers.map(header => header.toLowerCase());
  return normalized.some(header => /(field|name|column|property|key|필드|컬럼)/.test(header)) &&
    normalized.some(header => /(type|datatype|format|타입|자료형)/.test(header));
}

function tableRowToSchemaLine(headers: string[], row: string[]): string | null {
  const values = Object.fromEntries(headers.map((header, index) => [header.toLowerCase(), row[index]?.trim() ?? '']));
  const field =
    firstNonEmpty(
      pickValue(values, /(field|name|column|property|key|필드|컬럼)/),
      row[0]
    ) ?? '';

  if (!field) return null;

  const typeRaw =
    firstNonEmpty(
      pickValue(values, /(type|datatype|format|타입|자료형)/),
      row[1]
    ) ?? 'string';

  const requiredRaw = pickValue(values, /(required|nullable|optional|필수|옵션|null)/) ?? '';
  const defaultRaw = pickValue(values, /(default|기본)/) ?? '';
  const description = pickValue(values, /(description|desc|notes|설명|비고)/) ?? '';

  const name = normalizeFieldName(field);
  const type = normalizeSchemaType(typeRaw, description);
  const requiredMarker = normalizeRequiredMarker(requiredRaw, name);
  const annotations = collectAnnotations(name, description);
  const defaultValue = normalizeDefaultValue(defaultRaw, type);
  const prefix = /^id$/i.test(name) ? '#' : '';

  return [prefix + name + ':', `${type}${requiredMarker}`, ...annotations, defaultValue]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function normalizeSchemaType(typeRaw: string, description: string): string {
  const value = typeRaw.trim();
  const lower = value.toLowerCase();

  if (/enum\s*\(/i.test(value)) return value;
  if (/\[\]$/.test(value)) return `*${normalizeSchemaType(value.slice(0, -2), description)}`;
  if (/array/.test(lower)) return '*string';
  if (/uuid/.test(lower)) return 'uuid';
  if (/datetime|timestamp/.test(lower)) return 'datetime';
  if (/date/.test(lower)) return 'date';
  if (/bool/.test(lower)) return 'bool';
  if (/decimal|numeric/.test(lower)) return 'decimal';
  if (/float|double/.test(lower)) return 'float';
  if (/int|integer|number/.test(lower)) return 'int';
  if (/json|object/.test(lower)) return 'json';
  if (/string|text|varchar|char/.test(lower)) return 'string';

  const enumMatch = description.match(/(?:one of|enum)\s*[:\-]\s*([A-Za-z0-9_, /-]+)/i);
  if (enumMatch) {
    const values = enumMatch[1]
      .split(/[,/]/)
      .map(item => item.trim())
      .filter(Boolean);
    if (values.length > 0) return `enum(${values.join(', ')})`;
  }

  return value || 'string';
}

function normalizeRequiredMarker(requiredRaw: string, fieldName: string): string {
  if (/^(yes|y|true|required|not null|필수)$/i.test(requiredRaw.trim())) return '!';
  if (/^(no|n|false|optional|nullable|선택)$/i.test(requiredRaw.trim())) return '?';
  if (/^id$/i.test(fieldName)) return '!';
  return '';
}

function collectAnnotations(fieldName: string, description: string): string[] {
  const annotations: string[] = [];
  const lowerField = fieldName.toLowerCase();
  const lowerDesc = description.toLowerCase();

  if (lowerField === 'email' || /email|이메일/.test(description)) annotations.push('@format(email)');
  if (/unique|중복 불가/.test(lowerDesc)) annotations.push('@unique');

  const betweenMatch = description.match(/between\s+(\d+)\s+and\s+(\d+)/i) ?? description.match(/(\d+)\s*~\s*(\d+)/);
  if (betweenMatch) {
    annotations.push(`@min(${betweenMatch[1]})`);
    annotations.push(`@max(${betweenMatch[2]})`);
  }

  const minMatch = description.match(/min(?:imum)?\s*(\d+)/i);
  if (minMatch) annotations.push(`@min(${minMatch[1]})`);
  const maxMatch = description.match(/max(?:imum)?\s*(\d+)/i);
  if (maxMatch) annotations.push(`@max(${maxMatch[1]})`);

  return uniqueStrings(annotations, 4);
}

function normalizeDefaultValue(raw: string, _type: string): string {
  const value = raw.trim();
  if (!value || value === '-' || /^none|null$/i.test(value)) return '';
  if (/auto|generated/i.test(value)) return '';
  if (/current time|now/i.test(value)) return '= now()';
  if (/^(true|false|\d+(\.\d+)?)$/i.test(value)) return `= ${value.toLowerCase()}`;
  return `= ${value.replace(/^["']|["']$/g, '')}`;
}

function inferSchemaName(title: string): string {
  const cleaned = title
    .replace(/\b(prd|requirements?|feature|spec|design)\b/gi, '')
    .replace(/[()[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || 'Entity';
}

function normalizeFieldName(value: string): string {
  const trimmed = value.trim().replace(/[`"'"]/g, '');
  if (!trimmed) return 'field';

  if (/[A-Za-z]/.test(trimmed)) {
    const parts = trimmed
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map(part => part.toLowerCase());
    if (parts.length === 0) return trimmed;
    return parts
      .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
      .join('');
  }

  return trimmed.replace(/\s+/g, '');
}

function normalizeRuleItem(value: string): string {
  return value
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+\.\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeListItem(value: string): string {
  return normalizeRuleItem(value);
}

function extractListItems(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map(line => {
      const bullet = line.match(/^\s*[-*+]\s+(.+)$/)?.[1];
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/)?.[1];
      return (bullet || ordered || '').trim();
    })
    .filter(Boolean);
}

function splitSentences(text: string): string[] {
  return text
    .split(/\r?\n+/)
    .flatMap(line => line.split(/(?<=[.!?])\s+|(?<=[다요죠])\s+/))
    .map(item => item.trim())
    .filter(Boolean);
}

function stripCodeFences(text: string): string {
  return text.replace(/```[\s\S]*?```/g, '').trim();
}

function isMarkdownTableRow(line: string): boolean {
  return /^\|.*\|$/.test(line);
}

function isMarkdownTableSeparator(line: string): boolean {
  return /^\|[\s:|-]+\|$/.test(line);
}

function parseMarkdownTableRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim());
}

function pickValue(values: Record<string, string>, pattern: RegExp): string | undefined {
  for (const [key, value] of Object.entries(values)) {
    if (pattern.test(key)) return value;
  }
  return undefined;
}

function firstNonEmpty(...values: Array<string | undefined | null>): string | undefined {
  for (const value of values) {
    if (value && value.trim()) return value;
  }
  return undefined;
}

function mentionsApiWithoutShape(text: string): boolean {
  return API_SECTION_RE.test(text) || /\b(rest|graphql|webhook|endpoint|route|api)\b/i.test(text);
}

function hasConstraintLanguage(text: string): boolean {
  return STRONG_RULE_RE.test(text) || SOFT_RULE_RE.test(text);
}

function stringifyWithFrontMatter(content: string, data: Record<string, unknown>): string {
  return matter.stringify(content.trim() + '\n', data);
}

function applyAbbr(text: string, abbrMap: AbbrevMap): string {
  let result = text;
  for (const [abbr, full] of Object.entries(abbrMap)) {
    result = result.replaceAll(abbr, `${abbr}(${full})`);
  }
  return result;
}

function dedupeBlocks(blocks: AimdBlock[]): AimdBlock[] {
  const seen = new Set<string>();
  return blocks.filter(block => {
    const key = `${block.type}:${block.attrs}:${block.content.trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deriveProjectName(filename: string): string {
  return filename.replace(/\.(md|aimd)$/i, '').trim() || 'untitled';
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\u3131-\u318E\uAC00-\uD7A3]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'doc';
}

function extractFirstHeading(content: string): string | null {
  const match = content.match(/^\s*#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function firstSentence(text: string): string | null {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  const match = normalized.match(/^(.{1,120}?[.!?]|.{1,120})/);
  return match ? match[1].trim() : normalized.slice(0, 120);
}

function firstParagraph(text: string): string | null {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .filter(paragraph => !/^#{1,6}\s+/.test(paragraph));
  return paragraphs[0] ?? null;
}

function uniqueStrings(values: string[], limit = 999): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of values) {
    const value = raw.replace(/\s+/g, ' ').trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
    if (result.length >= limit) break;
  }

  return result;
}

function ensureLeadingSlash(route: string): string {
  return route.startsWith('/') ? route : `/${route}`;
}

function scanFenceIssues(content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lines = content.split(/\r?\n/);
  let openBlock: { type: string; line: number } | null = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trimEnd();

    if (line.trim() === ':::') {
      if (!openBlock) {
        issues.push({
          severity: 'error',
          code: 'fence.stray_close',
          message: 'Found a closing ::: fence without a matching open block.',
          line: index + 1,
        });
      } else {
        openBlock = null;
      }
      continue;
    }

    const start = line.match(/^:::(\S+)(.*)$/);
    if (start) {
      if (openBlock) {
        issues.push({
          severity: 'error',
          code: 'fence.nested_block',
          message: `Found a nested block (${start[1]}) before the previous block was closed.`,
          line: index + 1,
        });
      }
      openBlock = { type: start[1], line: index + 1 };
    }
  }

  if (openBlock) {
    issues.push({
      severity: 'error',
      code: 'fence.unclosed_block',
      message: `Block "${openBlock.type}" is not closed.`,
      line: openBlock.line,
    });
  }

  return issues;
}

function scanDirectiveIssues(blocks: AimdBlock[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const block of blocks) {
    if (block.type !== 'state') continue;
    for (const line of block.content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^(v|o|a|n|ask)\d+:\s*$/.test(trimmed)) {
        issues.push({
          severity: 'warning',
          code: 'state.empty_line',
          message: `Empty :::state line: ${trimmed}`,
        });
      }
    }
  }
  return issues;
}

function scanRefIssues(raw: string, filePath?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const matches = [...raw.matchAll(/@ref:([^\s]+)/g)];
  if (!filePath) return issues;
  const dir = path.dirname(filePath);

  for (const match of matches) {
    const ref = match[1];
    if (/^https?:\/\//.test(ref) || ref.includes('**')) continue;
    const normalized = ref.replace(/::.*$/, '').replace(/#.*$/, '').replace(/:L\d+.*$/, '');
    const resolved = path.resolve(dir, normalized);
    if (!fs.existsSync(resolved)) {
      issues.push({
        severity: 'warning',
        code: 'ref.missing',
        message: `Referenced file was not found: ${ref}`,
      });
    }
  }

  return issues;
}
