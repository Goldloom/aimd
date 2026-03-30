# AIMD Philosophy: Toward Prompt-Zero Collaboration (v1.5)

## 🌀 The Era of Liquid Memory (Legacy Prompts)
Current interactions with AI agents rely heavily on long-form prose prompts. While intuitive, these prompts are **"liquid"**:
- **Volatility**: They are easily forgotten as conversation history grows.
- **Ambiguity**: Natural language is prone to misinterpretation by LLMs.
- **Redundancy**: Developers must repeat the same context (Stack, Rules, Goals) in every session.
- **Waste**: High token consumption due to verbose instructions.

---

## 💎 The Era of Verifiable Precision Memory (AIMD v1.5)
AIMD (AI-native Markdown) evolves "Prompting" into **"Memory as Code."** By encapsulating intents, rules, schemas, and flows into structured, machine-readable blocks (:::), we achieve **"Verifiable Precision Memory"**:
- **Persistence**: Knowledge is stored in version-controlled files, not fleeting chat history.
- **Symbolic Precision**: Using IDs and symbols reduces semantic drift and improves AI reasoning.
- **Zero-Redundancy**: The spec *is* the prompt. AI reads the file once and knows exactly what to do.
- **Verifiable Integrity (v1.5)**: Using `ref()` cross-references and `@date` temporal metadata, we ensure every fact is traceable and every milestone is verifiable.
- **Handoff Fidelity**: Different AI agents can pick up where the last one left off with 100% context alignment and zero ambiguity.

---

### [Vision] Prompt-Zero Architecture
The ultimate goal of AIMD is a workflow where the human no longer "commands," but "orchestrates."

Instead of:
> "Hey AI, please build a login page using Next.js 15, and make sure the button is blue, and don't forget to use Drizzle for the DB..."

In AIMD v1.5, you simply say:
> "Read `MASTERPLAN.aimd` and execute `v12` ref(v11)."

Everything else—the technical stack, the design tokens, the database schema—is already **"Solidified"** and **"Linked"** in the `.aimd` files.

---

### [Example] AGENT.aimd
A "Prompt-Zero" agent is configured via a file, not a prefix.

```markdown
:::agent
id: lead-architect
directive: strict_canonical_memory_enforcer
workflow: [read_master_plan, apply_rules, report_state]
:::

:::rules
r1: symbolic_expression_only
r2: no_prose_redundancy
r3: read_masterplan_before_execution
ban1: execute_without_verification ref(r3)
:::

:::state
v1: masterplan_reviewed ref(r3) @2026-03-31
:::

:::test
t1: v1=verified -> file(MASTERPLAN.aimd)
:::
```

Join us in building the future of **Solid AI Memory**. Transition from "Prompting" to "Architecting."
