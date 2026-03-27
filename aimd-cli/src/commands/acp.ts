import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { buildForAcp } from '../parser.js';
import { AcpRole } from '../types.js';

export function acpCommand(
  filePath: string,
  options: { role?: AcpRole; out?: string }
) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(chalk.red(`파일 없음: ${resolved}`));
    process.exit(1);
  }

  const role = options.role ?? 'general';
  const result = buildForAcp(resolved, role);

  if (options.out) {
    fs.writeFileSync(path.resolve(options.out), result, 'utf-8');
    console.log(chalk.green(`✓ ACP 저장: ${options.out}`));
  } else {
    console.log(result);
  }
}
