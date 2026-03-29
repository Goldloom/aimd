import * as vscode from 'vscode';
import { parseContent } from '../parser';

export class AimdHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
    const lineText = document.lineAt(position).text;

    // Hover on block opener lines (:::blocktype)
    const blockMatch = lineText.match(/^:::(intent|rules|state|flow|schema|api|test|ref|diff|human)(\s|$)/);
    if (blockMatch) {
      const blockType = blockMatch[1];
      const descriptions: Record<string, string> = {
        intent: 'Goals, success criteria, constraints, and exclusions for this context.',
        rules: 'Hard constraints (r), bans (ban), and frozen decisions (fz).',
        state: 'Agent-facing context: verified facts (v), open questions (o), assumptions (a), notes (n), questions (ask).',
        flow: 'Ordered execution steps (s).',
        schema: 'Data structure definition with typed fields and annotations.',
        api: 'API endpoint signatures, auth, params, responses.',
        test: 'Acceptance criteria and QA scenarios.',
        ref: 'Pointers to external resources, commits, or related files.',
        diff: 'Change summary between versions.',
        human: 'Human reviewer note — not read by agents.',
      };
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`**:::${blockType}** — ${descriptions[blockType] ?? 'AIMD block'}`);
      return new vscode.Hover(md);
    }

    return null;
  }
}
