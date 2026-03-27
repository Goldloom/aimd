import path from 'path';
import chalk from 'chalk';
import { validateAimdFile } from '../parser.js';

export function validateCommand(filePath: string) {
  const resolved = path.resolve(filePath);
  const issues = validateAimdFile(resolved);

  if (issues.length === 0) {
    console.log(chalk.green(`✓ 유효함: ${resolved}`));
    return;
  }

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  console.log(chalk.yellow(`검사 결과: error ${errorCount}, warning ${warningCount}`));

  for (const issue of issues) {
    const color = issue.severity === 'error' ? chalk.red : chalk.yellow;
    const lineInfo = issue.line ? `L${issue.line} ` : '';
    console.log(color(`- [${issue.severity}] ${lineInfo}${issue.code}: ${issue.message}`));
  }

  if (errorCount > 0) process.exitCode = 1;
}
