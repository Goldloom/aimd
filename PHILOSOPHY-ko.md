# AIMD 철학: 프롬프트 제로(Prompt-Zero) 협업을 향하여 (v1.5)

## 🌀 '액체 메모리'의 시대 (레거시 프롬프트)
현재 AI 에이전트와의 상호작용은 대부분 긴 줄글 형태의 프롬프트에 의존합니다. 하지만 이러한 방식은 **"액체(Liquid)"**와 같아서 다음과 같은 한계가 분명합니다:
- **휘발성**: 대화가 길어지면 맥락을 쉽게 잊어버립니다.
- **모호성**: 자연어는 AI 에이전트가 해석하기에 따라 모호함을 유발합니다.
- **중복성**: 매 세션마다 똑같은 기술 스택, 규칙, 목표를 반복해서 설명해야 합니다.
- **비효율**: 장황한 지시가 불필요한 토큰 낭비를 초래합니다.

---

## 💎 '검증 가능한 정밀 메모리'의 시대 (AIMD v1.5)
AIMD(AI-native Markdown)는 "프롬프트"를 **"코드로 기록된 메모리(Memory as Code)"**로 진화시킵니다. 의도, 규칙, 데이터 구조, 작업 흐름을 기호화된 블록(`:::`)으로 캡슐화하여 **"검증 가능한 정밀 메모리(Verifiable Precision Memory)"**를 형성합니다:
- **지속성**: 지식은 찰나의 채팅 기록이 아니라, 버전 관리되는 파일에 저속됩니다.
- **기호의 정밀도**: ID와 기호 표현을 사용하여 의미의 왜곡(Semantic Drift)을 최소화하고 AI의 추론 능력을 극대화합니다.
- **중복 제로**: 명세서 자체가 프롬프트입니다. AI는 파일을 한 번 읽는 것만으로 모든 맥락을 완벽히 흡수합니다.
- **검증 가능한 무결성 (v1.5)**: `ref()` 크로스 레퍼런스와 `@date` 메타데이터를 통해, 모든 사실은 추적 가능해지고 모든 마일스톤은 검증 가능해집니다.
- **핸드오프의 무결성**: 서로 다른 AI 에이전트가 투입되어도, 이전 에이전트의 중단 지점부터 100% 동일한 맥락에서 모호함 없이 즉시 작업이 가능합니다.

---

### [비전] 프롬프트 제로(Prompt-Zero) 아키텍처
AIMD의 최종 목표는 인간이 AI에게 사사건건 '명령'하는 것이 아니라, 전체를 '관영(Orchestrate)'하는 것입니다.

**기존 방식:**
> "안녕 AI, Next.js 15로 로그인 페이지 만들어줘. 버튼은 파란색으로 하고, DB는 Drizzle 쓰는 거 잊지 마..."

**AIMD v1.5 방식:**
> "`MASTERPLAN.aimd`를 읽고 `v12` 단계를 수행해. ref(v11) 확인하고."

그 외 모든 것—기술 스택, 디자인 토큰, 데이터베이스 스키마—은 이미 `.aimd` 파일 내에 **"고체화(Solidified)"**되고 **"연결(Linked)"**되어 있습니다.

---

### [예시] AGENT.aimd
"프롬프트 제로" 에이전트는 프롬프트가 아닌 파일로 설정됩니다.

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

**고체 AI 메모리(Solid AI Memory)**의 미래에 동참하십시오. "명령(Prompting)"에서 "설계(Architecting)"로 진화할 시간입니다.
