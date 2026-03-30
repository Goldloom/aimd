# AIMD v1.5 Validator Checklist

---

## 1. File-Level Check
`□` Front matter contains `aimd: "1.5"`
`□` Canonical document has `mode: c` or `mode: cr`

## 2. Line ID & Reference Check (v1.5)
`□` Core block lines follow `<id>: <payload>` format
`□` All referenced IDs in `ref()` exist in the document
`□` No dangling references or speculative links

## 3. Temporal Evidence Check (v1.5)
`□` Completed milestones (`v` lines) are marked with `@YYYY-MM-DD`
`□` Date format follows strict `YYYY-MM-DD`

## 4. `:::test` Block Check (v1.5)
`□` Assertions use declarative vocabulary: `file()`, `route()`, `no_table()`, `env()`
`□` `t` lines map to valid state or rule IDs

## 5. One Fact, One Location Check
`□` Same fact not duplicated across multiple blocks
`□` Repetition replaced with `ref(id)` references

## 6. Prose-Free Zone Check
`□` No long prose inside core blocks (`intent`, `rules`, `state`, `flow`)
`□` Meaning expressed via compact symbolic payloads

## 7. Quick Check (v1.5 Top 10)
`□` Is `aimd: "1.5"` present?
`□` Are `intent/rules/state/flow` all present?
`□` Are all `ref()` IDs valid?
`□` Are `v` lines dated with `@YYYY-MM-DD`?
`□` Are core blocks prose-free?
`□` Are `:::test` assertions declarative?
`□` Is each fact in only one location?
`□` Can ACP be derived by projection?
`□` Is delta update possible?
`□` Are optional blocks not overused?

---

## Final Judgment Criterion
A good AIMD v1.5 document is one that is **compact, verifiable via ref() and :::test, written in stable semantic units, and interpretable by the next AI without any prose**.
