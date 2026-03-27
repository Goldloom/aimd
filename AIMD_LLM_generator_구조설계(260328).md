# AIMD LLM Generator 구조 설계

## 1. 목적

현재 `prompt -> aimd`는 로컬 규칙 기반 generator다.  
다음 단계는 실제 LLM을 호출해 더 정교한 `intent / flow / api / schema / rules / ai`를 생성하는 구조를 정의하는 것이다.

목표는 세 가지다.

- 원문 `prompt` 또는 `Markdown`에서 더 풍부한 AIMD를 생성한다.
- 추론과 사실을 구분한 채 생성한다.
- 생성 후 validator와 repair loop를 거쳐 handoff 가능한 품질로 만든다.

---

## 2. 목표 아키텍처

```text
prompt / markdown / existing aimd
          |
          v
  Input Normalizer
          |
          v
  Source Analyzer
    - headings
    - lists
    - tables
    - refs
    - inherits
          |
          v
  Context Builder
    - source excerpt pack
    - ref content
    - inherited ai/rules/abbr
    - generation policy
          |
          v
  LLM Generator
    - block planning
    - AIMD draft generation
    - uncertainty marking
          |
          v
  Rule Validator
          |
          v
  Semantic Validator
          |
     fail | pass with warnings | pass
          v
   Repair Loop / Final AIMD
```

---

## 3. 구성 요소

### 3.1 Input Normalizer

입력을 통일한다.

- plain prompt
- plain Markdown
- 부분 변환된 `.aimd`
- 기존 `.aimd` + 추가 요구사항

주요 역할:

- front matter 제거/보존
- code fence와 prose 분리
- 기존 AIMD 구조층과 일반 prose 구분
- source type 판별

### 3.2 Source Analyzer

LLM에 바로 다 던지지 않고 구조 신호를 먼저 뽑는다.

추출 대상:

- 제목, 요약, section heading
- ordered list / bullet list
- markdown table
- explicit API path
- 규칙성 표현 `must / should / 금지 / 반드시`
- 숫자, 날짜, enum 후보

이 단계 출력은 `Generation IR`로 잡는 것이 좋다.

예:

```json
{
  "title": "Payment Retry",
  "source_type": "prompt",
  "api_patterns": [],
  "table_candidates": [],
  "rule_candidates": [
    "must guarantee idempotency",
    "must block duplicate payment"
  ],
  "uncertainties": [
    "retry eligibility policy not explicit"
  ]
}
```

### 3.3 Context Builder

LLM 호출에 필요한 입력 패키지를 만든다.

포함 항목:

- 원문 excerpt
- `@ref` 파일 내용 또는 요약
- `inherits` 체인의 `:::ai`, `:::rules`, `:::abbr`
- generator 시스템 프롬프트
- 출력 포맷 규약
- 이미 추출된 IR

핵심 원칙:

- 전체 파일을 무조건 넣지 말고 필요한 근거만 넣는다.
- 원문 사실과 상속 규칙을 분리한다.
- output contract를 엄격히 준다.

---

## 4. LLM Generator 단계

LLM generator는 최소 2단계가 좋다.

### Stage A. Block Planning

LLM이 먼저 어떤 블록이 필요한지 결정한다.

출력 예:

```json
{
  "blocks": [
    "intent",
    "flow",
    "rules",
    "test",
    "ai"
  ],
  "omitted_blocks": {
    "api": "explicit routes missing",
    "schema": "data fields not explicit"
  }
}
```

이 단계의 장점:

- 과잉 생성 방지
- 누락 블록 이유 설명 가능
- repair loop에서 비교가 쉬움

### Stage B. AIMD Draft Generation

planning 결과를 바탕으로 AIMD 본문을 생성한다.

강제 규칙:

- 사실과 추론을 구분한다.
- 명시되지 않은 내용은 `ASSUMPTION` 또는 `OPEN`으로 표시한다.
- `VERIFIED`는 source excerpt 또는 ref에 근거가 있어야 한다.
- `CRITICAL`은 실제 제약만 남긴다.
- 블록 간 충돌을 만들지 않는다.

---

## 5. 출력 계약

LLM을 바로 AIMD 텍스트로 출력하게 할 수도 있지만, 실제로는 중간 JSON 계약을 두는 편이 낫다.

권장 구조:

1. LLM이 먼저 structured JSON 생성
2. 로컬 renderer가 JSON을 AIMD로 렌더링

이유:

- fence 오류 감소
- semantic validator 입력 정규화
- repair loop에서 필드 단위 수정 가능

예시 JSON:

```json
{
  "intent": {
    "title": "Payment Retry",
    "summary": "Retry failed payments safely"
  },
  "flow": [
    "retry request -> validate eligibility",
    "eligible retry -> execute payment retry with idempotency guard",
    "persist result -> return stable response"
  ],
  "rules": [
    "must guarantee idempotency",
    "must block duplicate payment"
  ],
  "ai": {
    "critical": [
      "Idempotency is mandatory",
      "Duplicate payment must be blocked"
    ],
    "open": [
      "Retry eligibility policy needs confirmation"
    ]
  }
}
```

---

## 6. Validator 연동

LLM generator는 단독으로 끝나면 안 된다.

필수 후처리:

1. rule validator
2. semantic validator
3. 필요 시 repair prompt 재호출

### Repair Loop 예시

```text
draft AIMD
  -> semantic validator
  -> issue: VERIFIED without evidence
  -> repair prompt:
       "Downgrade unsupported VERIFIED items to ASSUMPTION or OPEN.
        Do not invent new evidence."
  -> revised AIMD
```

---

## 7. 모델 역할 분리

하나의 LLM에 전부 맡길 수도 있지만, 역할 분리가 더 안정적이다.

- `planner model`
  - 블록 필요 여부 결정
  - source coverage 평가

- `generator model`
  - 실제 AIMD 초안 생성

- `repair model`
  - validator issue 기반 국소 수정

장점:

- 비용 분리
- 실패 원인 분리
- deterministic post-processing과 결합 용이

---

## 8. 시스템 프롬프트 요구사항

LLM generator용 시스템 프롬프트는 최소한 아래를 포함해야 한다.

- AIMD는 human-directed, AI-generated structured Markdown이라는 정의
- 사실 / 추론 / 미해결 상태 구분 규칙
- `:::ai` 지시자의 의미
- `.aimd`이지만 미완성 문서일 수 있으므로 normalize 우선 규칙
- 기존 AIMD가 있으면 overwrite가 아니라 merge/update 우선
- 출력은 지정된 JSON contract 또는 AIMD contract를 따를 것

---

## 9. 장애 대응

### LLM 실패 시 fallback

- structured JSON 파싱 실패
- hallucination score 높음
- token budget 초과

fallback 전략:

- 현재의 rule-based generator로 다운그레이드
- `OPEN`을 더 많이 남긴 conservative AIMD 생성
- 사용자에게 incomplete draft로 명시

### 위험 관리

- 명시되지 않은 API route invent 금지
- 숫자/날짜 추정 금지
- `VERIFIED` 남용 금지
- `CRITICAL` 과잉 생성 금지

---

## 10. 구현 단계 제안

### Phase 1

- existing rule-based IR 유지
- LLM은 block planning만 담당

### Phase 2

- JSON contract 기반 AIMD generation
- rule validator 자동 연결

### Phase 3

- semantic validator 연동
- repair loop 자동화

### Phase 4

- ACP role-specific generation까지 LLM 확장
- audit trail와 evidence map 저장

---

## 11. 한 줄 결론

실제 LLM generator는 `LLM 한 번 호출해서 AIMD 텍스트를 뽑는 기능`이 아니라, `IR + validator + repair loop`를 가진 생성 파이프라인으로 설계해야 안정적이다.

---

## 12. AI 기록의 비결정성

이 구조에서도 `AI가 실제로 어떤 문장을 남길지`를 완전히 예측할 수는 없다. 같은 입력이라도 모델, 프롬프트, 주변 컨텍스트에 따라 표현과 강조점이 달라질 수 있다.

중요한 점은 목표가 `AI가 항상 똑같은 문장을 쓰게 만드는 것`이 아니라는 것이다. 실제 목표는 아래와 같다.

- 아무 말이나 자유롭게 쓰지 못하게 한다
- 허용된 블록과 지시자 안에서만 기록하게 한다
- `VERIFIED`, `ASSUMPTION`, `OPEN`, `CRITICAL`, `NEXT`처럼 의미가 정해진 슬롯에만 남기게 한다
- validator와 repair loop로 위험한 기록을 낮은 신뢰 상태로 내리거나 수정하게 한다
- 나중에 실패했을 때 어떤 판단이 어디서 잘못됐는지 추적 가능하게 만든다

즉 AIMD generator의 성공 기준은 `출력 문장 예측 가능성`이 아니라 `출력 의미 범위의 통제 가능성`이다.
