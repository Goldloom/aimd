# aimd-cli

CLI for AIMD v1.4 (AI-Enhanced Markdown) — build, validate, convert, token-count, normalize, and generate `.aimd` files.

## Install

```bash
npm install -g aimd-cli
```

## Commands

| Command | Description |
|---------|-------------|
| `aimd validate <file>` | Validate an `.aimd` file (syntax + semantic checks) |
| `aimd build <file>` | Build AI-view or human-view output from an `.aimd` file |
| `aimd tokens <file>` | Count tokens per block (cl100k_base / gpt-4o baseline) |
| `aimd convert <file.md>` | Convert a Markdown file to AIMD v1.4 format |
| `aimd normalize <file>` | Add missing core blocks to an existing `.aimd` file |
| `aimd acp <file>` | Extract role-specific ACP (Agent Context Projection) |
| `aimd generate` | Generate an `.aimd` file from a prompt or Markdown source |

## Examples

```bash
# Validate
aimd validate my-feature.aimd

# Token count for AI view (excludes :::human blocks)
aimd tokens my-feature.aimd --for-ai

# Convert Markdown to AIMD
aimd convert spec.md --out spec.aimd

# ACP for frontend role
aimd acp my-feature.aimd --role frontend --out handoff.aimd

# Generate from prompt (LLM)
aimd generate --prompt "Payment retry with exponential backoff" --llm --out payment-retry.aimd
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `AIMD_LLM_API_KEY` | API key for LLM generation (or `OPENAI_API_KEY`) |
| `AIMD_LLM_BASE_URL` | Base URL for OpenAI-compatible API (default: `https://api.openai.com/v1`) |
| `AIMD_LLM_MODEL` | Model name (default: `gpt-4.1-mini`) |

## AIMD v1.4 block overview

Core blocks (required, in order): `:::intent`, `:::rules`, `:::state`, `:::flow`

Optional blocks: `:::schema`, `:::api`, `:::test`, `:::ref`, `:::diff`, `:::human`

See [spec/AIMD-v1.4.md](../spec/AIMD-v1.4.md) for full specification.

## License

MIT
