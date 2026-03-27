export type BlockType =
  | 'schema' | 'api' | 'flow' | 'deps' | 'rules'
  | 'test' | 'diff' | 'intent' | 'abbr'
  | 'ai' | 'human';

export type BlockTarget = 'ai' | 'human' | 'shared';

export const BLOCK_TARGET: Record<BlockType, BlockTarget> = {
  schema:  'shared',
  api:     'shared',
  flow:    'shared',
  deps:    'shared',
  rules:   'shared',
  test:    'shared',
  diff:    'shared',
  intent:  'shared',
  abbr:    'shared',
  ai:      'ai',
  human:   'human',
};

export interface AimdBlock {
  type: BlockType | string;
  attrs: string;      // 블록 타입 뒤 속성 (예: "User" in :::schema User)
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
  prose: string;      // 블록 외 일반 텍스트
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
