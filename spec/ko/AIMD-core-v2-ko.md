# AIMD Core v2 초안

AI를 위한 최소 canonical memory 규격

---

## 상태

```text
Version: v2-core-draft
Status: Proposal
License intent: public core
```

이 문서는 공개 AIMD Core를 정의합니다.
넓은 채택과 상호운용성을 위해 가장 작고 안정적인 AIMD 부분만 남긴 스펙입니다.

---

## Core에 포함되는 것

AIMD Core에는 아래만 포함됩니다.

- front matter
- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`
- 선택적 `:::diff`

상위 execution, knowledge, trust, federation 레이어는 포함하지 않습니다.

---

## 적합성 목표

같은 AIMD Core 문서를 읽는 두 구현체는 아래에 대해 동등한 이해에 도달해야 합니다.

- intent
- constraints
- state

목표는 동일한 내부 AST가 아니라 의미적 동등성입니다.

---

## 최소 예시

```markdown
---
aimd: "2.0-core"
id: payment-retry
rev: 1
mode: c
---

:::intent
g1: payment_retry_without_double_charge
ok1: duplicate_charge=forbidden
:::

:::rules
r1: idempotency=required
ban1: duplicate_charge
:::

:::state
v1: retry_endpoint_exists
o1: concurrent_retry_risk
n1: add_parallel_retry_test ref(o1, r1)
:::

:::flow
s1: inspect_retry_route
s2: add_test
seq1: s1 -> s2
:::
```

---

## 필수 블록

모든 AIMD Core 문서에는 아래 블록이 정확히 한 번씩 있어야 합니다.

- `:::intent`
- `:::rules`
- `:::state`
- `:::flow`

권장 canonical 순서는 다음과 같습니다.

```text
intent -> rules -> state -> flow
```

순서 위반은 경고이며 치명적 오류는 아닙니다.

---

## 라인 문법

Canonical 라인 형식:

```text
<line-id>: <payload> [ref(<line-id>...)]
```

허용되는 core prefix:

- `g`, `ok`, `in`, `out`
- `r`, `ban`, `fz`
- `v`, `o`, `a`, `n`, `ask`
- `s`, `seq`, `chain`

---

## Validator 기본 규칙

표준 validator 코드:

- `E001` 필수 블록 누락
- `E002` 잘못된 prefix
- `E003` 중복 line ID
- `E004` 잘못된 ref
- `E005` front matter 필수 필드 누락
- `E007` 블록 순서 위반
- `E008` unresolved ask
- `E009` finalized 문서의 auto-id
- `E010` payload 과다 길이
- `E011` 필수 블록 중복

---

## 레거시 스펙과의 관계

- `AIMD-v1.4-ko.md`, `AIMD-v1.5-ko.md`는 공개 레거시 스펙으로 유지됩니다
- AIMD Core v2는 현재 공개 차세대 코어 초안입니다
- 상위 AIMD 레이어는 별도 문서로 분리될 수 있습니다
