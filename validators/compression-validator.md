# AIMD v1.4 Compression Validator Specification

---

## 1. Purpose

This document is the official specification for the compression validator of `AIMD v1.4` documents.

The compression validator does not simply check "is it short?" Its core purposes are:

1. Determine whether the canonical document actually meets token optimization targets
2. Detect unnecessary prose, duplication, and verbose metadata
3. Warn of meaning loss risk from compression
4. Evaluate whether ACP projection cost is practically small enough

The compression validator catches **AIMD documents that cost too much**.

---

## 2. Scope

The validator operates on:

- `.aimd` source
- Source prompt or Markdown when available
- ACP projection results when available
- Previous revision `.aimd` when available

Output must be a diagnostic report with at minimum:

- `result`
- `scores`
- `metrics`
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

- `syntax validator`: format fitness
- `semantic validator`: meaning fitness
- `compression validator`: cost fitness

The compression validator MUST run after syntax passes, and MAY reference semantic warning information.

---

## 4. Core Judgment Principles

### 4.1 Canonical Cost First

Compression evaluation is based on the canonical layer, not `:::human`.

- `intent/rules/state/flow` costs are the primary evaluation target
- `:::human` is measured separately as optional cost

### 4.2 One Fact, One Cost

The same fact appearing in multiple lines, blocks, or both prose and canonical is both semantic duplication and cost waste.

### 4.3 Projection Efficiency

ACP must be projection-based, so the projection result must be significantly smaller than the source document.

### 4.4 Compression Without Opaqueness

A short document is not necessarily good compression. Overly opaque aliases or excessive abbreviation can be warnings or errors.

---

## 5. Input Normalization

Before checking, the compression validator normalizes the document into the following metrics model:

```yaml
doc_metrics:
  token_total: 0
  token_core: 0
  token_optional: 0
  line_total: 0
  line_core: 0
  line_optional: 0
  prose_line_core: 0
  duplicate_line_groups: 0
  long_label_count: 0
  acp_avg_tokens: 0
```

### 5.1 Core Block Aggregation

Core blocks: `:::intent`, `:::rules`, `:::state`, `:::flow`

### 5.2 Optional Block Aggregation

Optional blocks: `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`, `:::diff`

---

## 6. Key Metrics

### 6.1 Core Token Ratio

```text
core_token_ratio = token_core / token_total
```

Interpretation:

- Canonical-centered documents should have a high core token ratio
- Excessive optional prose lowers the ratio

### 6.2 Core Prose Ratio

```text
core_prose_ratio = prose_line_core / line_core
```

Interpretation:

- v1.4 minimizes prose inside core blocks

### 6.3 Duplicate Meaning Ratio

```text
duplicate_meaning_ratio = duplicate_line_groups / line_total
```

Interpretation:

- Higher duplicate meaning ratio = higher cost waste

### 6.4 Optional Expansion Ratio

```text
optional_expansion_ratio = token_optional / token_core
```

Interpretation:

- Optional exceeding core indicates likely handoff optimization failure

### 6.5 Long Label Ratio

```text
long_label_ratio = long_label_count / line_total
```

Long label examples:

- `VERIFIED`
- `ASSUMPTION`
- `CRITICAL`
- Natural-language heading style payloads

v1.4 canonical SHOULD maintain the `v/o/a/n/r/ban/fz/g/ok/s` prefix-based abbreviated structure.

### 6.6 ACP Projection Ratio

```text
acp_projection_ratio = acp_avg_tokens / token_total
```

Interpretation:

- Role-specific ACP should be significantly smaller than the source

### 6.7 Delta Efficiency

```text
delta_efficiency = changed_lines / rewritten_lines
```

Interpretation:

- More line-level updates vs. full rewrites = more efficient

---

## 7. Compression Check Levels

### Level 1. Structural Compression

Checks:

- Only minimum front matter fields used?
- Core block set kept to minimum?
- Optional blocks not excessive?
- `:::human` not consuming the canonical document?

Error codes:

- `cmp.structure.optional_overgrowth`
- `cmp.structure.human_dominates_canonical`
- `cmp.structure.meta_overexpanded`

### Level 2. Canonical Density

Checks:

- Core block prose ratio is low?
- Appropriate number of facts per line?
- No excessive headings/comments/explanatory text?

Error codes:

- `cmp.density.core_prose_too_high`
- `cmp.density.multi_fact_line`
- `cmp.density.comment_overuse`

### Level 3. Redundancy Control

Checks:

- Any exact duplicate lines?
- Same fact cross-block duplicates?
- Same meaning double-recorded in prose and canonical?
- Synonym duplicates?

Error codes:

- `cmp.redundancy.exact_duplicate`
- `cmp.redundancy.cross_block_duplicate`
- `cmp.redundancy.prose_canonical_duplicate`
- `cmp.redundancy.synonym_duplicate`

### Level 4. Projection Cost

Checks:

- ACP-BE/FE/QA/REVIEW average length within target?
- Projection not becoming restatement rather than filtering?
- Projection possible without optional blocks?

Error codes:

- `cmp.projection.acp_too_large`
- `cmp.projection.requires_human_block`
- `cmp.projection.rephrase_heavy`

### Level 5. Delta Cost

Checks:

- Full document rewrite on revision instead of targeted updates?
- Stable line IDs maintainable?
- Changes expressible as `add/drop/set` operations?

Error codes:

- `cmp.delta.full_rewrite_pattern`
- `cmp.delta.unstable_line_ids`
- `cmp.delta.non_projectable_revision`

---

## 8. Recommended Threshold Values

```yaml
thresholds:
  core_prose_ratio_warn:          0.15
  core_prose_ratio_fail:          0.30
  duplicate_meaning_ratio_warn:   0.08
  duplicate_meaning_ratio_fail:   0.15
  optional_expansion_ratio_warn:  0.75
  optional_expansion_ratio_fail:  1.00
  acp_projection_ratio_warn:      0.45
  acp_projection_ratio_fail:      0.60
  long_label_ratio_warn:          0.20
  long_label_ratio_fail:          0.35
```

Interpretation:

- Warning = optimization needed
- Fail = does not meet v1.4 token targets

---

## 9. Scoring Model

```yaml
scores:
  structural_compression: 0-100
  canonical_density:      0-100
  redundancy_control:     0-100
  projection_cost:        0-100
  delta_efficiency:       0-100
  compression_total:      0-100
```

Recommended weights:

- structural_compression: 20
- canonical_density: 25
- redundancy_control: 20
- projection_cost: 25
- delta_efficiency: 10

### Judgment Criteria

- `Pass`: no critical errors, compression_total >= 85
- `Pass with Warnings`: no critical errors, compression_total >= 70
- `Fail`: critical errors exist or compression_total < 70

---

## 10. Severity Rules

### Error

- Optional blocks exceed core
- ACP projection is excessively large
- Core prose ratio exceeds fail threshold
- Same fact duplication is severe
- Full rewrite pattern without stable line IDs

### Warning

- Human block excessive
- Long labels excessive
- Synonym duplicates
- Comments/explanatory text excessive

### Info

- More abbreviatable payloads exist
- `:::human` separation optimization possible
- Projection bundle further reducible

---

## 11. Output Metrics Specification

The compression validator SHOULD provide these metrics:

```yaml
metrics:
  token_total:               integer
  token_core:                integer
  token_optional:            integer
  line_total:                integer
  line_core:                 integer
  line_optional:             integer
  prose_line_core:           integer
  duplicate_line_groups:     integer
  long_label_count:          integer
  acp_avg_tokens:            integer
  acp_projection_ratio:      number
  core_prose_ratio:          number
  duplicate_meaning_ratio:   number
  optional_expansion_ratio:  number
```

---

## 12. Report Format Example

```yaml
result: pass_with_warnings
scores:
  structural_compression: 91
  canonical_density: 74
  redundancy_control: 82
  projection_cost: 78
  delta_efficiency: 88
  compression_total: 82
metrics:
  token_total: 1480
  token_core: 990
  token_optional: 490
  line_total: 92
  line_core: 54
  line_optional: 38
  prose_line_core: 11
  duplicate_line_groups: 4
  long_label_count: 7
  acp_avg_tokens: 620
  acp_projection_ratio: 0.42
  core_prose_ratio: 0.20
  duplicate_meaning_ratio: 0.04
  optional_expansion_ratio: 0.49
issues:
  - severity: warning
    code: cmp.density.core_prose_too_high
    block: state
    message: core block contains too much prose
    repair_hint: convert prose into v/o/a/n lines
```

---

## 13. Implementation Priority

Recommended implementation order:

1. Core prose ratio measurement
2. Duplicate meaning detection
3. Optional expansion ratio measurement
4. ACP projection ratio measurement
5. Delta efficiency measurement
6. Score + repair hint generation

---

## 14. Conclusion

The AIMD v1.4 compression validator is not a tool that checks "is this document short?" It answers: **"can this canonical memory be operated cheaply enough for handoff while maintaining meaning?"**
