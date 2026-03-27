import * as vscode from 'vscode';
import { parseContent, resolveInherits } from '../parser';

// :::ai 블록 숨김 데코레이터
const hiddenDecoration = vscode.window.createTextEditorDecorationType({
  opacity: '0.3',
});

// 상속된 지시자 표시 데코레이터
const inheritedDecoration = vscode.window.createTextEditorDecorationType({
  after: {
    contentText: ' ↑ inherited',
    color: new vscode.ThemeColor('editorCodeLens.foreground'),
    fontStyle: 'italic',
    margin: '0 0 0 8px',
  },
});

let aiBlocksHidden = false;

export function toggleAiBlocks(editor: vscode.TextEditor) {
  aiBlocksHidden = !aiBlocksHidden;
  updateDecorations(editor);
  vscode.window.showInformationMessage(
    aiBlocksHidden ? 'AIMD: :::ai 블록 숨김' : 'AIMD: :::ai 블록 표시'
  );
}

export function updateDecorations(editor: vscode.TextEditor) {
  const doc = editor.document;
  if (!doc.fileName.endsWith('.aimd') && doc.languageId !== 'aimd') return;

  const parsed = parseContent(doc.getText());
  const config = vscode.workspace.getConfiguration('aimd');
  const opacity = config.get<number>('aiBlockOpacity', 0.3);

  // :::ai 블록 범위 계산
  const aiRanges: vscode.Range[] = [];

  if (aiBlocksHidden) {
    for (const block of parsed.blocks) {
      if (block.type !== 'ai') continue;
      // front matter 오프셋 계산
      const fmLines = getFrontMatterLines(doc.getText());
      const start = new vscode.Position(block.startLine + fmLines, 0);
      const end = new vscode.Position(block.endLine + fmLines, 3);
      aiRanges.push(new vscode.Range(start, end));
    }
  }

  editor.setDecorations(hiddenDecoration, aiRanges);

  // 상속된 지시자 표시
  showInheritedMarkers(editor, parsed);
}

function showInheritedMarkers(editor: vscode.TextEditor, parsed: ReturnType<typeof parseContent>) {
  const filePath = editor.document.fileName;
  const inheritedRanges: vscode.Range[] = [];

  try {
    const { aiBlocks } = resolveInherits(filePath);
    if (aiBlocks.length === 0) return;

    // front matter 라인 수
    const fmLines = getFrontMatterLines(editor.document.getText());

    // 파일 상단에 "N개 규칙 상속됨" 표시
    const firstLine = new vscode.Range(
      new vscode.Position(fmLines, 0),
      new vscode.Position(fmLines, 0)
    );
    inheritedRanges.push(firstLine);
  } catch {
    // 상속 파일 없으면 무시
  }

  editor.setDecorations(inheritedDecoration, inheritedRanges);
}

function getFrontMatterLines(text: string): number {
  const lines = text.split('\n');
  if (lines[0] !== '---') return 0;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') return i + 1;
  }
  return 0;
}
