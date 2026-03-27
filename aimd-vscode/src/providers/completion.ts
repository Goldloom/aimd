import * as vscode from 'vscode';

const BLOCK_TYPES = [
  { label: 'schema', detail: '데이터 구조 정의', snippet: 'schema ${1:Name}\n$0\n:::' },
  { label: 'api', detail: 'API 엔드포인트 정의', snippet: 'api\n${1:GET} /${2:path} -> ${3:Type}\n  @auth: Bearer\n  @ok 200: ${3:Type}\n  @err 404: NOT_FOUND\n:::' },
  { label: 'flow', detail: '로직 흐름', snippet: 'flow ${1:name}\n1. ${0}\n:::' },
  { label: 'ai', detail: 'AI 전용 컨텍스트', snippet: 'ai\nCRITICAL[1]: ${1}\n:::' },
  { label: 'rules', detail: '코딩 규칙', snippet: 'rules\nnaming:\n  ${0}\n:::' },
  { label: 'deps', detail: '의존 관계', snippet: 'deps\n${1:Module}\n  -> ${0}\n:::' },
  { label: 'test', detail: '테스트 시나리오', snippet: 'test ${1:Target}\n✓ ${2:valid case}\n✗ ${3:invalid case}\n@mock: ${0}\n:::' },
  { label: 'diff', detail: '변경 요약', snippet: 'diff ${1:v1} -> ${2:v2}\n+ ${0}\n:::' },
  { label: 'intent', detail: '구현 의도', snippet: 'intent ${1:feature}\n목표: ${0}\n:::' },
  { label: 'abbr', detail: '약어 사전', snippet: 'abbr\n${1:DTO} = ${2:Data Transfer Object}\n:::' },
  { label: 'human', detail: '인간 전용 메모 (AI 스킵)', snippet: 'human\n${0}\n:::' },
];

const AI_DIRECTIVES = [
  { label: 'CRITICAL[1]:', detail: '최우선 필수 규칙', snippet: 'CRITICAL[1]: $0' },
  { label: 'CRITICAL[2]:', detail: '차순위 필수 규칙', snippet: 'CRITICAL[2]: $0' },
  { label: 'WARN:', detail: '경고 (가능하면 따를 것)', snippet: 'WARN: $0' },
  { label: 'CTX:', detail: '프로젝트 배경 정보', snippet: 'CTX: $0' },
  { label: 'DO:', detail: '이렇게 할 것', snippet: 'DO: $0' },
  { label: 'DONT:', detail: '이렇게 하지 말 것', snippet: 'DONT: $0' },
  { label: 'FREEZE:', detail: '수정 금지', snippet: 'FREEZE: $0' },
  { label: 'UNFREEZE:', detail: '상속된 FREEZE 해제', snippet: 'UNFREEZE: $0' },
  { label: 'DEBT:', detail: '기술 부채 (알고만 있을 것)', snippet: 'DEBT: $0' },
  { label: 'PERF:', detail: '성능 요구사항', snippet: 'PERF: $0' },
  { label: 'TODO:', detail: '미완성 작업', snippet: 'TODO: $0' },
];

const SCHEMA_ANNOTATIONS = [
  { label: '@unique', detail: '유일값' },
  { label: '@format(email)', detail: '이메일 형식', snippet: '@format($1)' },
  { label: '@min(0)', detail: '최솟값', snippet: '@min($1)' },
  { label: '@max(100)', detail: '최댓값', snippet: '@max($1)' },
  { label: '@rel(1:N)', detail: '관계', snippet: '@rel($1)' },
  { label: '@fk()', detail: '외래키', snippet: '@fk($1)' },
  { label: '@auto', detail: '자동 업데이트' },
  { label: '@since()', detail: '추가된 버전', snippet: '@since(v$1)' },
  { label: '@deprecated()', detail: '제거 예정 버전', snippet: '@deprecated(v$1)' },
];

export class AimdCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] {
    const lineText = document.lineAt(position).text;
    const textBefore = lineText.substring(0, position.character);

    // ::: 입력 시 블록 타입 제안
    if (textBefore.match(/^:::(\w*)$/)) {
      return BLOCK_TYPES.map(b => {
        const item = new vscode.CompletionItem(b.label, vscode.CompletionItemKind.Snippet);
        item.detail = b.detail;
        item.insertText = new vscode.SnippetString(b.snippet);
        item.filterText = b.label;
        return item;
      });
    }

    // :::ai 블록 안에서 지시자 제안
    if (this.isInsideBlock(document, position, 'ai') && textBefore.trim() === '') {
      return AI_DIRECTIVES.map(d => {
        const item = new vscode.CompletionItem(d.label, vscode.CompletionItemKind.Keyword);
        item.detail = d.detail;
        if (d.snippet) item.insertText = new vscode.SnippetString(d.snippet);
        return item;
      });
    }

    // :::schema 블록 안에서 @annotation 제안
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
