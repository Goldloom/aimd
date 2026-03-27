import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { normalizeAimdContent } from '../parser.js';

export function normalizeCommand(filePath: string, options: { out?: string }) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(chalk.red(`파일 없음: ${resolved}`));
    process.exit(1);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  const normalized = normalizeAimdContent(raw, path.basename(resolved));
  const outPath = options.out ? path.resolve(options.out) : resolved;
  fs.writeFileSync(outPath, normalized, 'utf-8');
  console.log(chalk.green(`✓ AIMD 정규화 완료: ${outPath}`));
}
