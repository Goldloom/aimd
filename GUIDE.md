# AIMD (AI-Enhanced Markdown) v1.4 Practical Guide

This guide covers the **AI-Native workflow for starting new projects** using the AIMD v1.4 specification from the initial planning stage.

---

## 1. Overview: Why Start with AIMD?

Traditional documentation (`.md`) prioritizes human readability. However, when collaborating with AI, **"Semantic Clarity"** and **"Low Token Cost"** are the keys to productivity.

By starting a project with AIMD:
1. **Eliminate Ambiguity**: Core concepts are declared using normalized lines (`g1`, `r1`, etc.) instead of free prose.
2. **Immediate Implementation**: The moment your plan is finished, AI agents have a "Perfect Memory" to start writing code without needing summaries.
3. **Document Synchronization**: As implementation progresses, you only need to update the `:::state` block, eliminating the gap between documentation and actual code.

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
Specify the tech stack, security principles, and the **Bans (ban)**—things the AI must never do.

```markdown
:::rules
r1: stack=Next.js_15+Drizzle+Tailwind4
r2: auth=Better_Auth+SSO
ban1: no_client_side_form_logic_leak
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

### Phase 4: Define Execution Flow (`:::flow`)
Define milestones step-by-step and ask the AI to "Implement starting from phase s1."

```markdown
:::flow
s1: infrastructure_setup(nextjs+lucia+drizzle)
s2: auth_implementation(email+kakao)
s3: survey_generator_engine_ai_connect
:::
```

---

## 3. Core Best Practices

1. **Prose-Free Zone**
   - Do not use descriptive sentences inside core blocks (`intent`, `rules`, `state`, `flow`).
   - Use powerful, short expressions like `key=value` or `subject->result`.
   
2. **One Fact, One Location**
   - Never repeat the same information in multiple places. Reference the line ID (e.g., `r1`) instead.

3. **Utilize the :::human Block**
   - Use the `:::human` block if you need to provide detailed narrative or business context for human stakeholders. Note: This block cannot override the action guidelines in the 'Canonical Layer'.

---

## 4. References

* [AIMD v1.4 Full Specification](spec/en/AIMD-v1.4.md)
* [New Project Bootstrap Template](examples/bootstrap-en.aimd)
