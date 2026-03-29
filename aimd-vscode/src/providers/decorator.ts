import * as vscode from 'vscode';
import { parseContent, resolveInherits } from '../parser';

// Dim decorator for :::state blocks when toggled
const hiddenDecoration = vscode.window.createTextEditorDecorationType({
  opacity: '0.3',
});

// Inherited context marker decorator
const inheritedDecoration = vscode.window.createTextEditorDecorationType({
  after: {
    contentText: ' ↑ inherited',
    color: new vscode.ThemeColor('editorCodeLens.foreground'),
    fontStyle: 'italic',
    margin: '0 0 0 8px',
  },
});

let stateBlocksHidden = false;

export function toggleStateBlocks(editor: vscode.TextEditor) {
  stateBlocksHidden = !stateBlocksHidden;
  updateDecorations(editor);
  vscode.window.showInformationMessage(
    stateBlocksHidden ? 'AIMD: :::state blocks dimmed' : 'AIMD: :::state blocks visible'
  );
}

export function updateDecorations(editor: vscode.TextEditor) {
  const doc = editor.document;
  if (!doc.fileName.endsWith('.aimd') && doc.languageId !== 'aimd') return;

  const parsed = parseContent(doc.getText());
  const config = vscode.workspace.getConfiguration('aimd');
  const opacity = config.get<number>('stateBlockOpacity', 0.3);

  // Compute ranges for :::state blocks
  const stateRanges: vscode.Range[] = [];

  if (stateBlocksHidden) {
    for (const block of parsed.blocks) {
      if (block.type !== 'state') continue;
      const fmLines = getFrontMatterLines(doc.getText());
      const start = new vscode.Position(block.startLine + fmLines, 0);
      const end = new vscode.Position(block.endLine + fmLines, 3);
      stateRanges.push(new vscode.Range(start, end));
    }
  }

  editor.setDecorations(hiddenDecoration, stateRanges);

  // Show inherited context markers
  showInheritedMarkers(editor, parsed);
}

function showInheritedMarkers(editor: vscode.TextEditor, parsed: ReturnType<typeof parseContent>) {
  const filePath = editor.document.fileName;
  const inheritedRanges: vscode.Range[] = [];

  try {
    const { stateBlocks } = resolveInherits(filePath);
    if (stateBlocks.length === 0) return;

    const fmLines = getFrontMatterLines(editor.document.getText());

    const firstLine = new vscode.Range(
      new vscode.Position(fmLines, 0),
      new vscode.Position(fmLines, 0)
    );
    inheritedRanges.push(firstLine);
  } catch {
    // no inherited file — ignore
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
