# AIMD v1.4 Validator Checklist

---

## Purpose

This checklist verifies whether an `AIMD v1.4` document has:

- Sufficient semantic compatibility
- Acceptable token cost
- Viable role-specific ACP projection

---

## Judgment Levels

### Pass

- Required structure satisfied
- No semantic conflicts
- Compression criteria met
- ACP projection viable

### Pass with Warnings

- Format is conformant
- Some prose overuse or optional block overuse
- Projection viable but cost not optimized

### Fail

- Required block missing
- Unstable line IDs
- Semantic duplication or conflict
- Canonical rule violations
- ACP projection at risk

---

## 1. File-Level Check

`□` File extension is `.aimd`
`□` Saved as UTF-8
`□` Front matter contains `aimd: "1.4"`
`□` Document is not empty
`□` Canonical document has `mode: c` or `mode: cr`

---

## 2. Minimum Structure Check

`□` `:::intent` present
`□` `:::rules` present
`□` `:::state` present
`□` `:::flow` present
`□` Core block order follows `intent -> rules -> state -> flow`

---

## 3. Allowed Block Check

`□` Only allowed blocks used
`□` No `:::ai` remaining
`□` `:::deps` not used as a core concept
`□` Optional blocks not larger than required blocks
`□` `:::human` not acting as SoT instead of canonical

---

## 4. Line ID Check

`□` Core block lines follow `<id>: <payload>` format
`□` Line IDs are unique within the document
`□` Prefixes match block semantics
`□` Stable ID policy maintainable across revisions
`□` No core block with only prose and no line IDs

---

## 5. Payload Normalization Check

`□` Payload is a short normalized expression
`□` Uses stable formats like `key=value` or `subject->result`
`□` Same meaning not repeated in multiple expressions
`□` No excessive vague qualifiers
`□` No long explanations inside core blocks

---

## 6. `:::intent` Check

`□` At least one `g` line present
`□` `ok` lines present when success criteria are needed
`□` `in` / `out` separated when scope distinction is required
`□` Goals and implementation details not mixed

---

## 7. `:::rules` Check

`□` Constraints expressed as `r` lines
`□` Prohibitions expressed as `ban` lines
`□` Freezes separated as `fz` lines
`□` Same rule not duplicated in other blocks
`□` Rules not mixed with state values

---

## 8. `:::state` Check

`□` Confirmed information expressed as `v` lines
`□` Unresolved issues expressed as `o` lines
`□` Temporary assumptions expressed as `a` lines
`□` Next actions expressed as `n` lines
`□` Human confirmation items expressed as `ask` lines
`□` `verified` and `open` not mixed in one line

---

## 9. `:::flow` Check

`□` Execution sequence expressed as `s` lines
`□` Flow steps normalized without excessive prose
`□` Steps contain only what is necessary for handoff understanding
`□` Implementation details and operational state not mixed into flow

---

## 10. One Fact, One Location Check

`□` Same fact not duplicated across multiple blocks
`□` Core rules not double-recorded in prose and canonical lines
`□` Repetition replaced with line ID references when needed
`□` Fact location stable once decided

---

## 11. Controlled Vocabulary Check

`□` Same term used for the same meaning
`□` No synonym drift
`□` Enum values within fixed range
`□` Project-specific aliases managed in a separate dictionary

---

## 12. Prose-Free Zone Check

`□` No long prose inside core blocks
`□` No auxiliary sentences like "note that", "importantly", "in other words"
`□` No block purpose explanations inside canonical blocks
`□` Prose separated into `:::human` when needed

---

## 13. Optional Block Check

`□` `:::schema` only when data structure is actually needed
`□` `:::api` only when actual API contract handoff is needed
`□` `:::test` only when actual validation delivery is needed
`□` `:::ref` contains only critical references
`□` `:::human` is short, independent, and does not overwrite canonical
`□` `:::diff` serves only as revision summary

---

## 14. ACP Projection Check

`□` ACP can be created by line projection without prose regeneration
`□` Line selection is possible for FE/BE/QA/Review roles
`□` Line IDs maintainable during projection
`□` No core rule or state loss during projection
`□` Average ACP length is sufficiently shorter than source

---

## 15. Delta Update Check

`□` `add/drop/set` applicable instead of full document rewrite
`□` Existing line IDs maintainable across revision increments
`□` Changes trackable at the line level
`□` Designed to minimize merge conflicts during collaboration

---

## 16. Compression Check

`□` Front matter uses only minimum fields
`□` Optional blocks not excessive
`□` Core block prose ratio is low
`□` Duplicate meaning ratio is low
`□` No long label overuse
`□` Rendered layer not included in default handoff

---

## 17. Semantic Compatibility Check

`□` Other AIs can read the same block with the same meaning
`□` verified/open/assumption boundaries are clear
`□` Rules and state are separated
`□` Scope and implementation are not mixed
`□` Canonical alone is sufficient for the next agent to continue work

---

## 18. Quick Check (10 items)

When time is short, check these 10 first:

`□` Is `aimd: "1.4"` present?
`□` Are `intent/rules/state/flow` all present?
`□` Is `:::state` used instead of `:::ai`?
`□` Are core blocks line-ID-based?
`□` Is there no prose inside core blocks?
`□` Is each fact in only one location?
`□` Is there no synonym drift?
`□` Can ACP be derived by projection?
`□` Is delta update possible?
`□` Are optional blocks not overused?

---

## Final Judgment Criterion

A good AIMD v1.4 document is one that is **compact, written in stable semantic units, handoff-viable by line projection alone, and interpretable by the next AI without any prose**.
