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
    console.error(chalk.red(`File not found: ${resolved}`));
    process.exit(1);
  }

  const role = options.role ?? 'general';
  const result = buildForAcp(resolved, role);

  if (options.out) {
    fs.writeFileSync(path.resolve(options.out), result, 'utf-8');
    console.log(chalk.green(`✓ ACP saved: ${options.out}`));
  } else {
    console.log(result);
  }
}
