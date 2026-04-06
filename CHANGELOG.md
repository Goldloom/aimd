# Changelog

All notable public-facing changes to AIMD are documented here.

This changelog distinguishes between:

- legacy public specs
- the public AIMD Core v2 draft
- repository-level documentation changes

---

## [2.0-core-draft] - 2026-04-06

### Public Positioning Update

- Repositioned the repository around a public `AIMD Core v2` draft plus legacy public specs.
- Clarified that `AIMD v1.5` and earlier remain the public legacy line.
- Clarified that higher AIMD layers, commercial implementations, and hosted products may evolve separately.

### New Public Core Spec

- Added `spec/en/AIMD-core-v2.md`.
- Added `spec/ko/AIMD-core-v2-ko.md`.
- Defined the minimal public Core around:
  - front matter
  - `:::intent`
  - `:::rules`
  - `:::state`
  - `:::flow`
  - optional `:::diff`

### Documentation Refresh

- Rewrote `README.md` and `README-ko.md` for the public Core strategy.
- Rewrote `GUIDE.md` and `GUIDE-ko.md` as practical getting-started guides for AIMD Core.
- Rewrote `PHILOSOPHY.md` and `PHILOSOPHY-ko.md` around the shift from prompting to canonical memory.
- Updated `CONTRIBUTING.md` and added Korean contribution guidance.

---

## [1.5.0] - 2026-03-31

### Major Specification Upgrade

- Introduced `ref(id)` for explicit cross-references between lines and blocks.
- Added `:::test` for declarative verification.
- Added completion evidence on `v` lines with `@YYYY-MM-DD`.
- Standardized key line prefixes across `intent`, `rules`, `state`, and `flow`.
- Formalized `ban` for explicit forbidden outcomes.

### Ecosystem and Tooling

- Updated `aimd-vscode` to highlight `ref()`, `@date`, and `:::test`.
- Updated `aimd-cli` parser and generator for v1.5 behavior.
- Improved validator guidance for referential integrity and date validation.

---

## [1.4.0] - 2026-03-29

### Initial Public Standard

- Introduced AIMD as a canonical memory format for AI collaboration.
- Defined the four core blocks: `:::intent`, `:::rules`, `:::state`, `:::flow`.
- Introduced stable line IDs and baseline validator guidance.
- Published the initial public repository structure and tooling direction.

---

SPDX-License-Identifier: Apache-2.0
