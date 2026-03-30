# Changelog

All notable changes to the AIMD (AI-Enhanced Markdown) specification and its ecosystem will be documented in this file.

## [1.5.0] - 2026-03-31

### 🚀 Major Specification Upgrade (Verifiable Precision Memory)

- **Introduction of `ref(id)`**: Added support for explicit cross-references between lines and blocks. This ensures referential integrity and prevents semantic drift in multi-agent orchestration.
- **Declarative Testing via `:::test`**: Standardized the `:::test` block with a declarative assertion vocabulary (`file`, `route`, `no_table`, `env`). This enables automated self-verification by AI agents.
- **Temporal Metadata `@date`**: Added support for completion evidence on `v` (verified) lines using the `@YYYY-MM-DD` format.
- **Standardized Line Prefixes**: Updated standard prefixes for `intent` (`g`, `ok`, `in`, `out`), `rules` (`r`, `ban`, `fz`), `state` (`v`, `o`, `a`, `n`, `ask`), and `flow` (`s`).
- **Forbidden Rules (`ban`)**: Formally defined the `ban` prefix for stricter control over AI behavior.

### 🛠️ Ecosystem & Tooling

- **`aimd-vscode` (v0.2.0)**: 
  - Full syntax highlighting support for `ref()`, `@date`, and `:::test`.
  - Added specific scope highlighting for key core blocks.
- **`aimd-cli` (v0.2.0)**:
  - Upgraded parser and generator to comply with v1.5 standards.
  - Implemented **Referential Integrity Scanner** to check for dangling `ref()` IDs.
  - Added strict date format validation.
- **`aimd-validator`**:
  - Enhanced Python and Markdown validator specifications with v1.5 checklists.
  - Updated JSON output schema (v1.5) with `referential_integrity` metrics.

---

## [1.4.0] - 2026-03-29

### ✨ Feature: Solid Memory Initial Standard

- Initial formalization of AIMD as a "Solid Memory" standard.
- Definition of core blocks: `:::intent`, `:::rules`, `:::state`, `:::flow`.
- Introduction of standardized line-id based canonical memory.
- Added basic syntax and semantic validator guidelines.
- Launched `aimd-vscode` extension prototype.
