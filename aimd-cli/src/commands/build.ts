import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { buildForAi, buildForHuman } from '../parser.js';

export function buildCommand(filePath: string, options: { forAi?: boolean; forHuman?: boolean; out?: string }) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(chalk.red(`파일 없음: ${resolved}`));
    process.exit(1);
  }

  const isAi = options.forAi ?? !options.forHuman;
  const result = isAi ? buildForAi(resolved) : buildForHuman(resolved);

  if (options.out) {
    fs.writeFileSync(path.resolve(options.out), result, 'utf-8');
    console.log(chalk.green(`✓ 저장: ${options.out}`));
  } else {
    console.log(result);
  }
}
