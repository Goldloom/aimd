import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { generateAimdFromMarkdown } from '../parser.js';

export function convertCommand(filePath: string, options: { out?: string }) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(chalk.red(`파일 없음: ${resolved}`));
    process.exit(1);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const converted = generateAimdFromMarkdown(content, path.basename(filePath));

  const outPath = options.out ?? resolved.replace(/\.md$/, '.aimd');
  fs.writeFileSync(outPath, converted, 'utf-8');
  console.log(chalk.green(`✓ 변환 완료: ${outPath}`));
  console.log(chalk.gray('  수동 검토 권장: 테이블 → :::schema, API 문서 → :::api'));
}
