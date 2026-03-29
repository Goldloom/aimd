# aimd-vscode

VS Code extension for AIMD v1.4 (AI-Enhanced Markdown).

## Features

- **Syntax highlighting** — distinct colors for `:::state`, `:::schema`, `:::api`, `:::human`, and other blocks
- **Token counter** — live token count in the status bar (cl100k_base / gpt-4o baseline)
- **Completion** — block type snippets after `:::`, line-id directives inside `:::state`, `@annotations` inside `:::schema`
- **Hover** — block type descriptions on hover
- **Normalize** — add missing core blocks to any `.aimd` file
- **Validate** — syntax and semantic validation output
- **ACP extraction** — extract role-specific context (frontend / backend / qa / etc.)
- **Convert** — convert `.md` to `.aimd` with the rule-based generator
- **Generate** — generate `.aimd` from a prompt (LLM or rule-based fallback)
- **Inherits chain** — visualize and navigate the inheritance chain

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| AIMD: Toggle :::state block visibility | `Ctrl+Shift+A` | Dim/show :::state blocks |
| AIMD: Copy AI context to clipboard | `Ctrl+Shift+E` | Build AI view and copy |
| AIMD: Convert .md to .aimd | — | Rule-based conversion |
| AIMD: Generate .aimd from prompt | — | LLM or rule-based generation |
| AIMD: Normalize .aimd | — | Add missing core blocks |
| AIMD: Validate .aimd | — | Show validation issues |
| AIMD: Extract ACP by role | — | Role-specific context extraction |
| AIMD: Show inherits chain | — | Navigate parent `.aimd` files |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `aimd.tokenModel` | `cl100k_base` | Token counter baseline model |
| `aimd.showTokenCountInStatusBar` | `true` | Show token count in status bar |
| `aimd.stateBlockOpacity` | `0.4` | Opacity of :::state blocks when dimmed |

## LLM generation

Set one of these environment variables to enable LLM-powered generation:

```
AIMD_LLM_API_KEY=sk-...
OPENAI_API_KEY=sk-...
AIMD_LLM_BASE_URL=https://api.openai.com/v1   # optional, for custom endpoints
AIMD_LLM_MODEL=gpt-4.1-mini                   # optional
```

## AIMD v1.4 quick reference

Core blocks (required, in order): `:::intent` → `:::rules` → `:::state` → `:::flow`

See [spec/AIMD-v1.4.md](../spec/AIMD-v1.4.md) for full specification.

## License

MIT
