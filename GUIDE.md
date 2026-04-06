# AIMD Practical Guide

How to use AIMD in a real project from day zero.

[한국어 가이드](GUIDE-ko.md)

---

## Goal

This guide explains a practical workflow:

1. define the project in prose once
2. convert it into AIMD Core
3. let AI agents work from canonical memory instead of repeated prompting

---

## Recommended Starting Point

If you are adopting AIMD today:

- read [AIMD Core v2 Draft](spec/en/AIMD-core-v2.md)
- use v1.5 only as legacy reference
- begin with Core only
- add higher layers only if your workflow clearly needs them

---

## Day Zero Workflow

### 1. Write Intent

Start with `:::intent`.
Capture goals, success criteria, scope in, and scope out.

### 2. Lock Constraints

Use `:::rules` to define:

- required constraints
- banned outcomes
- frozen decisions

### 3. Capture Current Truth

Use `:::state` to record:

- verified facts
- open issues
- assumptions
- next actions

### 4. Define Execution Order

Use `:::flow` to express steps and ordering.

### 5. Normalize Before Handoff

Before handing off to another AI:

- expand draft-only IDs such as `g+`
- ensure canonical block order
- remove accidental prose from core blocks
- validate refs

---

## Good AIMD Habits

- Keep one fact in one place.
- Prefer symbolic payloads over prose.
- Use `ref()` instead of repeating context.
- Treat AIMD as canonical memory, not as a narrative document.

---

## Minimal Team Workflow

```text
human defines project intent
AI writes AIMD Core
validator checks structure
coding agent reads AIMD Core
next agent resumes from updated AIMD
```

---

## Next Reading

- [README](README.md)
- [AIMD Core v2 Draft](spec/en/AIMD-core-v2.md)
- [Legacy AIMD v1.5 Spec](spec/en/AIMD-v1.5.md)

---

SPDX-License-Identifier: Apache-2.0
