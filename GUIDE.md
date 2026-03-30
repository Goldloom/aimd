# AIMD (AI-Enhanced Markdown) v1.5 Practical Guide

This guide covers the **AI-Native workflow for starting new projects** using the AIMD v1.5 specification from the initial planning stage.

---

## 1. Overview: Why Start with AIMD?

Traditional documentation (`.md`) prioritizes human readability. However, when collaborating with AI, **"Semantic Clarity"**, **"Verifiability"**, and **"Low Token Cost"** are the keys to productivity.

By starting a project with AIMD v1.5:
1. **Eliminate Ambiguity**: Core concepts are declared using normalized lines (`g1`, `r1`, etc.) instead of free prose.
2. **Traceable Dependencies**: Use `ref()` to explicitly link rules, milestones, and implementation details.
3. **Immediate Implementation**: The moment your plan is finished, AI agents have a "Perfect Memory" to start writing code without needing summaries.
4. **Automated Verification**: Use `:::test` blocks to define declarative assertions that AI can verify instantly.

---

## 2. Day Zero: New Project Workflow (Quick Start)

Follow these 4 phases when starting a new project (e.g., 'AI Survey Tool').

### Phase 1: Declare Intent (`:::intent`)
Define the **Goal (g)** and **Success Criteria (ok)** first.

```markdown
:::intent
g1: ai_native_smart_survey_builder
ok1: survey_generation_time < 30sec
ok2: multi_language_support_by_default
in1: registration+survey_creation+analytics
out1: advanced_crm_integration
:::
```

### Phase 2: Set Rules & Constraints (`:::rules`)
Specify the tech stack, security principles, and the **Bans (ban)**—things the AI must never do. Use `ref()` to link related rules.

```markdown
:::rules
r1: stack=Next.js_15+Drizzle+Tailwind4
r2: auth=Better_Auth+SSO
r3: encryption_at_rest ref(r2)
ban1: no_client_side_form_logic_leak ref(r1)
fz1: r2_key_pattern={userId}/{surveyId}/{nanoid}.{ext}
:::
```

### Phase 3: Define Data Schema (`:::schema`)
Defining table structures or data shapes at this stage allows you to immediately command the AI: "Write the DB migration code based on this schema."

```markdown
:::schema
surveys(id TEXT PK, user_id, title TEXT, description TEXT, created_at)
questions(id TEXT PK, survey_id->surveys.id, type TEXT[text|select|rating], content TEXT)
:::
```

### Phase 4: Define Execution Flow & Verification (`:::flow` & `:::test`)
Define milestones and set up automated tests to verify them.

```markdown
:::flow
s1: infrastructure_setup(nextjs+lucia+drizzle) @2026-03-31
s2: auth_implementation(email+kakao) ref(r2)
s3: survey_generator_engine_ai_connect ref(s2)
:::

:::test
t1: s1=verified -> env(DATABASE_URL)
t2: s2=verified -> route(/api/auth/callback)
:::
```

---

## 3. Core Best Practices (v1.5)

1. **Prose-Free Zone**
   - Do not use descriptive sentences inside core blocks.
   - Use short, powerful expressions like `key=value`, `subject->result`, or `ref(id)`.
   
2. **Verifiable References**
   - Use `ref(id1, id2)` to express logic dependencies. It prevents AI from guessing relationships.

3. **Temporal Evidence (@date)**
   - Mark completed milestones (`v` lines) with `@YYYY-MM-DD` to maintain a verifiable timeline.

4. **One Fact, One Location**
   - Never repeat the same information. Reference line IDs instead.

---

## 4. References

* [AIMD v1.5 Full Specification](spec/en/AIMD-v1.5.md)
* [New Project Bootstrap Template](examples/bootstrap.aimd)
