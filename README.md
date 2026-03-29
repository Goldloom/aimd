# AIMD — AI-Enhanced Markdown v1.4

[한국어 버전 (Korean)](README-ko.md)

**Canonical Semantic Memory for Multi-Agent Handoff**

[![AIMD Spec](https://img.shields.io/badge/AIMD-v1.4--Canonical-orange)](spec_en/AIMD-v1.4.md)

---

## What is AIMD?

AIMD is a document format designed for AI-to-AI communication.

Most documents are written for humans to read. AIMD is written for AI agents to read, interpret, and pass on — with minimal token cost and maximum semantic fidelity.

```
Human writes → plain Markdown
AI converts → AIMD canonical memory
AI hands off → next AI picks up exactly where it left off
```

---

## Why AIMD?

When AI agents collaborate, they typically pass around free-form Markdown or JSON. This creates three problems:

1. **Token waste** — prose repeats the same facts in different places
2. **Semantic drift** — different agents interpret the same sentence differently
3. **Handoff loss** — critical constraints, open issues, and assumptions get buried or lost

AIMD solves all three by defining a compact, structured canonical memory format that any AI can parse unambiguously.

---

## AIMD for RAG Optimization

AIMD is purpose-built for **Retrieval-Augmented Generation (RAG)** and semantic memory workflows. It offers four critical advantages over standard prose or Markdown when used in a vector-based knowledge vault:

1.  **Token Efficiency**: By focusing on normalized key-value pairs (e.g., `g1`, `ok1`), `.aimd` delivers high semantic density with minimal overhead, preserving the AI's context window.
2.  **Structured Chunking**: Sections like `:::intent`, `:::rules`, and `:::flow` provide natural semantic boundaries, enabling precise retrieval of specific context without middle-of-sentence fragmentation.
3.  **High Semantic Density**: AIMD strips away linguistic noise, allowing Vector DBs to more accurately index and match queries against "core meaning" relationships rather than fluff.
4.  **Constraint Enforcement**: AI models interpret structured rules (`r1`, `ban1`) as strict logic constraints rather than mere suggestions, drastically reducing hallucinations during task execution.

---

## AIMD for Multi-Agent Orchestration

AIMD is a native **Canonical State Management** layer for multi-agent systems and orchestrators. It transforms the chaotic exchange of free-form prose into a predictable, line-addressed semantic handshake:

1.  **Dynamic Role Projection (ACP)**: Orchestrators can serve filtered views (e.g., `ACP-BE`, `ACP-FE`) of the same document to specialized agents, ensuring they receive relevant context while slashing input tokens.
2.  **Lossless Task Handoff**: The `:::state` block (with `v`, `o`, `n` prefixes) captures a snapshot of verified facts, pending issues, and next steps that any following agent can resume with 100% fidelity.
3.  **Granular Delta Updates**: Orchestrators can communicate intent via line-level operations (`add`, `drop`, `set`) instead of resending full documents, minimizing inter-agent traffic and token overhead.
4.  **Enforced Logic Consistency**: By centralizing goals (`:::intent`) and constraints (`:::rules`), orchestrators maintain a single source of truth that all sub-agents must adhere to, preventing logic drift across the swarm.
---

## AIMD for AI-Native PRD Engineering

Transmuting a traditional Product Requirement Document (PRD) into AIMD creates a "living specification" that AI agents can execute without ambiguity:

1.  **Zero Ambiguity**: Converts passive prose ("The system should be secure") into active canonical constraints (`ban1: plaintext_storage`).
2.  **Implementation-Ready Syntax**: Allows agents to skip the "extraction" phase. The structured blocks (`:::api`, `:::schema`) are immediately consumable by coding agents.
3.  **Real-Time Progress Tracking**: The `:::state` block serves as a real-time dashboard, tracking verified features (`v`) and pending tasks (`n`) directly within the requirement document.
4.  **Token-Efficient Maintenance**: Large PRDs are expensive to process. AIMD delivers the same logic density at ~20% of the token cost, enabling faster and cheaper multi-agent iterations.

---

## Quick Example

```markdown
---
aimd: "1.4"
src: md
id: payment-retry
rev: 3
mode: c
---

:::intent
g1: payment_retry_without_double_charge
ok1: max_retry=3
ok2: duplicate_charge=forbidden
:::

:::rules
r1: idempotency=required
ban1: duplicate_charge
fz1: api_error_contract
:::

:::state
v1: retry_409_on_processed
o1: rollback_regression_check
n1: qa_validate_concurrent_retry
:::

:::flow
s1: fail_payment
s2: show_retry
s3: validate_idempotency
s4: return_existing_or_new_result
:::
```

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| `canonical first` | The canonical layer is the source of truth, not prose |
| `prose optional` | Human-readable explanation is a separate, optional layer |
| `one fact, one location` | Every fact lives in exactly one place |
| `projection handoff` | Role-specific handoff = line selection, not rewriting |
| `stable line ids` | Line IDs are stable across revisions for delta updates |
| `compression validated` | Token cost is a first-class quality metric |

---

## Core Blocks

Every AIMD document must have these four blocks in order:

| Block | Purpose | Key Prefixes |
|-------|---------|--------------|
| `:::intent` | Goals and success criteria | `g`, `ok`, `in`, `out` |
| `:::rules` | Constraints, prohibitions, freezes | `r`, `ban`, `fz` |
| `:::state` | Verified facts, open issues, assumptions, next actions | `v`, `o`, `a`, `n`, `ask` |
| `:::flow` | Execution steps | `s` |

Optional blocks: `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`, `:::diff`

---

## Canonical Line Format

Every line inside a core block follows this format:

```
<line-id>: <payload>
```

Payload rules:
- Prefer `key=value` or `subject->result`
- Keep it short and normalized
- No free prose inside core blocks
- One fact per line

---

## ACP — Role-Specific Projection

AIMD supports role-specific handoff by projecting a subset of lines:

```
ACP-BE  = intent(g,ok) + rules(all) + state(v,o,a,n) + api + schema
ACP-FE  = intent(g,ok) + rules(relevant) + state(v,o,n) + flow
ACP-QA  = intent(ok) + rules(all) + state(v,o,a) + test
```

Projection means **selecting lines**, not rewriting the document.

---

## Delta Updates

Instead of rewriting the full document on each revision:

```
add: o2=startupmate_timeout_guard
drop: a1
set: v3=chat_runtime_nodejs
```

This keeps line IDs stable and minimizes token cost per update.

---

## Validator Pipeline

AIMD defines a 3-layer validator pipeline:

```
syntax validator → semantic validator → compression validator
```

| Validator | Checks |
|-----------|--------|
| Syntax | Format, front matter, block structure, line-id rules |
| Semantic | Meaning fidelity, one-fact-one-location, ACP projection safety |
| Compression | Token cost, prose ratio, redundancy, delta efficiency |

---

## 🛠️ Core Repository Structure

- [`spec_en/`](spec_en/): English Core Specifications & Guidelines
  - [`AIMD-v1.4.md`](spec_en/AIMD-v1.4.md): AIMD Core Grammar & Block Standards.
  - [`generator-spec.md`](spec_en/generator-spec.md): Specification for AI model generator engines.
  - [`generator-prompt.md`](spec_en/generator-prompt.md): Master prompts for standard AIMD generation.
- [`spec_ko/`](spec_ko/): Korean Core Specifications & Guidelines
  - [`AIMD-v1.4-ko.md`](spec_ko/AIMD-v1.4-ko.md): Korean translation of Core Grammar.
  - [`generator-spec-ko.md`](spec_ko/generator-spec-ko.md): Korean translation of Generator Spec.
  - [`generator-prompt-ko.md`](spec_ko/generator-prompt-ko.md): Korean translation of Master Prompts.
├── validators/
│   ├── syntax-validator.md
│   ├── semantic-validator.md
│   ├── compression-validator.md
│   └── validator-checklist.md
├── schema/
│   └── validator-output-schema.json
└── examples/
    ├── payment-retry.aimd
    ├── prd-user-auth.aimd          ← NEW: PRD Engineering Example
    ├── validator-output-syntax-pass.json
    ├── validator-output-semantic-warnings.json
    └── validator-output-compression-fail.json
```

---

## Status

Current version: **v1.4** (Proposed Spec)

AIMD v1.4 is a proposed specification. Implementations and feedback are welcome.

---
## AI 워크스페이스 설정 가이드 (AI-Native Setup Guide)

이 프로젝트의 AIMD v1.4 규격을 자신의 실무 프로젝트에 즉시 적용하려면 다음 인프라 파일들을 자신의 프로젝트 루트(Root)로 복사하십시오.

### 1. 전역 규칙 활성화 (`.cursorrules`)
프로젝트 루트에 `.cursorrules` 파일을 배치하면, 모든 AI 에이전트(Cursor, Copilot 등)가 자동으로 AIMD v1.4 규격을 준수하며 문서를 설계합니다.

### 2. 슬래시 명령어 활성화 (`.agents/workflows/aimd.md`)
Antigravity와 같은 도구에서 `/aimd` 명령어를 통해 언제든지 규격 요약과 지침을 불러올 수 있습니다.

### 3. Detailed Reference (`spec_en/` folder)
Invite the AI to learn deep specification details by referencing documents in the `spec_en/` folder.

---

For English speakers: Copy `.cursorrules`, `.agents/workflows/aimd.md`, and the `spec/` folder to your project root to enable the full power of AIMD v1.4 automatically.

Copyright © 2026 Hwehsoo Kim (Goldloom). Licensed under the Apache License 2.0.
