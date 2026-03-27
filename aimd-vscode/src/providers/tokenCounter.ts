import * as vscode from 'vscode';
import { parseContent, countTokens, buildForAi } from '../parser';
import * as fs from 'fs';

export class TokenCounterProvider {
  private statusBar: vscode.StatusBarItem;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBar.tooltip = 'AIMD 토큰 수 (클릭: AI용 빌드 기준)';
    this.statusBar.command = 'aimd.toggleTokenMode';
    this.disposables.push(this.statusBar);
  }

  activate(context: vscode.ExtensionContext) {
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(() => this.update()),
      vscode.workspace.onDidChangeTextDocument(() => this.update()),
    );
    this.update();
    context.subscriptions.push(...this.disposables);
  }

  private update() {
    const editor = vscode.window.activeTextEditor;
    const config = vscode.workspace.getConfiguration('aimd');
    const show = config.get<boolean>('showTokenCountInStatusBar', true);

    if (!editor || !show) {
      this.statusBar.hide();
      return;
    }

    const doc = editor.document;
    const isAimd = doc.languageId === 'aimd' || doc.fileName.endsWith('.aimd');
    if (!isAimd) {
      this.statusBar.hide();
      return;
    }

    const text = doc.getText();
    const total = countTokens(text);

    // AI용 빌드 토큰도 계산
    let aiTokens = total;
    try {
      if (doc.uri.scheme === 'file') {
        const aiContent = buildForAi(doc.fileName);
        aiTokens = countTokens(aiContent);
      }
    } catch {
      // 파일 접근 실패 시 무시
    }

    const parsed = parseContent(text);
    const humanBlocks = parsed.blocks.filter(b => b.type === 'human');
    const humanTokens = humanBlocks.reduce((sum, b) => sum + countTokens(b.content), 0);

    this.statusBar.text = `$(symbol-number) ${total} tok`;
    if (aiTokens !== total) {
      this.statusBar.text += ` (AI: ${aiTokens})`;
    }
    this.statusBar.show();
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}
