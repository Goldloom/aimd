import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getEncoding } from 'js-tiktoken';
import { parseFile, buildForAi } from '../parser.js';
import { BLOCK_TARGET } from '../types.js';

export function tokensCommand(filePath: string, options: { forAi?: boolean }) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(chalk.red(`파일 없음: ${resolved}`));
    process.exit(1);
  }

  const enc = getEncoding('cl100k_base'); // gpt-4o 기준
  const count = (text: string) => enc.encode(text).length;

  const parsed = parseFile(resolved);
  const { blocks, prose } = parsed;

  const content = options.forAi ? buildForAi(resolved) : fs.readFileSync(resolved, 'utf-8');
  const total = count(content);

  console.log(chalk.bold(`\n토큰 분석: ${path.basename(filePath)}\n`));
  console.log(chalk.gray('─'.repeat(50)));

  // 블록별 분석
  for (const block of blocks) {
    const target = BLOCK_TARGET[block.type as keyof typeof BLOCK_TARGET] ?? 'shared';
    const tokens = count(block.raw);
    const label = target === 'ai' ? chalk.blue(`:::${block.type}`) :
                  target === 'human' ? chalk.gray(`:::${block.type}`) :
                  chalk.green(`:::${block.type}`);
    const name = block.attrs ? ` ${block.attrs}` : '';
    const skip = (options.forAi && target === 'human') ? chalk.gray(' (스킵)') : '';
    console.log(`${label}${name}${skip}  ${chalk.yellow(tokens + ' tok')}`);
  }

  if (prose) {
    console.log(`${chalk.white('prose')}  ${chalk.yellow(count(prose) + ' tok')}`);
  }

  console.log(chalk.gray('─'.repeat(50)));

  if (options.forAi) {
    const humanTokens = count(blocks.filter(b => BLOCK_TARGET[b.type as keyof typeof BLOCK_TARGET] === 'human').map(b => b.raw).join(''));
    console.log(chalk.bold(`총합 (AI용): ${chalk.yellow(total + ' tok')}`));
    if (humanTokens > 0) {
      console.log(chalk.gray(`  :::human 블록 제외: ${humanTokens} tok 절감`));
    }
  } else {
    console.log(chalk.bold(`총합: ${chalk.yellow(total + ' tok')}`));
  }
  console.log('');

}
