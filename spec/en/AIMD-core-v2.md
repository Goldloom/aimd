# AIMD Core v2 Draft

Minimal canonical memory for AI agents.

---

## Status

```text
Version: v2-core-draft
Status: Proposal
License intent: public core
```

This document defines the public AIMD Core.
It is the smallest stable subset of AIMD intended for broad adoption and interoperability.

---

## What Core Contains

AIMD Core contains:

- front matter
- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`
- optional `:::diff`

It does not include higher execution, knowledge, trust, or federation layers.

---

## Conformance Goal

Any two compliant readers of the same AIMD Core document should reach equivalent understanding of:

- intent
- constraints
- state

The goal is semantic equivalence, not identical internal ASTs.

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

## Required Blocks

Every AIMD Core document must contain exactly once:

- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`

Canonical order is:

```text
intent -> rules -> state -> flow
```

Order violations are warnings, not fatal errors.

---

## Line Syntax

Canonical line form:

```text
<line-id>: <payload> [ref(<line-id>...)]
```

Allowed core prefixes:

- `g`, `ok`, `in`, `out`
- `r`, `ban`, `fz`
- `v`, `o`, `a`, `n`, `ask`
- `s`, `seq`, `chain`

---

## Validator Baseline

Standard validator codes:

- `E001` missing required block
- `E002` invalid prefix
- `E003` duplicate line ID
- `E004` broken ref
- `E005` missing front matter field
- `E007` block order violation
- `E008` unresolved ask
- `E009` auto-id in finalized document
- `E010` payload too long
- `E011` duplicate required block

---

## Relationship to Legacy Specs

- `AIMD-v1.4.md` and `AIMD-v1.5.md` remain public legacy specifications
- AIMD Core v2 is the current public next-step core draft
- higher AIMD layers may be specified separately
