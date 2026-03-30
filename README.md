# AIMD — AI-Enhanced Markdown v1.5

[한국어 버전 (Korean)](README-ko.md)

**Canonical Semantic Memory for Multi-Agent Handoff**

[![AIMD Spec](https://img.shields.io/badge/AIMD-v1.5--Canonical-orange)](spec/en/AIMD-v1.5.md)

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
aimd: "1.5"
src: md
id: payment-retry
rev: 4
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
v1: retry_409_on_processed @2026-03-31
o1: rollback_regression_check
n1: qa_validate_concurrent_retry ref(v1, r1)
:::

:::flow
s1: fail_payment
s2: show_retry
s3: validate_idempotency ref(r1)
s4: return_existing_or_new_result
:::

:::test
t1: v1=verified -> route(POST /api/payment/retry)
t2: ban1 -> no_table(duplicate_charge_log)
:::
```

---

## 🚀 AI-Native Workflow (Getting Started)

AIMD is not just a document format; it's a **new planning-development workflow** for collaborating with AI. 
Refer to the following documents to learn how to maximize productivity by starting new projects with AIMD from day zero.

*   **[Practical Workflow Guide (GUIDE.md)](GUIDE.md)**: Step-by-step guide from day 0 planning to implementation.
*   **[New Project Template (bootstrap-en.aimd)](examples/bootstrap-en.aimd)**: A standard template you can copy and use immediately.
*   **[Unified MasterPlan Template (MASTERPLAN-en.aimd)](examples/MASTERPLAN-en.aimd)**: An advanced template that consolidates goals, rules, tasks, and insights into a single orchestration file.
*   **[Prompt-Zero Philosophy (PHILOSOPHY-en.md)](PHILOSOPHY-en.md)**: Why and how AIMD replaces traditional prose-based prompting.
*   **[AI Architect Review (docs/experience/)](docs/experience/260331_AI_ARCHITECT_LOG_EN.md)**: Real-world SaaS implementation and integrity validation using AIMD v1.5.

---

## 💡 Case Study

AIMD v1.5 is more than just a theory. Its power has been proven through the construction of an enterprise-grade SaaS project (`aimd-cloud`). Check out the vivid reviews written directly by the AI agent.

*   **[AI Architect Review: Value of Integrity with AIMD v1.5 (English)](docs/experience/260331_AI_ARCHITECT_LOG_EN.md)**
*   **[AI 아키텍트의 AIMD v1.5 실사용 후기 (Korean)](docs/experience/260331_AI_ARCHITECT_LOG.md)**

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
| `verifiable references` | Cross-references between lines MUST be checkable by a validator |

---

## Core Blocks

Every AIMD document must have these four blocks in order:

| Block | Purpose | Key Prefixes |
|-------|---------|--------------|
| `:::intent` | Goals and success criteria | `g`, `ok`, `in`, `out` |
| `:::rules` | Constraints, prohibitions, freezes | `r`, `ban`, `fz` |
| `:::state` | Verified facts/milestones, open issues, assumptions, next actions | `v` (+ `@date`), `o`, `a`, `n`, `ask` |
| `:::flow` | Execution steps | `s` (+ `ref()`) |
| `:::test` | Declarative verification criteria | `t` |

Optional blocks: `:::schema`, `:::api`, `:::ref`, `:::human`, `:::diff`

---

## Canonical Line Format

Every line inside a core block follows this format:

```
<line-id>: <payload> [ref(<id>...)] [@YYYY-MM-DD]
```

Payload rules:
- Prefer `key=value` or `subject->result`
- `ref(<id>...)`: Captures cross-line dependencies (§10.4)
- `@YYYY-MM-DD`: Non-semantic metadata for `v` lines (§10.5)
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

- [`spec/en/`](spec/en/): English Core Specifications & Guidelines
  - [`AIMD-v1.5.md`](spec/en/AIMD-v1.5.md): AIMD Core Grammar & Block Standards.
  - [`generator-spec.md`](spec/en/generator-spec.md): Specification for AI model generator engines.
  - [`generator-prompt.md`](spec/en/generator-prompt.md): Master prompts for standard AIMD generation.
- [`spec/ko/`](spec/ko/): Korean Core Specifications & Guidelines
  - [`AIMD-v1.5-ko.md`](spec/ko/AIMD-v1.5-ko.md): Korean translation of Core Grammar.
  - [`generator-spec-ko.md`](spec/ko/generator-spec-ko.md): Korean translation of Generator Spec.
  - [`generator-prompt-ko.md`](spec/ko/generator-prompt-ko.md): Korean translation of Master Prompts.
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

---

## Status

Current version: **v1.5** (Proposed Spec)

AIMD v1.5 is a proposed specification. Implementations and feedback are welcome.

---

## 💻 AI-Native Setup Guide

To apply the AIMD v1.5 specification to your own project immediately, copy these infrastructure files to your project root:

### 1. Enable Global Rules (`.cursorrules`)
Place the `.cursorrules` file in your project root. Any AI agent (Cursor, Copilot, etc.) will then automatically follow the AIMD v1.5 standard for document design.

### 2. Enable Slash Commands (`.agents/workflows/aimd.md`)
In tools like Antigravity, you can call the `/aimd` command at any time to pull up specification summaries and instructions.

### 3. Detailed Reference (`spec/en/` folder)
Invite the AI to learn deep specification details by referencing documents in the `spec/en/` folder.

---

Copyright © 2026 Hwehsoo Kim (Goldloom). Licensed under the Apache License 2.0.
