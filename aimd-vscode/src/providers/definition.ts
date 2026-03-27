import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class AimdDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Definition | null {
    const line = document.lineAt(position).text;

    // @ref:경로 패턴 감지
    const refMatch = line.match(/@ref:([^\s]+)/);
    if (!refMatch) return null;

    const refPath = refMatch[1];
    const dir = path.dirname(document.fileName);

    // 라인 범위 포함 처리: path:L10-L20
    const [filePart] = refPath.split(':L');
    const resolved = path.resolve(dir, filePart);

    if (!fs.existsSync(resolved)) return null;

    const targetUri = vscode.Uri.file(resolved);
    return new vscode.Location(targetUri, new vscode.Position(0, 0));
  }
}
