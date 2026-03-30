# AIMD v1.5 Generator Specification

---

## 1. Purpose

This document is the official specification for generators that create or update `AIMD v1.5` documents.

The purpose of a generator is not to write beautiful documents. The core purpose is:

1. Normalize source intent into a canonical line set
2. Maintain the one fact, one location principle
3. Assign stable line IDs
4. Build ACP-projection-friendly structures
5. Produce low-token-cost v1.5 documents
16. Emit `ref()` cross-references when source relationships are explicit (§10.4)
17. Emit `@date` annotations as non-semantic metadata on `v` lines (§10.5)
18. Generate declarative `:::test` assertions using standardized vocabulary (§12.3)

---

## 2. Inputs and Outputs

### Inputs

- Plain prompt
- Plain Markdown
- Existing `.aimd`
- Existing `.aimd` + additional requirements
- Reference documents as needed

### Outputs

- `mode: c` canonical AIMD
- Optionally `mode: cr` AIMD
- ACP projection bundle as needed

The default output MUST be `mode: c`.

---

## 3. Generator Position

The v1.5 generator is the core component of the following pipeline:

```text
source input
  -> input normalizer
  -> fact extractor
  -> canonical planner
  -> line normalizer
  -> ref extractor        ← new in v1.5
  -> aimd generator
  -> syntax validator
  -> semantic validator   (includes ref integrity check)
  -> compression validator
  -> repair loop
  -> final aimd
```

---

## 4. Core Generation Principles

### 4.1 Canonical First

The generator MUST produce canonical before prose.

### 4.2 Minimal Blocks

The generator MUST prioritize generating only required core blocks.

### 4.3 Minimal Words

The generator SHOULD use normalized expressions wherever possible.

### 4.4 Stable IDs

The generator MUST maintain stable line IDs.

### 4.5 No Silent Invention

The generator MUST NOT introduce facts absent from the source as verified.

### 4.6 Lossless Source Fidelity

The generator MUST preserve all semantic content from the source.

- Compression target: expression FORM (verbosity, redundancy, prose noise)
- Compression MUST NOT target: semantic content (facts, constraints, states)
- Every fact present in the source MUST appear as a canonical line in the output

### 4.7 Conservative References  ← new in v1.5

The generator MUST NOT invent `ref()` relationships absent from the source.

- Add `ref()` only when the source explicitly states a dependency or ordering relationship
- Do not add `ref()` for loose thematic similarity
- When uncertain, omit `ref()` rather than guess

---

## 5. Required Generation Steps

### Step 1. Input Normalization

Classify the input as one of:

- `prompt`
- `markdown`
- `aimd`
- `hybrid`

Key tasks:

- Parse front matter
- Identify structural blocks
- Distinguish headings/lists/tables/code
- Separate source chunks

### Step 2. Source Fact Extraction

Extract the following fact types from the source:

- goal
- success criteria
- rule
- prohibition
- freeze candidate
- verified fact
- open issue
- assumption candidate
- next action
- flow step
- schema/api/test/ref candidate
- dependency relationships between facts  ← new in v1.5
- completion dates or timestamps  ← new in v1.5

### Step 3. Canonical Planning

Decide which block to place each extracted fact in:

- goal → `intent.g*`
- success → `intent.ok*`
- required rule → `rules.r*`
- prohibition → `rules.ban*`
- boundary lock → `rules.fz*`
- verified fact → `state.v*`
- unresolved item → `state.o*`
- assumption → `state.a*`
- next action → `state.n*`
- action sequence → `flow.s*`
- verification assertion → `test.t*` (§12.3)

### Step 4. Line Normalization

Normalize each fact into a canonical payload.

Preferred formats:

- `key=value`
- `subject->result`
- Stable symbolic phrase

Forbidden:

- Long prose
- Multiple facts combined in one line
- Arbitrary summaries that deviate from source meaning

### Step 5. Reference Extraction (§10.4)

After all lines have IDs assigned, extract dependency relationships:

- For each explicit "depends on", "requires", "after", "blocked by" relationship in source, append `ref(<id>...)` to the dependent line
- The generator MUST NOT invent `ref()` relationships based on inferred similarity or thematic connection.
- Semantic Validator MUST verify that all IDs inside `ref()` exist within the document. A reference to a non-existent ID is a MUST-FIX semantic error.
- `ref()` is always appended at the end of the payload and MUST NOT contain prose.

### Step 6. Line ID Assignment

Line IDs follow a per-block prefix system:

- `g`, `ok`, `in`, `out`
- `r`, `ban`, `fz`
- `v`, `o`, `a`, `n`, `ask`
- `s`
- `t`, `ref`, `p`, `e`

If an existing revision is present, the generator SHOULD reuse existing line IDs wherever possible.

### Step 7. Optional Block Decision

Add optional blocks only when needed:

- `schema`: data structure is directly required for handoff
- `api`: API contract is directly required for handoff
- `test`: required for QA handoff or when verification criteria are in source
- `ref`: external reference is critically needed
- `human`: explicitly requested or clearly useful for reviewer
- `diff`: revision summary is required

### Step 8. Validator Loop

Check the output draft in this order:

1. Syntax validator
2. Semantic validator (includes ref integrity check)
3. Compression validator

If any fail, run the repair loop.

---

## 6. Required Generator Behavior

The generator SHOULD:

1. Default output to `mode: c`
2. Generate `:::intent`, `:::rules`, `:::state`, `:::flow` first
3. Never record the same fact in multiple blocks
4. Introduce facts absent from source only as `a*` or `o*`
5. Write in a projection-friendly structure
6. Add human explanation layer only when requested
7. Prefer line-preserving updates over full rewrites on revision
8. Add `ref()` only for explicit source-stated relationships  ← new in v1.5
9. Add `@date` on `v` lines when source contains a verifiable date  ← new in v1.5

The generator MUST NOT:

1. Invent confirmed facts absent from source
2. Store key rules only in `:::human`
3. Overuse optional blocks
4. Generate prose-heavy core blocks
5. Unnecessarily change existing stable line IDs
6. Invent `ref()` relationships not present in source  ← new in v1.5

---

## 7. Per-Block Generation Rules

### 7.1 `:::intent`

Must always be included.

Minimum:

- `g1`

Include when possible:

- `ok*`
- `in*`
- `out*`

### 7.2 `:::rules`

Must always be included.

Minimum:

- At least one `r*` or `ban*`

Freeze boundaries must be separated into `fz*`.

### 7.3 `:::state`

Must always be included.

Recommended minimum:

- At least one `v*` or `o*`

If inference exists, leave `a*`. If follow-up work exists, leave `n*`.

**Clarification on `v` prefix (§11.3):**
`v` covers both verified facts and completed milestones.

**Temporal Annotation (§10.5):**
When a `v` line has an explicit completion date in source, append `@YYYY-MM-DD`. 
The `@date` is non-semantic metadata and MUST NOT be treated as part of the payload fact.

### 7.4 `:::flow`

Must always be included.

Even simple flows must be normalized to at least 1 step.

### 7.5 `:::test` (§12.3)

Generate `:::test` only when:

- Source explicitly contains verification criteria, acceptance tests, or completion checks
- QA handoff is required

**Syntax:** `t<N>: <state-id>=<status> -> <assertion>`

**Assertion Vocabulary:**
- `file(path)`: file existence
- `route(METHOD path)`: API route registration
- `no_table(name)`: DB table absence
- `env(KEY)`: environment variable presence
- `schema_field(table.col)`: schema verification

Each `t` line MUST reference an existing `v`, `o`, `n`, or rule line ID.

Assertions MUST use declarative symbolic form. MUST NOT use shell commands or OS-specific syntax.

---

## 8. Revision Update Rules

When an existing `.aimd` is present, the generator SHOULD follow this priority:

1. Reuse existing line IDs
2. Preserve existing canonical
3. Apply only necessary `add/drop/set` changes
4. Minimize optional block modifications
5. Regenerate human block only when needed
6. When adding `ref()` to existing lines, treat as an `add` delta, not a full line replacement

Full rewrites on revision update are allowed only in exceptional cases:

- Source structure has completely changed
- Existing line ID design is fundamentally broken
- Semantic validator fails the line system itself

---

## 9. Per-Source Generation Policy

### 9.1 Prompt → AIMD

Characteristics:

- Source information is minimal
- Assumption management is critical

Policy:

- Leave uncertainty as `a*` or `o*`
- Avoid over-generating verified facts
- Do not invent `ref()` relationships from implicit context

### 9.2 Markdown → AIMD

Characteristics:

- Rich structural signals

Policy:

- Preserve headings/lists/tables as canonical facts
- Prioritize extraction of negative constraints, numbers, dates, boundaries
- ALL facts from source MUST appear in canonical output — lossless conversion
- Compress expression form only; do not omit, summarize, or reinterpret meaning
- Extract explicit dependency language ("requires", "after", "depends on") as `ref()` candidates

### 9.3 AIMD → AIMD Update

Characteristics:

- Stable ID preservation is paramount

Policy:

- Reflect only new source additions
- Prefer line-level patches
- Mark obsolete lines as `drop`
- When a line transitions `o → v`, add `@date` if date is known

---

## 10. ACP Generation Rules

The generator can create ACP directly when needed, but the default method MUST be projection.

### Default Rules by Role

- FE: `g/ok + relevant rules + relevant state + flow`
- BE: `g/ok + all rules + state + api/schema`
- QA: `ok + all rules + state + test`
- REVIEW: `g/ok + high-impact rules + open + diff`

The generator MUST create ACP via line selection, not prose re-summarization.

When a line is included in ACP and it contains `ref()`, the ACP SHOULD also include the referenced lines if they are relevant to the role.

---

## 11. Scoring Targets

Good generator output targets:

```text
syntax pass
semantic_total  >= 85
compression_total >= 85
```

Excellent output targets:

- `semantic_total >= 92`
- `compression_total >= 90`

---

## 12. Common Failure Patterns

Generators commonly produce these failures:

1. Writing core blocks as prose
2. Putting progress status in rules instead of state
3. Recording the same fact in both rules and state
4. Writing `:::human` blocks that are excessively long
5. Generating ACP as new summaries instead of line projections
6. Rebuilding stable IDs from scratch on revision
7. Treating MD→AIMD conversion as lossy compression — omitting or summarizing source facts instead of normalizing their form
8. Inventing `ref()` relationships not stated in source  ← new in v1.5
9. Writing shell commands inside `:::test` assertions  ← new in v1.5
10. Emitting `ref()` pointing to non-existent IDs  ← new in v1.5

---

## 13. Output Example

```markdown
---
aimd: "1.5"
src: md
id: aiworks-platform
rev: 8
mode: c
---

:::intent
g1: single_domain_platform
ok1: shared_layers_once
ok2: app_specific_logic_only
:::

:::rules
r1: nextjs=single_app
r2: plan_sot=subscriptions.plan
ban1: app_specific_auth
fz1: r2_key={userId}/{appSlug}/{nanoid}.{ext}
:::

:::state
v1: billing_billingkey_cycle_done @2026-02-10
o1: startupmate_direct_supabase_phase4
n1: connect_app_tools_after_app_completion ref(v1, r2)
:::

:::flow
s1: source_read
s2: canonical_extract
s3: rules_lock ref(r1, r2)
s4: app_mapping
s5: acp_project
:::

:::test
t1: v1=verified -> route(POST /api/billing/cycle)
t2: ban1 -> no_file(src/app/[app]/auth)
:::
```

---

## 14. Implementation Priority

Recommended implementation order:

1. Source fact extraction
2. Canonical planning
3. Line normalization
4. Stable ID assignment
5. Reference extraction
6. Validator loop (with ref integrity)
7. Revision patch mode
8. ACP projection

---

## 15. Conclusion

An AIMD v1.5 generator is not a model that writes good documents. It is a generator that normalizes source into line-based canonical memory, makes that memory as cheap as possible to hand off — without semantic loss — and now also records verifiable cross-references and declarative test assertions so agents can reason about dependency order and completion criteria without re-reading full document context.
