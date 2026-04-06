# AIMD

AI-readable, AI-writable canonical memory for multi-agent work.

[한국어 README](README-ko.md)

[![Spec](https://img.shields.io/badge/spec-AIMD_Core_v2-blue)](spec/en/AIMD-core-v2.md)
[![Legacy](https://img.shields.io/badge/legacy-v1.5-orange)](spec/en/AIMD-v1.5.md)

> **License notice**
> Public spec history through v1.5: [Apache License 2.0](LICENSE)
> Public AIMD Core v2 specification files explicitly released in this repository: Apache License 2.0
> AIMD extensions, commercial implementations, and hosted products: [Commercial License](LICENSE-COMMERCIAL.md) applies
> Scope and path-level interpretation: [License Policy](LICENSE-POLICY.md)

---

## What is AIMD?

AIMD is a document format for AI-to-AI and human-to-AI handoff.

Most documents are optimized for humans to read.
AIMD is optimized for:

- semantic clarity
- low token cost
- explicit constraints
- stable handoff across agents

The idea is simple:

```text
Human defines intent and constraints
AI writes canonical memory
Next AI resumes from the same canonical state
```

---

## Public Scope of This Repository

This repository now distinguishes between:

1. **Public AIMD Core**
   - minimal canonical grammar
   - validator-facing rules
   - intended for broad adoption and interoperability

2. **Legacy Public Specs**
   - historical v1.4 and v1.5 documents
   - preserved for reference

3. **Non-core / Commercial Layers**
   - advanced extensions
   - enterprise workflow tooling
   - hosted services and orchestration products

If you are new to AIMD, start with the Core.

---

## Start Here

- [AIMD Core v2 Draft](spec/en/AIMD-core-v2.md)
- [AIMD Core v2 Draft, Korean](spec/ko/AIMD-core-v2-ko.md)
- [AIMD v1.5 Legacy Spec](spec/en/AIMD-v1.5.md)
- [Practical Guide](GUIDE.md)
- [Philosophy](PHILOSOPHY.md)
- [Changelog](CHANGELOG.md)
- [Public Scope](docs/PUBLIC-SCOPE.md)
- [Contributing](CONTRIBUTING.md)

---

## Why AIMD?

When multiple AI agents collaborate, normal prose documents create repeated failure modes:

1. Token waste
2. Semantic drift
3. Lost constraints
4. Weak handoff fidelity

AIMD addresses these with:

- canonical blocks
- stable line IDs
- explicit references
- validator-friendly structure

---

## Minimal Example

```markdown
---
aimd: "2.0-core"
id: payment-retry
rev: 1
mode: c
---

:::intent
g1: payment_retry_without_double_charge
ok1: duplicate_charge=forbidden
:::

:::rules
r1: idempotency=required
ban1: duplicate_charge
:::

:::state
v1: retry_endpoint_exists
o1: concurrent_retry_risk
n1: add_parallel_retry_test ref(o1, r1)
:::

:::flow
s1: inspect_retry_route
s2: add_test
seq1: s1 -> s2
:::
```

---

## Repository Layout

- `spec/en/`: English specs
- `spec/ko/`: Korean translations
- `examples/`: sample AIMD documents
- `validators/`: validator notes and assets
- `schema/`: schemas used by tooling
- `docs/`: supporting documentation and case studies

---

## Current Positioning

- `v1.5`: public legacy spec
- `AIMD Core v2`: public next-generation core draft
- advanced extension and product strategy: evolving separately

---

Copyright 2026 Hwehsoo Kim.


---

SPDX-License-Identifier: Apache-2.0
