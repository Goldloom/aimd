import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { generateAimdFromMarkdown } from '../parser.js';

export function convertCommand(filePath: string, options: { out?: string }) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(chalk.red(`File not found: ${resolved}`));
    process.exit(1);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const converted = generateAimdFromMarkdown(content, path.basename(filePath));

  const outPath = options.out ?? resolved.replace(/\.md$/, '.aimd');
  fs.writeFileSync(outPath, converted, 'utf-8');
  console.log(chalk.green(`✓ Converted: ${outPath}`));
  console.log(chalk.gray('  Manual review recommended: tables → :::schema, API docs → :::api'));
}
