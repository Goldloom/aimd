import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TokenCounterProvider } from './providers/tokenCounter';
import { AimdCompletionProvider } from './providers/completion';
import { AimdHoverProvider } from './providers/hover';
import { AimdDefinitionProvider } from './providers/definition';
import { toggleAiBlocks, updateDecorations } from './providers/decorator';
import {
  buildForAcp,
  buildForAi,
  generateAimdFromMarkdown,
  generateAimdFromPrompt,
  normalizeAimdContent,
  parseFile,
  validateAimdContent,
  AcpRole,
} from './parser';
import { generateAimdWithLlm } from './llm';

const AIMD_SELECTOR: vscode.DocumentSelector = [
  { language: 'aimd' },
  { pattern: '**/*.aimd' },
];

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel('AIMD');

  // 토큰 카운터
  const tokenCounter = new TokenCounterProvider();
  tokenCounter.activate(context);

  // 자동완성
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      AIMD_SELECTOR,
      new AimdCompletionProvider(),
      ':',  // ::: 입력 시 트리거
      '@',  // @ annotation 트리거
    )
  );

  // 호버 (:::abbr 정의)
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(AIMD_SELECTOR, new AimdHoverProvider())
  );

  // @ref Ctrl+클릭 네비게이션
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(AIMD_SELECTOR, new AimdDefinitionProvider())
  );

  // 에디터 변경 시 데코레이터 업데이트
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) updateDecorations(editor);
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      const editor = vscode.window.activeTextEditor;
      if (editor && e.document === editor.document) updateDecorations(editor);
    })
  );

  // 초기 데코레이터 적용
  if (vscode.window.activeTextEditor) {
    updateDecorations(vscode.window.activeTextEditor);
  }

  // ─── 커맨드 등록 ───────────────────────────────────────

  // Ctrl+Shift+A: :::ai 블록 토글
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.toggleAiBlock', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) toggleAiBlocks(editor);
    })
  );

  // Ctrl+Shift+E: AI용 컨텍스트 클립보드 복사
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.extractForAi', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const filePath = editor.document.fileName;
      if (!filePath.endsWith('.aimd')) {
        vscode.window.showWarningMessage('AIMD 파일에서만 사용 가능합니다.');
        return;
      }

      try {
        const content = buildForAi(filePath);
        await vscode.env.clipboard.writeText(content);
        vscode.window.showInformationMessage('✓ AI용 컨텍스트를 클립보드에 복사했습니다.');
      } catch (e) {
        vscode.window.showErrorMessage(`오류: ${e}`);
      }
    })
  );

  // .md → .aimd 변환
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.convertToAimd', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const srcPath = editor.document.fileName;
      if (!srcPath.endsWith('.md')) {
        vscode.window.showWarningMessage('.md 파일에서만 사용 가능합니다.');
        return;
      }

      const outPath = srcPath.replace(/\.md$/, '.aimd');
      if (fs.existsSync(outPath)) {
        const confirm = await vscode.window.showWarningMessage(
          `${path.basename(outPath)} 이미 존재합니다. 덮어쓸까요?`,
          '덮어쓰기', '취소'
        );
        if (confirm !== '덮어쓰기') return;
      }

      const content = editor.document.getText();
      const projectName = path.basename(srcPath, '.md');
      const converted = generateAimdFromMarkdown(content, projectName);
      fs.writeFileSync(outPath, converted, 'utf-8');

      const doc = await vscode.workspace.openTextDocument(outPath);
      await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(
        `✓ 변환 완료: ${path.basename(outPath)} — :::schema, :::api 블록을 수동으로 확인하세요.`
      );
    })
  );

  // .aimd 정규화
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.normalizeAimd', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const filePath = editor.document.fileName;
      const isAimd = filePath.endsWith('.aimd');
      if (!isAimd) {
        vscode.window.showWarningMessage('.aimd 파일에서만 사용 가능합니다.');
        return;
      }

      const normalized = normalizeAimdContent(editor.document.getText(), path.basename(filePath));
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      );
      edit.replace(editor.document.uri, fullRange, normalized);
      await vscode.workspace.applyEdit(edit);
      await editor.document.save();
      vscode.window.showInformationMessage('✓ AIMD 정규화 완료');
    })
  );

  // AIMD 검증
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.validateAimd', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const filePath = editor.document.fileName;
      const issues = validateAimdContent(editor.document.getText(), filePath);
      output.clear();
      output.appendLine(`AIMD validate: ${path.basename(filePath)}`);

      if (issues.length === 0) {
        output.appendLine('✓ issues 없음');
        output.show(true);
        vscode.window.showInformationMessage('✓ AIMD 검증 통과');
        return;
      }

      for (const issue of issues) {
        const lineInfo = issue.line ? `L${issue.line} ` : '';
        output.appendLine(`[${issue.severity}] ${lineInfo}${issue.code}: ${issue.message}`);
      }
      output.show(true);
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      vscode.window.showWarningMessage(`AIMD 검증 결과: error ${errorCount}, warning ${warningCount}`);
    })
  );

  // 역할별 ACP 추출
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.extractAcp', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const filePath = editor.document.fileName;
      if (!filePath.endsWith('.aimd')) {
        vscode.window.showWarningMessage('.aimd 파일에서만 사용 가능합니다.');
        return;
      }

      const roleItems: { label: string; value: AcpRole }[] = [
        { label: 'general', value: 'general' },
        { label: 'frontend', value: 'frontend' },
        { label: 'backend', value: 'backend' },
        { label: 'data', value: 'data' },
        { label: 'qa', value: 'qa' },
        { label: 'review', value: 'review' },
      ];

      const selected = await vscode.window.showQuickPick(roleItems, {
        title: 'ACP 역할 선택',
        placeHolder: '역할별 ACP 추출',
      });
      if (!selected) return;

      const content = buildForAcp(filePath, selected.value);
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc, { preview: false });
      await vscode.env.clipboard.writeText(content);
      vscode.window.showInformationMessage(`✓ ${selected.value} ACP 추출 완료 (클립보드 복사됨)`);
    })
  );

  // prompt 기반 AIMD 생성
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.generateFromPrompt', async () => {
      const prompt = await vscode.window.showInputBox({
        title: 'AIMD 생성',
        prompt: 'AIMD로 구조화할 PRD/요구사항을 입력하세요',
        ignoreFocusOut: true,
      });
      if (!prompt?.trim()) return;

      const target = await vscode.window.showSaveDialog({
        filters: { AIMD: ['aimd'] },
        saveLabel: 'AIMD 저장',
      });
      if (!target) return;

      const title = path.basename(target.fsPath, '.aimd');
      let content = generateAimdFromPrompt(prompt, title);

      if (process.env.AIMD_LLM_API_KEY || process.env.OPENAI_API_KEY) {
        try {
          const result = await generateAimdWithLlm({
            sourceText: prompt,
            title,
            sourceType: 'prompt',
            allowFallback: true,
          });
          content = result.content;
        } catch (error) {
          output.appendLine(`LLM generate fallback: ${String(error)}`);
        }
      }

      fs.writeFileSync(target.fsPath, content, 'utf-8');
      const doc = await vscode.workspace.openTextDocument(target.fsPath);
      await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(`✓ AIMD 생성 완료: ${path.basename(target.fsPath)}`);
    })
  );

  // 상속 체인 보기
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.showInheritsChain', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || !editor.document.fileName.endsWith('.aimd')) return;

      const chain = buildInheritsChain(editor.document.fileName);
      if (chain.length <= 1) {
        vscode.window.showInformationMessage('이 파일은 상속 관계가 없습니다.');
        return;
      }

      const items = chain.map((p, i) => ({
        label: `${'  '.repeat(i)}${i === 0 ? '📄' : '↑'} ${path.basename(p)}`,
        detail: p,
        filePath: p,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        title: 'AIMD 상속 체인',
        placeHolder: '파일을 선택하면 열립니다',
      });

      if (selected) {
        const doc = await vscode.workspace.openTextDocument(selected.filePath);
        await vscode.window.showTextDocument(doc);
      }
    })
  );

  vscode.window.showInformationMessage('AIMD 확장이 활성화됐습니다.');
  context.subscriptions.push(output);
}

export function deactivate() {}

function buildInheritsChain(filePath: string, visited = new Set<string>()): string[] {
  const resolved = path.resolve(filePath);
  if (visited.has(resolved) || !fs.existsSync(resolved)) return [filePath];
  visited.add(resolved);

  try {
    const parsed = parseFile(filePath);
    const inherits = parsed.frontMatter.inherits;
    if (!inherits) return [filePath];

    const inheritList = Array.isArray(inherits) ? inherits : [inherits];
    const dir = path.dirname(filePath);
    const result: string[] = [filePath];

    for (const rel of inheritList) {
      const parentPath = path.resolve(dir, rel);
      const parentChain = buildInheritsChain(parentPath, visited);
      result.push(...parentChain);
    }

    return result;
  } catch {
    return [filePath];
  }
}
