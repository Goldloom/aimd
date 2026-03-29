import * as vscode from 'vscode';

const BLOCK_TYPES = [
  { label: 'intent', detail: 'Implementation intent and goals', snippet: 'intent ${1:feature}\ng1: ${0}\n:::' },
  { label: 'rules', detail: 'Constraints and coding rules', snippet: 'rules\nr1: ${0}\n:::' },
  { label: 'state', detail: 'Agent-facing context: verified facts, assumptions, open items', snippet: 'state\nv1: ${1}\no1: ${0}\n:::' },
  { label: 'flow', detail: 'Execution flow / logic sequence', snippet: 'flow ${1:name}\ns1: ${0}\n:::' },
  { label: 'schema', detail: 'Data structure definition', snippet: 'schema ${1:Name}\n$0\n:::' },
  { label: 'api', detail: 'API endpoint definition', snippet: 'api\n${1:GET} /${2:path} -> ${3:Type}\n  @auth: Bearer\n  @ok 200: ${3:Type}\n  @err 404: NOT_FOUND\n:::' },
  { label: 'test', detail: 'Test scenarios and acceptance criteria', snippet: 'test ${1:Target}\n✓ ${2:valid case}\n✗ ${3:invalid case}\n@mock: ${0}\n:::' },
  { label: 'ref', detail: 'External references and pointers', snippet: 'ref\nref1: ${0}\n:::' },
  { label: 'diff', detail: 'Change summary', snippet: 'diff ${1:v1} -> ${2:v2}\n+ ${0}\n:::' },
  { label: 'human', detail: 'Human reviewer note (AI skips this)', snippet: 'human\n${0}\n:::' },
];

const STATE_DIRECTIVES = [
  { label: 'v1:', detail: 'Verified fact (confirmed from source)', snippet: 'v1: $0' },
  { label: 'v2:', detail: 'Verified fact #2', snippet: 'v2: $0' },
  { label: 'o1:', detail: 'Open question / missing information', snippet: 'o1: $0' },
  { label: 'o2:', detail: 'Open question #2', snippet: 'o2: $0' },
  { label: 'a1:', detail: 'Assumption (inferred, not confirmed)', snippet: 'a1: $0' },
  { label: 'a2:', detail: 'Assumption #2', snippet: 'a2: $0' },
  { label: 'n1:', detail: 'Note (general context)', snippet: 'n1: $0' },
  { label: 'ask1:', detail: 'Question for the next agent', snippet: 'ask1: $0' },
];

const SCHEMA_ANNOTATIONS = [
  { label: '@unique', detail: 'Unique value constraint' },
  { label: '@format(email)', detail: 'Email format', snippet: '@format($1)' },
  { label: '@min(0)', detail: 'Minimum value', snippet: '@min($1)' },
  { label: '@max(100)', detail: 'Maximum value', snippet: '@max($1)' },
  { label: '@rel(1:N)', detail: 'Relationship', snippet: '@rel($1)' },
  { label: '@fk()', detail: 'Foreign key', snippet: '@fk($1)' },
  { label: '@auto', detail: 'Auto-updated field' },
  { label: '@since()', detail: 'Added in version', snippet: '@since(v$1)' },
  { label: '@deprecated()', detail: 'Deprecated since version', snippet: '@deprecated(v$1)' },
];

export class AimdCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] {
    const lineText = document.lineAt(position).text;
    const textBefore = lineText.substring(0, position.character);

    // Suggest block types after :::
    if (textBefore.match(/^:::(\w*)$/)) {
      return BLOCK_TYPES.map(b => {
        const item = new vscode.CompletionItem(b.label, vscode.CompletionItemKind.Snippet);
        item.detail = b.detail;
        item.insertText = new vscode.SnippetString(b.snippet);
        item.filterText = b.label;
        return item;
      });
    }

    // Suggest line-id directives inside :::state block
    if (this.isInsideBlock(document, position, 'state') && textBefore.trim() === '') {
      return STATE_DIRECTIVES.map(d => {
        const item = new vscode.CompletionItem(d.label, vscode.CompletionItemKind.Keyword);
        item.detail = d.detail;
        if (d.snippet) item.insertText = new vscode.SnippetString(d.snippet);
        return item;
      });
    }

    // Suggest @annotations inside :::schema block
    if (this.isInsideBlock(document, position, 'schema') && textBefore.includes('@')) {
      return SCHEMA_ANNOTATIONS.map(a => {
        const item = new vscode.CompletionItem(a.label, vscode.CompletionItemKind.Value);
        item.detail = a.detail;
        if (a.snippet) item.insertText = new vscode.SnippetString(a.snippet);
        return item;
      });
    }

    return [];
  }

  private isInsideBlock(doc: vscode.TextDocument, pos: vscode.Position, blockType: string): boolean {
    for (let i = pos.line - 1; i >= 0; i--) {
      const line = doc.lineAt(i).text;
      if (line.startsWith(`:::${blockType}`)) return true;
      if (line.match(/^:::\w+/)) return false;
      if (line === ':::') return false;
    }
    return false;
  }
}
