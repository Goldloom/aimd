# AIMD (AI-Enhanced Markdown) v1.4

Subtitle: Canonical Semantic Memory for Multi-Agent Handoff

---

## 1. Document Status

```text
Version: v1.4
Status:  Proposed Spec
Goal:    Maximize AI semantic compatibility + minimize token cost
Scope:   Format, handoff protocol, validator criteria
```

This document is the official specification draft for AIMD v1.4.

---

## 2. Design Goals

v1.4 simultaneously optimizes along two axes:

1. Maximize AI semantic compatibility
2. Minimize token cost

v1.4 prioritizes `canonical memory format for lossless handoff` over `human-readable document format`.

---

## 3. Formal Definition

```text
AIMD v1.4 = AI-shared canonical semantic memory + optional human render layer
```

In v1.4, the default source of truth is the canonical line set, not prose.

---

## 4. Normative Language

- `MUST`: required
- `MUST NOT`: forbidden
- `SHOULD`: strongly recommended
- `SHOULD NOT`: avoid unless there is a specific reason
- `MAY`: optional

---

## 5. Core Principles

```text
P1. canonical first
P2. prose optional
P3. one fact, one location
P4. projection handoff
P5. stable line ids
P6. compression validated
```

- `canonical first`: The canonical layer is the default shared document.
- `prose optional`: The human explanation layer is optional.
- `one fact, one location`: Each fact is recorded in exactly one place.
- `projection handoff`: Handoff is selection projection, not restatement.
- `stable line ids`: Semantic units have stable IDs.
- `compression validated`: Quality includes cost, not just correctness.

---

## 6. Information Layers

```text
Layer 0: Source Intent
Layer 1: Canonical Layer
Layer 2: Optional Render Layer
Layer 3: ACP Projection Layer
Layer 4: Validation Layer
```

### Layer 0: Source Intent

The input origin.

- Natural language requirements
- Existing Markdown
- Existing AIMD

### Layer 1: Canonical Layer

The actual collaboration source of truth.

- Default handoff target
- Compact line-based representation
- Semantic tags and fixed IDs

### Layer 2: Optional Render Layer

Human review explanation layer.

- Not included in handoff by default
- Canonical takes precedence when conflicts arise

### Layer 3: ACP Projection Layer

Role-specific line selection result.

- FE
- BE
- QA
- Review

### Layer 4: Validation Layer

Validates structure, semantics, and compression efficiency.

---

## 7. File Specification

### 7.1 Extension and Encoding

```yaml
extension: .aimd
encoding:  UTF-8
compat:    CommonMark superset
```

### 7.2 Front Matter

v1.4 documents SHOULD use minimal front matter.

```yaml
---
aimd: "1.4"
src: md
id: payment-retry
rev: 3
mode: c
---
```

Field definitions:

- `aimd`: MUST. Format version.
- `src`: SHOULD. `prompt | md | hybrid | aimd`
- `id`: SHOULD. Document identifier.
- `rev`: SHOULD. Revision number.
- `mode`: SHOULD. `c | r | cr`

Mode definitions:

- `c`: canonical only
- `r`: render only
- `cr`: canonical + render

### 7.3 Minimum Conformant Document

A conformant v1.4 canonical document MUST satisfy:

- `aimd: "1.4"`
- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`

---

## 8. Document Block Order

A canonical document SHOULD follow this order:

```text
front matter
:::intent
:::rules
:::state
:::flow
[optional blocks]
```

This order minimizes handoff interpretation cost by presenting:

1. Purpose
2. Constraints
3. Current state
4. Execution flow

---

## 9. Core Block Set

### 9.1 Required Core Blocks

- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`

### 9.2 Conditional Optional Blocks

- `:::schema`
- `:::api`
- `:::test`
- `:::ref`
- `:::human`
- `:::diff`

### 9.3 Removed or Absorbed Concepts

v1.4 removes the following from the default core:

- `:::ai` → absorbed into `:::state`
- `:::deps` → absorbed into `:::flow` or `:::ref`
- `:::abbr` → moved to global dictionary or external document

This prioritizes block stability over block variety.

---

## 10. Canonical Line Syntax

### 10.1 Basic Format

All core block lines SHOULD follow this format:

```text
<line-id>: <payload>
```

Examples:

```text
g1: single_domain_platform
r1: nextjs=single_app
v1: plan_sot=subscriptions.plan
o1: turborepo_threshold_unresolved
s1: auth->billing->registry->apps
```

### 10.2 Line ID Rules

Line IDs MUST:

- Use a prefix connected to the block's semantic meaning
- Be unique within the document
- Remain as stable as possible across revisions

Examples:

- `g1`, `g2`
- `r1`, `r2`
- `v1`, `v2`
- `o1`, `o2`
- `s1`, `s2`

### 10.3 Payload Rules

Payloads SHOULD:

- Use short normalized expressions
- Use `key=value`
- Use `subject->result`
- Use enum-like literals
- Use stable symbolic phrases

Payloads SHOULD NOT use:

- Long prose
- Repeated expressions with the same meaning
- Vague qualifiers
- Arbitrary memo-style notes per block

---

## 11. Core Block Specification

### 11.1 `:::intent`

Contains document goals and success criteria.

Allowed prefixes:

- `g`: goal
- `ok`: success criteria
- `in`: scope in
- `out`: scope out

Example:

```markdown
:::intent
g1: single_domain_platform
ok1: shared_layers_once
ok2: app_specific_logic_only
in1: auth,billing,db,gateway,registry,agent
out1: design_token_details
:::
```

### 11.2 `:::rules`

Contains constraints, prohibitions, and freezes.

Allowed prefixes:

- `r`: required
- `ban`: forbidden
- `fz`: freeze

Example:

```markdown
:::rules
r1: nextjs=single_app
r2: plan_sot=subscriptions.plan
ban1: app_specific_auth
fz1: r2_key={userId}/{appSlug}/{nanoid}.{ext}
:::
```

### 11.3 `:::state`

Contains verification state and unresolved state.

Allowed prefixes:

- `v`: verified
- `o`: open
- `a`: assumption
- `n`: next
- `ask`: human confirmation needed

Example:

```markdown
:::state
v1: billing_billingkey_cycle_done
v2: pdf_editor_split_done
o1: direct_supabase_phase4_pending
a1: anthropic_optional_for_gateway
n1: connect_app_specific_tools_after_app_completion
:::
```

### 11.4 `:::flow`

Contains execution sequence.

Allowed prefixes:

- `s`: step

Example:

```markdown
:::flow
s1: source_read
s2: intent_extract
s3: rules_lock
s4: app_layer_map
s5: acp_project
:::
```

---

## 12. Optional Block Specification

### 12.1 `:::schema`

MAY be used only when DB, data object, or domain shape is required.

### 12.2 `:::api`

MAY be used only when API contracts are directly required for handoff.

### 12.3 `:::test`

MAY be used only when validation criteria delivery is required.

### 12.4 `:::ref`

SHOULD contain only critical external file, document, or code references.

### 12.5 `:::human`

MAY be used only when human-review explanation is needed.

`:::human` MUST NOT:

- Overwrite canonical facts
- Add new rules
- Create key decisions absent from canonical

### 12.6 `:::diff`

MAY be used only when a revision change summary is needed.

---

## 13. Prose-Free Zone

The core rule of v1.4:

```text
Free prose is forbidden inside core blocks
```

### 13.1 Allowed

- Short symbolic expressions
- Normalized phrases
- `key=value`
- `subject->result`
- Enum literals

### 13.2 Forbidden

- Long explanations
- Synonym repetition
- Arbitrary label overuse per block
- Auxiliary prose like "note that", "importantly", "in other words"

---

## 14. One Fact, One Location

The same fact MUST exist in exactly one place.

Example:

```text
plan_sot=subscriptions.plan
```

If this fact lives in `rules`, it must not be paraphrased in any other block. Reference the line ID instead:

```text
n1: implement_after(r2,v3)
```

---

## 15. Controlled Vocabulary

The canonical layer SHOULD use a controlled vocabulary.

Example:

```text
status    = draft|working|frozen|deprecated
certainty = verified|open|assumption
priority  = p0|p1|p2|p3
mode      = single_app|multi_app|hybrid
```

Using multiple expressions for the same meaning is SHOULD NOT.

```text
allowed:     plan_sot
not allowed: source_of_truth, canonical_plan_source, billing_truth
```

---

## 16. ACP Specification

### 16.1 ACP Definition

```text
ACP = role-specific line projection from canonical AIMD
```

In v1.4, ACP is not a restatement — it is a projection that selects the required lines from the canonical line set.

### 16.2 ACP Rules

An ACP extractor SHOULD:

- Minimize paraphrase
- Preserve line IDs
- Preserve block order
- Prevent line loss

### 16.3 Examples

```text
ACP-BE = intent(g,ok) + rules(all) + state(v,o,a,n) + api + schema
ACP-FE = intent(g,ok) + rules(relevant) + state(v,o,n) + flow
ACP-QA = intent(ok) + rules(all) + state(v,o,a) + test
```

---

## 17. Delta Update Specification

In multi-agent environments, full document rewrites on every update is SHOULD NOT. v1.4 SHOULD prioritize delta updates.

Example:

```text
add: o2=startupmate_timeout_guard
drop: a1
set: v3=chat_runtime_nodejs
```

Purpose:

- Reduce token cost
- Minimize conflicts
- Maintain line ID stability

---

## 18. Validator Requirements

The v1.4 validator consists of three layers:

### 18.1 Syntax Validator

Checks:

- Required front matter fields
- Only allowed blocks used
- Block order
- Line ID format
- Duplicate line IDs

### 18.2 Semantic Validator

Checks:

- Required core blocks present
- verified/open/assumption/next distinction
- Freeze contractual integrity
- One fact, one location compliance
- ACP projection viability

### 18.3 Compression Validator

Checks:

- Core block prose ratio
- Duplicate meaning ratio
- Long label usage rate
- Optional block overuse
- ACP average token length

The v1.4 validator MUST check both syntactic conformance and **cost conformance**.

---

## 19. Generator Requirements

A v1.4 generator SHOULD:

1. Extract source intent
2. Normalize canonical facts
3. Assign stable line IDs
4. Generate core blocks first
5. Minimize optional block generation
6. Default output to `mode: c`
7. Extract ACP via projection

The generator must prioritize `compressed canonical memory` over `pretty prose`.

---

## 20. Conformant Example

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

## 21. Non-Conformant Example

The following is non-conformant for v1.4 canonical:

```markdown
:::state
It is important to note that the current payment retry policy has not yet been fully agreed upon.
And generally speaking duplicate charges should be prevented, though it may vary depending on the situation.
:::
```

Reasons:

- Free prose
- Non-normalized state values
- No verified/open/assumption distinction
- No line IDs

---

## 22. Changes from v1.3

```text
v1.3 focus: shared structured document
v1.4 focus: canonical semantic memory
```

Key changes:

1. `:::ai` → `:::state`
2. Core block minimum set fixed
3. Line IDs promoted to first-class concept
4. ACP redefined as projection
5. Compression validator added
6. Prose-free zone explicitly defined

---

## 23. Conformance Goals

v1.4 targets:

- Semantic compatibility: 95+
- Token efficiency: 95+

These goals do not guarantee full determinism from format alone. Remaining variance is in the model, generator, and validator quality domain.

---

## 24. Conclusion

The official direction of v1.4 in four lines:

```text
canonical first
prose optional
projection handoff
compression validated
```

AIMD v1.4 looks like Markdown, but it is fundamentally a canonical memory format designed for AI agents to hand off context with the least token cost and the least semantic ambiguity.
