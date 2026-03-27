import * as vscode from 'vscode';
import { parseContent, parseAbbr } from '../parser';

export class AimdHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
    const parsed = parseContent(document.getText());
    const abbrMap = parseAbbr(parsed.blocks);

    if (Object.keys(abbrMap).length === 0) return null;

    const wordRange = document.getWordRangeAtPosition(position, /[A-Z][A-Z0-9/]+/);
    if (!wordRange) return null;

    const word = document.getText(wordRange);
    const full = abbrMap[word];
    if (!full) return null;

    const md = new vscode.MarkdownString();
    md.appendMarkdown(`**${word}** = ${full}`);
    md.appendMarkdown(`\n\n*:::abbr 정의*`);
    return new vscode.Hover(md, wordRange);
  }
}
