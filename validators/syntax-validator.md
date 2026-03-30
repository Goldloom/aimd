# AIMD v1.5 Syntax Validator Specification

---

## 1. Purpose

This document is the official specification for the syntax validator of `AIMD v1.5` documents.

The syntax validator has three purposes:

1. Determine whether the document satisfies v1.5 format requirements
2. Ensure the canonical parser can read it stably
3. Catch pre-processing failures early before semantic/compression validators run
4. Verify well-formedness of `ref()` and `@date` annotations (§10.4, §10.5)

The syntax validator is the first-pass checker that answers: **can this document be read?**

---

## 2. Scope

The validator operates on:

- `.aimd` source
- Previous revision `.aimd` when needed

Output must be a diagnostic report with at minimum:

- `result`
- `scores`
- `issues`
- `summary`

---

## 3. Position in Pipeline

```text
syntax validator
    -> semantic validator
        -> compression validator
```

The syntax validator MUST run first.

If it fails:

- semantic validator MUST NOT run
- compression validator MUST NOT run

---

## 4. Core Judgment Principles

### 4.1 Parseability First

The document must be stably readable by a parser.

### 4.2 Canonical Shape

The v1.5 core shape is `front matter + core blocks + line-id payload`.

### 4.3 Minimal Strictness

Semantic judgment belongs to the semantic validator. The syntax validator checks only format violations.

---

## 5. Check Levels

### Level 1. File Shape

Checks:

- File extension is `.aimd`
- UTF-8 encoding
- Not empty
- Front matter block is well-formed

Error codes:

- `syn.file.invalid_extension`
- `syn.file.empty_document`
- `syn.file.invalid_front_matter`

### Level 2. Version Shape

Checks:

- `aimd: "1.5"` exists
- `mode` if present is `c | r | cr`
- `src` if present is within the allowed enum
- `rev` if present is an integer >= 0

Error codes:

- `syn.meta.missing_aimd_version`
- `syn.meta.invalid_aimd_version`
- `syn.meta.invalid_mode`
- `syn.meta.invalid_src`
- `syn.meta.invalid_revision`

### Level 3. Block Shape

Checks:

- Block opening/closing is well-formed
- Only allowed blocks are used
- Core block order is valid
- No duplicate core block policy violations

Error codes:

- `syn.block.unclosed_block`
- `syn.block.unknown_block_type`
- `syn.block.invalid_core_order`
- `syn.block.duplicate_core_block`

### Level 4. Line Shape

Checks:

- Core block lines follow `<id>: <payload> [ref(<id>...)] [@YYYY-MM-DD]` format
- Line IDs match the allowed pattern
- No duplicate line IDs
- `ref()` syntax is well-formed (comma-separated valid IDs inside parentheses)
- `@date` syntax matches `@YYYY-MM-DD` and is only on `v` lines
- `ref()` is always after payload but before `@date` if both are present

Error codes:

- `syn.line.invalid_format`
- `syn.line.invalid_id`
- `syn.line.duplicate_id`
- `syn.line.empty_payload`
- `syn.line.invalid_ref_syntax`
- `syn.line.invalid_date_format`
- `syn.line.invalid_metadata_order`

### Level 5. Optional Block Shape

Checks:

- `schema/api/test/ref/human/diff` blocks have valid opening/closing
- `:::test` follow `t<N>: <id>=<status> -> <assertion>` syntax (§12.3)
- `ref` lines are in a minimally identifiable format
- Optional blocks do not break block boundaries

Error codes:

- `syn.opt.invalid_ref_line`
- `syn.opt.invalid_test_format`
- `syn.opt.invalid_block_boundary`

---

## 6. Allowed Block Set

The v1.5 syntax validator allows only these blocks:

- `intent`
- `rules`
- `state`
- `flow`
- `schema`
- `api`
- `test`
- `ref`
- `human`
- `diff`

The following are disallowed by default:

- `ai`
- `deps`
- `abbr`

Unless a migration mode is separately designed, the syntax validator MUST treat these as fail or warning.

---

## 7. Front Matter Rules

### Required

- `aimd: "1.5"`

### Optional

- `src`
- `id`
- `rev`
- `mode`

### Allowed Format

```yaml
---
aimd: "1.5"
src: md
id: payment-retry
rev: 3
mode: c
---
```

### Forbidden

- Unclosed front matter
- YAML that cannot be parsed
- Missing `aimd`
- Disallowed enum values

---

## 8. Core Block Rules

### 8.1 Required Core Blocks

A canonical document MUST have all of:

- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`

### 8.2 Order

Recommended order:

```text
intent -> rules -> state -> flow
```

The syntax validator treats inverted core block order as an error by default.

### 8.3 Duplicates

Default policy: each core block type is allowed only once.

Without an exception mode, the following is an error:

```markdown
:::state
...
:::

:::state
...
:::
```

---

## 9. Line ID Rules

Line IDs must match the following pattern:

```text
^[a-z]+[0-9]+$
```

Examples:

- `g1`, `ok2`, `r3`, `ban1`, `fz1`
- `v4`, `o1`, `a2`, `n3`, `ask1`
- `s1`, `t2`, `ref3`, `p1`, `e2`, `in1`, `ok1`, `out1`, `r1`, `ban1`, `fz1`

Duplicate line IDs are forbidden across the entire document.

---

## 10. Payload Rules

The syntax validator does not deeply interpret payload meaning, but checks:

- Payload exists after `:`
- Payload is not whitespace-only
- Line is not entirely a prose sentence
- `ref()` and `@date` are placed at the end of the line in correct order (§10.4, §10.5)

The syntax validator MUST NOT check if the ID inside `ref()` actually exists. That is a SEMANTIC check.

---

## 11. `:::ref` Minimum Rules

`:::ref` lines must satisfy one of:

- `<id>: ./relative/path`
- `<id>: ../relative/path`
- `<id>: /abs/path`
- `<id>: identifier_like_token`

Full existence checks belong to the semantic validator or runtime resolver. The syntax validator checks only minimal parseability.

---

## 12. Mode-Specific Rules

### `mode: c`

- Core blocks MUST exist
- Canonical line rules MUST apply
- `:::human` is allowed

### `mode: r`

- Render-only document
- Canonical line requirements may be relaxed
- Not recommended as v1.5 handoff SoT

### `mode: cr`

- Canonical + render both present
- Canonical core blocks MUST exist

---

## 13. Scoring Model

The syntax validator SHOULD support scoring:

```yaml
scores:
  structure: 0-100
  overall:   0-100
```

Recommended criteria:

- `Pass`: no errors, structure >= 85
- `Pass with Warnings`: no errors, structure >= 70
- `Fail`: errors exist or structure < 70

---

## 14. Severity Rules

### Error

- Front matter cannot be parsed
- `aimd: "1.5"` missing
- Core block missing
- Unclosed block
- Duplicate line ID
- Invalid core order

### Warning

- Minor optional block format mismatch
- Excessive render block
- Prose-like core line

### Info

- Abbreviatable line ID prefix
- Optional block cleanup opportunity

---

## 15. Output Report Example

```yaml
result: fail
scores:
  structure: 62
  overall: 62
issues:
  - severity: error
    code: syn.block.invalid_core_order
    block: state
    message: state block appears before rules block
    repair_hint: move rules block before state block

  - severity: error
    code: syn.line.duplicate_id
    block: flow
    line_id: s2
    message: duplicate line id found
```

---

## 16. Implementation Priority

Recommended implementation order:

1. Front matter parser
2. Block parser
3. Core order check
4. Line-ID duplicate check
5. Optional block check
6. Scoring + diagnostics

---

## 17. Conclusion

The AIMD v1.4 syntax validator is the minimal format guarantor that answers: **is this document safe to pass to the semantic and compression stages?**
