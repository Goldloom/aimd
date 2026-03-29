# AIMD v1.4 Semantic Validator Specification

---

## 1. Purpose

This document is the official specification for the semantic validator of `AIMD v1.4` documents.

The semantic validator is not a simple grammar checker. Its core purposes are:

1. Determine whether canonical lines are actually interpretable with the same meaning
2. Detect semantic conflicts and duplications within the document
3. Determine whether ACP projection is possible without meaning loss
4. Evaluate whether handoff safety is maintained while keeping token cost targets

---

## 2. Scope

The validator operates on:

- `.aimd` source
- Source prompt or source Markdown when available
- Files referenced in `:::ref`
- Previous revision `.aimd` when available
- ACP projection results when available

Output must be a diagnostic report with at minimum:

- `result`: `pass | pass_with_warnings | fail`
- `scores`
- `issues`
- `summary`
- `repair_hints`

---

## 3. Position in Pipeline

```text
syntax validator
    -> semantic validator
        -> compression validator
```

- `syntax validator`: is the format correct?
- `semantic validator`: is the meaning interpretable consistently?
- `compression validator`: is the cost acceptable?

The semantic validator MUST run only after syntax passes.

---

## 4. Core Judgment Principles

### 4.1 Canonical Priority

The validator judges the canonical layer before `:::human`.

- Judgment criteria are `intent/rules/state/flow`
- `:::human` is supplementary explanation, not the source of truth

### 4.2 One Fact, One Location

If the same fact appears in multiple lines or blocks, it is a semantic issue.

Example:

```text
r2: plan_sot=subscriptions.plan
v3: plan_sot=subscriptions.plan
```

This is a semantic duplicate.

### 4.3 Controlled Vocabulary

Using the same expression for the same meaning is the key to semantic compatibility.

```text
allowed:     plan_sot
discouraged: billing_truth
discouraged: source_of_truth
```

### 4.4 Projection Safety

ACP must be a line projection, not a paraphrase. Therefore, if critical lines are lost during projection, it is a semantic fail.

---

## 5. Input Normalization

Before checking, the semantic validator normalizes input into the following model:

### 5.1 Document Model

```yaml
doc:
  meta:
    aimd: "1.4"
    src: md
    id: payment-retry
    rev: 3
    mode: c
  blocks:
    - type: intent
      lines: [...]
    - type: rules
      lines: [...]
    - type: state
      lines: [...]
    - type: flow
      lines: [...]
```

### 5.2 Canonical Line Model

Each line must have at minimum:

```yaml
line:
  id: "r2"
  block: "rules"
  prefix: "r"
  payload_raw: "plan_sot=subscriptions.plan"
  payload_norm: "plan_sot=subscriptions.plan"
  refs: []
```

### 5.3 Source Fact Model

If source prompt/markdown is available, normalize into facts:

```yaml
source_fact:
  kind: rule
  key: plan_sot
  value: subscriptions.plan
  evidence: "plan SoT = subscriptions.plan exclusively"
```

---

## 6. Semantic Check Levels

### Level 1. Source Fidelity

Purpose: verify source meaning is preserved in canonical

Checks:

- Are core rules from source promoted to `rules`?
- Are confirmed facts from source reflected in `state.v*`?
- Is unresolved content left as `state.o*` or `state.a*`?
- Are new facts not in source invented as verified?

Error codes:

- `sem.source.missing_fact`
- `sem.source.invented_verified`
- `sem.source.value_mismatch`
- `sem.source.polarity_flip`

### Level 2. Intra-Document Consistency

Purpose: verify no meaning conflicts between blocks

Checks:

- Do `rules` and `state` not say the same fact differently?
- Does `flow` not contain steps that violate `rules`?
- Do `schema` and `api` not conflict on the same entity?
- Does `human` not contradict canonical?

Error codes:

- `sem.consistency.rule_state_conflict`
- `sem.consistency.flow_rule_conflict`
- `sem.consistency.schema_api_conflict`
- `sem.consistency.human_canonical_conflict`

### Level 3. State Discipline

Purpose: verify boundaries between verified/open/assumption/next are correct

Checks:

- Do `v*` lines contain only confirmed facts?
- Are `o*` lines clearly unresolved?
- Do `a*` lines reveal they are inferences or temporary assumptions?
- Do `n*` lines specify a sufficient next action or target?

Error codes:

- `sem.state.verified_without_basis`
- `sem.state.open_is_not_open`
- `sem.state.assumption_unmarked`
- `sem.state.next_not_actionable`

### Level 4. Canonical Compression Safety

Purpose: verify no meaning loss occurred during compression

Checks:

- Did excessive abbreviation create uninterpretable symbolic phrases?
- Did over-short payloads become ambiguous?
- Were multiple facts combined into one line?
- Are abbreviation aliases interpretable without an external dictionary?

Error codes:

- `sem.compress.ambiguous_symbol`
- `sem.compress.multi_fact_line`
- `sem.compress.opaque_alias`

### Level 5. ACP Projection Safety

Purpose: verify role-specific projection is possible without line loss

Checks:

- Is `g/ok/relevant rules/v/o/n/flow` selectable for FE projection?
- Does BE projection have `rules/state/api/schema`?
- Does QA projection have `ok/rules/o/a/test`?
- Is line ID to meaning connection maintained after projection?

Error codes:

- `sem.acp.missing_role_lines`
- `sem.acp.unprojectable_dependency`
- `sem.acp.line_id_loss`

### Level 6. Semantic Duplication

Purpose: verify no meaning drift risk from duplicate recording

Checks:

- Is the same key/value duplicated in multiple lines?
- Is the same rule double-recorded in prose and canonical?
- Is the same fact recorded using different terms?

Error codes:

- `sem.dup.exact_duplicate`
- `sem.dup.cross_block_duplicate`
- `sem.dup.synonym_duplicate`

---

## 7. Per-Line Semantic Rules

### 7.1 `g*`

- Goal lines must contain only document objectives
- Implementation details or state values must not be mixed in

Error code: `sem.intent.goal_impl_mix`

### 7.2 `ok*`

- Success criteria must be verifiable outcomes
- Vague aspirational statements are not allowed

Error code: `sem.intent.ok_not_measurable`

### 7.3 `r*`

- Must contain required constraints
- State values or progress must not be used

Error code: `sem.rules.required_is_state`

### 7.4 `ban*`

- Prohibition rules must be negative constraints
- Factual reporting must not be used

Error code: `sem.rules.ban_not_prohibition`

### 7.5 `fz*`

- Freeze must contain only contract boundaries or change-forbidden scope
- General cautions are not freezes

Error code: `sem.rules.freeze_not_boundary`

### 7.6 `v*`

- Verified must be a confirmed fact with a basis
- Future plans or wishes are not verified

Error code: `sem.state.verified_future_tense`

### 7.7 `o*`

- Open must be an unresolved state
- Already-decided content must not remain as open

Error code: `sem.state.open_already_resolved`

### 7.8 `a*`

- Assumption must be an inference or temporary assumption
- Leaving well-evidenced facts as assumptions is a quality degradation

Error code: `sem.state.assumption_should_be_verified`

### 7.9 `n*`

- Next must be actionable or routable
- Simple opinions are not allowed

Error code: `sem.state.next_missing_target`

### 7.10 `s*`

- Flow lines must be ordered unit actions
- Rules or state must not be mixed in

Error code: `sem.flow.step_not_action`

---

## 8. Evidence Rules

The semantic validator SHOULD be evidence-driven.

### 8.1 Evidence Sources

Evidence must be one of:

- Source prompt/Markdown
- Files referenced in `:::ref`
- Stable lines from previous revisions
- Higher-level canonical lines within the same document

### 8.2 Evidence Requirements

The following SHOULD have evidence linkage:

- `v*`
- `fz*`
- `r*` promoted from source
- `n*` other than `ask*`

### 8.3 Missing Evidence Handling

Missing evidence does not automatically fail, but the following have high fail probability:

- Verified without evidence
- Freeze without boundary basis
- Source mismatch with no justification

---

## 9. Projection Fitness Rules

### 9.1 Minimum Required Lines by Role

```text
FE:     g + ok + relevant r/ban/fz + relevant v/o/n + flow
BE:     g + ok + all r/ban/fz + v/o/a/n + api/schema
QA:     ok + all r/ban/fz + v/o/a + test
REVIEW: g + ok + high-impact rules + open + diff
```

### 9.2 Projection Fail Conditions

Fail if any of:

- Minimum required lines for a role are absent from the document
- Only line ID references exist without the original lines
- Meaning connections break after projection
- Understanding requires the human block

---

## 10. Scoring Model

```yaml
scores:
  fidelity:             0-100
  consistency:          0-100
  state_discipline:     0-100
  projection_safety:    0-100
  duplication_control:  0-100
  semantic_total:       0-100
```

Recommended weights:

- fidelity: 25
- consistency: 20
- state_discipline: 20
- projection_safety: 20
- duplication_control: 15

### Judgment Criteria

- `Pass`: no critical errors, semantic_total >= 85
- `Pass with Warnings`: no critical errors, semantic_total >= 70
- `Fail`: critical errors exist or semantic_total < 70

---

## 11. Severity Rules

### Error

- Missing core source facts
- Verified/open conflict
- Freeze misuse
- One fact, one location violation
- ACP projection not possible

### Warning

- Alias opacity
- Next action ambiguity
- Optional block overuse
- Human block over-description

### Info

- Payload can be shortened further
- Controlled vocabulary substitution possible
- Projection bundle optimization possible

---

## 12. Report Format

```yaml
result: pass_with_warnings
scores:
  fidelity: 92
  consistency: 88
  state_discipline: 76
  projection_safety: 90
  duplication_control: 81
  semantic_total: 86
issues:
  - severity: warning
    code: sem.state.next_not_actionable
    block: state
    line_id: n2
    message: next line is not actionable enough
    evidence:
      - "n2: improve_billing"
    repair_hint: "Specify target or action, e.g. n2: implement_billing_webhook_retry"

  - severity: error
    code: sem.dup.cross_block_duplicate
    block: rules
    line_id: r2
    message: same fact appears in multiple blocks
    evidence:
      - "r2: plan_sot=subscriptions.plan"
      - "v3: plan_sot=subscriptions.plan"
    repair_hint: "Keep rule in rules block and replace duplicate with line-id reference"
```

---

## 13. Implementation Priority

Recommended implementation order:

1. One fact, one location check
2. Verified/open/assumption/next classification
3. Source fidelity check
4. Projection safety check
5. Duplication + synonym drift check
6. Scoring + repair hints

---

## 14. Key Differences in v1.4

Compared to a generic semantic validator, the v1.4 semantic validator differs in:

1. Judgment centers on `:::state`, not `:::ai`
2. Canonical lines take precedence over prose
3. One fact, one location violation is a core error
4. Projection viability is included in semantic quality
5. Meaning loss caused by compression is within semantic scope

---

## 15. Conclusion

The AIMD v1.4 semantic validator answers not "is the format correct?" but **"can this canonical line set be interpreted with nearly identical meaning by another AI, and can it be safely handed off via projection alone?"**
