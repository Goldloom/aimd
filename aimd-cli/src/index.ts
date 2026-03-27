#!/usr/bin/env node
import { Command } from 'commander';
import { buildCommand } from './commands/build.js';
import { tokensCommand } from './commands/tokens.js';
import { convertCommand } from './commands/convert.js';
import { normalizeCommand } from './commands/normalize.js';
import { validateCommand } from './commands/validate.js';
import { acpCommand } from './commands/acp.js';
import { generateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('aimd')
  .description('AIMD (AI-Enhanced Markdown) CLI')
  .version('0.1.0');

program
  .command('build <file>')
  .description('Build an AIMD file with inherits merged')
  .option('--for-ai', 'Build AI-facing output')
  .option('--for-human', 'Build human-facing output')
  .option('-o, --out <path>', 'Output file path')
  .action(buildCommand);

program
  .command('tokens <file>')
  .description('Estimate token usage')
  .option('--for-ai', 'Measure tokens against AI-facing output')
  .action(tokensCommand);

program
  .command('convert <file>')
  .description('Convert Markdown into AIMD')
  .option('-o, --out <path>', 'Output file path')
  .action(convertCommand);

program
  .command('normalize <file>')
  .description('Normalize an AIMD file by filling missing structure')
  .option('-o, --out <path>', 'Output file path')
  .action(normalizeCommand);

program
  .command('validate <file>')
  .description('Validate an AIMD file')
  .action(validateCommand);

program
  .command('acp <file>')
  .description('Extract role-specific ACP')
  .option('-r, --role <role>', 'general | frontend | backend | data | qa | review')
  .option('-o, --out <path>', 'Output file path')
  .action(acpCommand);

program
  .command('generate')
  .description('Generate AIMD from prompt or Markdown source')
  .option('-p, --prompt <text>', 'Source prompt text')
  .option('--prompt-file <path>', 'Source prompt or Markdown file path')
  .option('-t, --title <title>', 'Output document title')
  .option('-o, --out <path>', 'Output file path')
  .option('--llm', 'Use an external LLM through an OpenAI-compatible API')
  .option('--model <name>', 'Model name for --llm mode')
  .option('--base-url <url>', 'Base URL for --llm mode')
  .option('--strict', 'Disable rule-based fallback when --llm fails')
  .action(generateCommand);

program.parse();
