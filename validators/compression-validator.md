# AIMD v1.5 Compression Validator Specification

---

## 1. Purpose

This document is the official specification for the compression validator of `AIMD v1.5` documents.

The compression validator does not simply check "is it short?" Its core purposes are:

1. Determine whether the canonical document actually meets token optimization targets
2. Detect unnecessary prose, duplication, and verbose metadata
3. Warn of meaning loss risk from compression
4. Evaluate whether ACP projection cost is practically small enough
5. Ensure verifiability features (ref, @date) do not introduce excessive overhead

The compression validator catches **AIMD documents that cost too much**.

---

## 4. Core Judgment Principles

### 4.1 Canonical Cost First

Compression evaluation is based on the canonical layer, not `:::human`.

- `intent/rules/state/flow` costs are the primary evaluation target
- `:::human` is measured separately as optional cost

### 4.2 Verifiable References Efficiency (v1.5)

- `ref(id)` should be used to avoid restating concepts already defined in other lines.
- Redundant restatements despite having `ref()` available are flagged as cost waste.

### 4.3 One Fact, One Cost

The same fact appearing in multiple lines, blocks, or both prose and canonical is both semantic duplication and cost waste.

---

## 6. Key Metrics

### 6.2 Core Prose Ratio

```text
core_prose_ratio = prose_line_core / line_core
```

Interpretation:
- v1.5 minimizes prose inside core blocks.

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
- Fail = does not meet v1.5 token targets

---

## 14. Conclusion

The AIMD v1.5 compression validator is not a tool that checks "is this document short?" It answers: **"can this canonical memory be operated cheaply enough for handoff while maintaining meaning and verifiability?"**

---

SPDX-License-Identifier: Apache-2.0
