export type BlockType =
  | 'schema' | 'api' | 'flow' | 'rules'
  | 'test' | 'diff' | 'intent' | 'state'
  | 'ref' | 'human';

export type BlockTarget = 'state' | 'human' | 'shared';

export const BLOCK_TARGET: Record<BlockType, BlockTarget> = {
  schema:  'shared',
  api:     'shared',
  flow:    'shared',
  rules:   'shared',
  test:    'shared',
  diff:    'shared',
  intent:  'shared',
  ref:     'shared',
  state:   'state',
  human:   'human',
};

export interface AimdBlock {
  type: BlockType | string;
  attrs: string;      // attributes after block type (e.g., "User" in :::schema User)
  content: string;
  raw: string;
}

export interface AimdFrontMatter {
  aimd?: string;
  project?: string;
  inherits?: string | string[];
  primer?: string;
  [key: string]: unknown;
}

export interface ParsedAimd {
  frontMatter: AimdFrontMatter;
  blocks: AimdBlock[];
  prose: string;      // prose text outside blocks
  raw: string;
}

export interface AbbrevMap {
  [abbr: string]: string;
}

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  line?: number;
}

export type AcpRole =
  | 'general'
  | 'frontend'
  | 'backend'
  | 'data'
  | 'qa'
  | 'review';
