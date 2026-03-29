import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TokenCounterProvider } from './providers/tokenCounter';
import { AimdCompletionProvider } from './providers/completion';
import { AimdHoverProvider } from './providers/hover';
import { AimdDefinitionProvider } from './providers/definition';
import { toggleStateBlocks, updateDecorations } from './providers/decorator';
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

  // Token counter
  const tokenCounter = new TokenCounterProvider();
  tokenCounter.activate(context);

  // Completion provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      AIMD_SELECTOR,
      new AimdCompletionProvider(),
      ':',  // trigger on :::
      '@',  // trigger on @ annotations
    )
  );

  // Hover provider (block type descriptions)
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(AIMD_SELECTOR, new AimdHoverProvider())
  );

  // @ref Ctrl+click navigation
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(AIMD_SELECTOR, new AimdDefinitionProvider())
  );

  // Update decorations on editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) updateDecorations(editor);
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      const editor = vscode.window.activeTextEditor;
      if (editor && e.document === editor.document) updateDecorations(editor);
    })
  );

  // Apply decorations on activation
  if (vscode.window.activeTextEditor) {
    updateDecorations(vscode.window.activeTextEditor);
  }

  // ─── Commands ───────────────────────────────────────
  
  // AIMD: Welcome & Status
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.welcome', () => {
      const version = vscode.extensions.getExtension('aimd.aimd-vscode')?.packageJSON.version;
      const editor = vscode.window.activeTextEditor;
      const langId = editor?.document.languageId;
      const fileName = editor?.document.fileName;

      let status = `AIMD Extension v${version} is active.\n\n`;
      if (editor) {
        status += `Current file: ${path.basename(fileName || 'unknown')}\n`;
        status += `Language ID: ${langId}\n`;
        if (langId !== 'aimd') {
          status += `\n⚠️ Warning: Language is NOT 'aimd'. Highlighting and snippets might not work.\nPlease click the language selector in the bottom right corner and select 'AIMD'.`;
        }
      } else {
        status += 'Open an .aimd file to see more details.';
      }

      vscode.window.showInformationMessage(status, { modal: true });
    })
  );

  // Ctrl+Shift+A: toggle :::state block visibility
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.toggleStateBlock', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) toggleStateBlocks(editor);
    })
  );

  // Ctrl+Shift+E: copy AI context to clipboard
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.extractForAi', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const filePath = editor.document.fileName;
      if (!filePath.endsWith('.aimd')) {
        vscode.window.showWarningMessage('Only available in .aimd files.');
        return;
      }

      try {
        const content = buildForAi(filePath);
        await vscode.env.clipboard.writeText(content);
        vscode.window.showInformationMessage('✓ AI context copied to clipboard.');
      } catch (e) {
        vscode.window.showErrorMessage(`Error: ${e}`);
      }
    })
  );

  // Convert .md to .aimd
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.convertToAimd', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const srcPath = editor.document.fileName;
      if (!srcPath.endsWith('.md')) {
        vscode.window.showWarningMessage('Only available in .md files.');
        return;
      }

      const outPath = srcPath.replace(/\.md$/, '.aimd');
      if (fs.existsSync(outPath)) {
        const confirm = await vscode.window.showWarningMessage(
          `${path.basename(outPath)} already exists. Overwrite?`,
          'Overwrite', 'Cancel'
        );
        if (confirm !== 'Overwrite') return;
      }

      const content = editor.document.getText();
      const projectName = path.basename(srcPath, '.md');
      const converted = generateAimdFromMarkdown(content, projectName);
      fs.writeFileSync(outPath, converted, 'utf-8');

      const doc = await vscode.workspace.openTextDocument(outPath);
      await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(
        `✓ Converted: ${path.basename(outPath)} — review :::schema and :::api blocks manually.`
      );
    })
  );

  // Normalize .aimd
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.normalizeAimd', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const filePath = editor.document.fileName;
      if (!filePath.endsWith('.aimd')) {
        vscode.window.showWarningMessage('Only available in .aimd files.');
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
      vscode.window.showInformationMessage('✓ AIMD normalized.');
    })
  );

  // Validate .aimd
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.validateAimd', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const filePath = editor.document.fileName;
      const issues = validateAimdContent(editor.document.getText(), filePath);
      output.clear();
      output.appendLine(`AIMD validate: ${path.basename(filePath)}`);

      if (issues.length === 0) {
        output.appendLine('✓ No issues found.');
        output.show(true);
        vscode.window.showInformationMessage('✓ AIMD validation passed.');
        return;
      }

      for (const issue of issues) {
        const lineInfo = issue.line ? `L${issue.line} ` : '';
        output.appendLine(`[${issue.severity}] ${lineInfo}${issue.code}: ${issue.message}`);
      }
      output.show(true);
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warningCount = issues.filter(i => i.severity === 'warning').length;
      vscode.window.showWarningMessage(`AIMD validation: ${errorCount} error(s), ${warningCount} warning(s)`);
    })
  );

  // Extract ACP by role
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.extractAcp', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const filePath = editor.document.fileName;
      if (!filePath.endsWith('.aimd')) {
        vscode.window.showWarningMessage('Only available in .aimd files.');
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
        title: 'Select ACP role',
        placeHolder: 'Extract ACP for role',
      });
      if (!selected) return;

      const content = buildForAcp(filePath, selected.value);
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc, { preview: false });
      await vscode.env.clipboard.writeText(content);
      vscode.window.showInformationMessage(`✓ ${selected.value} ACP extracted (copied to clipboard).`);
    })
  );

  // Generate AIMD from prompt
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.generateFromPrompt', async () => {
      const prompt = await vscode.window.showInputBox({
        title: 'Generate AIMD',
        prompt: 'Enter a PRD or requirement to convert to AIMD',
        ignoreFocusOut: true,
      });
      if (!prompt?.trim()) return;

      const target = await vscode.window.showSaveDialog({
        filters: { AIMD: ['aimd'] },
        saveLabel: 'Save AIMD',
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
      vscode.window.showInformationMessage(`✓ Generated: ${path.basename(target.fsPath)}`);
    })
  );

  // Show inherits chain
  context.subscriptions.push(
    vscode.commands.registerCommand('aimd.showInheritsChain', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || !editor.document.fileName.endsWith('.aimd')) return;

      const chain = buildInheritsChain(editor.document.fileName);
      if (chain.length <= 1) {
        vscode.window.showInformationMessage('This file has no inheritance chain.');
        return;
      }

      const items = chain.map((p, i) => ({
        label: `${'  '.repeat(i)}${i === 0 ? '📄' : '↑'} ${path.basename(p)}`,
        detail: p,
        filePath: p,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        title: 'AIMD Inherits Chain',
        placeHolder: 'Select a file to open',
      });

      if (selected) {
        const doc = await vscode.workspace.openTextDocument(selected.filePath);
        await vscode.window.showTextDocument(doc);
      }
    })
  );

  vscode.window.showInformationMessage('AIMD extension activated.');
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
