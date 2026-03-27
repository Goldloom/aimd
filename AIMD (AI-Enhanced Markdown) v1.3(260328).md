# AIMD (AI-Enhanced Markdown) v1.3 — Human-Directed, AI-Generated Structured Markdown

---

## 목차

```text
1.  v1.3 핵심 변화
2.  핵심 정의
3.  설계 목표
4.  생성 및 운영 모델
5.  정보 계층 구조
6.  파일 규격
7.  블록 문법
8.  핵심 블록
9.  :::ai 운영 레이어
10. ACP와의 관계
11. 시스템 프롬프트 요구사항
12. Validator 요구사항
13. 디버깅 / 감사 / 컴플라이언스
14. PRD 기반 멀티 에이전트 개발 시나리오
15. 도입 전략
16. v1.2 대비 변경 요약
17. 정직한 결론
```

---

## 1. v1.3 핵심 변화

v1.3은 v1.2의 연장선이지만, 포맷의 정체성을 더 분명하게 재정의한 버전이다.

### v1.2의 관점

```text
AIMD = 사람이 Markdown을 구조적으로 작성하는 포맷
핵심 가치 = 토큰 절감 + 구조화 + 상속 + 참조
```

### v1.3의 관점

```text
AIMD = 사람이 AI를 통해 생성하는 structured Markdown
핵심 가치 = AI 협업용 공유 구조 문서 + handoff memory + 디버깅 가능성
```

즉, v1.3에서 중요한 변화는 다음과 같다.

1. 사람이 `:::` 블록을 직접 손으로 쓰는 전제를 버린다
2. AIMD는 `human-directed, AI-generated` 문서로 본다
3. 생성 이후에는 여러 AI 에이전트가 같은 AIMD를 참조하고 갱신할 수 있다
4. `:::ai`는 단순 보조 설명이 아니라 AI 운영 레이어로 본다
5. ACP를 AIMD에서 추출되는 handoff payload로 명확히 연결한다
6. 시스템 프롬프트와 validator를 필수 인프라로 끌어올린다

---

## 2. 핵심 정의

### Plain Markdown

사람이 자유롭게 작성한 원문 문서.

예:

- PRD 초안
- 회의 메모
- 설계 산문
- README

### AIMD

```text
AIMD = Human-directed, AI-generated structured Markdown
```

사람이 자연어, PRD, 기존 Markdown, 요구사항을 제공하고, AI가 구조 블록을 포함한 `.aimd` 문서를 생성한다.

AIMD는 다음 성격을 가진다.

- 사람이 생성 요청을 한다
- AI가 구조화한다
- 여러 AI가 같은 AIMD를 참조·갱신할 수 있다
- 인간은 전체 구조층을 직접 유지보수할 필요가 없다

### ACP

```text
ACP = Agent Context Payload
```

AIMD에서 특정 역할이나 handoff 시점에 맞게 추출된 전달용 컨텍스트 묶음이다.

정리하면:

```text
Plain Markdown / Prompt  ->  AIMD  ->  ACP
인간 원문/의도              공유 구조 문서   핸드오프 페이로드
```

---

## 3. 설계 목표

```text
v1.3의 목표
├── 사람에게 새 문법 학습을 강요하지 않는다
├── AI가 구조화된 문서를 생성하게 한다
├── 여러 AI가 같은 문서를 공유 기억처럼 활용하게 한다
├── role-specific handoff는 ACP로 분리한다
├── 잘못된 결과가 나왔을 때 원인을 추적 가능하게 한다
└── 엔터프라이즈 환경에서도 감사 가능성을 확보한다
```

토큰 절감은 여전히 유효한 가치지만, v1.3에서는 그것이 정체성의 중심은 아니다.

v1.3의 중심 가치는 다음 세 가지다.

- 공유 가능한 구조화
- 재사용 가능한 AI 운영 레이어
- 추적 가능한 판단 흔적

---

## 4. 생성 및 운영 모델

### 생성 경로 1: Prompt -> AIMD

사람이 이렇게 요청할 수 있다.

```text
"결제 재시도 기능 PRD를 AIMD로 생성해줘"
```

이 경우 AI는 요구사항을 해석해 `.aimd` 문서를 직접 생성한다.

### 생성 경로 2: Markdown -> AIMD

기존 Markdown 문서를 AI가 AIMD로 변환한다.

```text
product-prd.md  ->  product-prd.aimd
```

### 운영 경로 3: AIMD -> AIMD 업데이트

AIMD 생성 이후에는 여러 AI 에이전트가 같은 문서를 읽고 `:::` 구조층을 갱신할 수 있다.

예:

- backend agent가 `VERIFIED` 추가
- qa agent가 `OPEN` 갱신
- integration agent가 `FREEZE` 설정

### handoff 경로 4: AIMD -> ACP

전체 AIMD를 그대로 넘기지 않고, 특정 역할에 필요한 내용만 ACP로 추출한다.

예:

- `ACP-FE`
- `ACP-BE`
- `ACP-QA`

### 운영 원칙

```text
사람의 역할
├── 의도 제시
├── 결과 검토
└── 파일 위치 선택

AI의 역할
├── AIMD 생성
├── 구조 블록 작성
├── AIMD 갱신
└── ACP 추출
```

---

## 5. 정보 계층 구조

```text
Layer 0  │ Human Intent / Source      │ 자연어, PRD, 자유서술 Markdown
Layer 1  │ AIMD Shared Structure      │ 여러 AI가 공유하는 구조 문서
Layer 2  │ AIMD Operational Layer     │ :::ai, VERIFIED, OPEN, FREEZE 등
Layer 3  │ ACP Handoff Payload        │ 역할별 전달용 컨텍스트
Layer 4  │ Validator / Audit Layer    │ 품질 검증, 디버깅, 감사
```

### 누가 무엇을 보는가

```text
인간: 주로 Layer 0-1 중심으로 검토
AI: Layer 1-4 전체를 사용
```

중요한 점:

- `:::` 구조층은 주로 AI를 위한 레이어다
- 인간은 필요할 때만 이를 들여다본다
- 문제가 생겼을 때 이 레이어가 디버깅 흔적이 된다

---

## 6. 파일 규격

```yaml
확장자:     .aimd
호환성:     CommonMark 상위호환
인코딩:     UTF-8
생성주체:   AI
생성요청:   사람
```

권장 front matter 예시:

```yaml
---
aimd: "1.3"
source: prompt            # prompt | markdown | hybrid
generated-by: product_agent
updated-by: integration_agent
inherits: ./project.aimd
---
```

선택 필드:

```yaml
project: my-app
owner: product-team
status: draft
```

---

## 7. 블록 문법

### 기본 문법

```text
:::블록타입 [속성]
내용
:::
```

원칙:

- 사람이 직접 타이핑할 필요는 없다
- AI가 생성하고, 이후 AI가 갱신한다
- 블록명과 지시자는 안정적으로 유지되어야 한다

### 블록 분류

| 블록 | 역할 | 주 사용 주체 |
|------|------|--------------|
| `:::intent` | 목표 / 요구사항 구조화 | AI 생성 |
| `:::flow` | 절차 / 흐름 구조화 | AI 생성 |
| `:::api` | API 계약 구조화 | AI 생성 |
| `:::schema` | 데이터 구조 구조화 | AI 생성 |
| `:::rules` | 규칙 / 제약 구조화 | AI 생성 |
| `:::deps` | 의존 관계 | AI 생성 |
| `:::test` | 테스트 시나리오 | AI 생성 / QA 갱신 |
| `:::diff` | 변경 요약 | AI 생성 |
| `:::abbr` | 축약어 사전 | AI 생성 |
| `:::ai` | AI 운영 레이어 | AI 생성 / AI 갱신 |
| `:::human` | 인간용 요약 / 렌더링 보조 | AI 생성 가능 |

보조 규칙:

- `@ref`: 외부 파일/문서 참조
- `inherits`: 상위 AIMD 규칙 상속

---

## 8. 핵심 블록

### `:::intent`

문서의 목적과 성공 기준을 구조화한다.

```markdown
:::intent payment-retry
목표: 결제 실패 후 즉시 재시도 가능
성공 기준: 중복 결제 없이 최대 3회 재시도
:::
```

### `:::flow`

사용자/시스템 흐름을 단계적으로 정리한다.

```markdown
:::flow payment-retry
1. 결제 실패 -> 재시도 버튼 노출
2. 재시도 클릭 -> 기존 주문 컨텍스트 유지
3. 서버 -> idempotency key 검증
4. 처리 완료 요청 -> 기존 결과 반환
:::
```

### `:::api`

엔드포인트와 응답/오류 계약을 구조화한다.

```markdown
:::api
POST /payments/:orderId/retry -> PaymentRetryResult
  @auth: Bearer
  @param orderId: uuid
  @ok 200: PaymentRetryResult{status,message,retryCount}
  @err 409: PAYMENT_ALREADY_PROCESSED
  @err 422: PAYMENT_RETRY_LIMIT_EXCEEDED
:::
```

### `:::schema`

데이터 구조를 요약한다.

```markdown
:::schema PaymentRetry
#id: uuid
orderId: uuid! @fk(Order)
retryCount: int! @min(0) @max(3)
lastErrorCode: string?
updatedAt: datetime @auto
:::
```

### `:::rules`

규칙과 품질 기준을 구조화한다.

```markdown
:::rules
idempotency: required
duplicate-charge: forbidden
retry-limit: 3
strict-contract: true
:::
```

### `:::test`

테스트 시나리오를 남긴다.

```markdown
:::test payment-retry
✓ first retry -> 200
✓ processed payment retry -> 409
✓ limit exceeded -> 422
✗ concurrent retry double charge -> forbidden
:::
```

### `@ref`

코드, 문서, 기존 자산을 참조한다.

```markdown
@ref:src/payments/payment.service.ts
@ref:docs/payment/policy.md
@ref:src/orders/order.service.ts::OrderService.retry
```

### `inherits`

상위 문서의 규칙을 재사용한다.

```yaml
---
aimd: "1.3"
inherits: ../project.aimd
---
```

---

## 9. `:::ai` 운영 레이어

v1.3에서 `:::ai`는 단순 설명 블록이 아니라, AI 협업을 위한 운영 레이어다.

### 역할

- 제약 전달
- 검증 상태 기록
- 미해결 위험 유지
- 다음 handoff 방향 제시
- 디버깅 흔적 저장

### 권장 지시자

```text
CRITICAL[n]  절대 어기면 안 되는 제약
VERIFIED     근거가 있는 확인 완료 정보
OPEN         아직 닫히지 않은 문제
ASSUMPTION   추론 또는 임시 가정
FREEZE       후속 에이전트가 쉽게 바꾸면 안 되는 범위
NEXT         다음 역할 또는 다음 작업
ASK          사람 또는 상위 에이전트 확인 필요
```

### 예시

```markdown
:::ai
FROM: backend_agent
VERIFIED: 중복 처리 요청 시 409 반환
OPEN: rollback 경로 회귀 검증 필요
CRITICAL[1]: 동일 orderId 중복 결제 금지
FREEZE: API error code contract
NEXT: qa_agent
:::
```

### 운영 원칙

1. `VERIFIED`는 실제 근거가 있을 때만 쓴다
2. 불확실한 내용은 `OPEN` 또는 `ASSUMPTION`으로 남긴다
3. `CRITICAL[n]`은 진짜 제약만 넣는다
4. `FREEZE`는 계약/경계 보호에만 쓴다
5. 장황한 산문보다 다음 AI가 읽기 쉬운 구조를 우선한다

---

## 10. ACP와의 관계

ACP는 AIMD를 대체하지 않는다. ACP는 AIMD에서 추출되는 handoff 단위다.

### 역할 차이

```text
AIMD = shared structured document
ACP  = role-specific handoff payload
```

### 예시

```text
하나의 AIMD PRD
├── ACP-FE  -> 화면, UX, 상태 표시
├── ACP-BE  -> API, 도메인 로직, 예외 처리
├── ACP-QA  -> 검증 기준, VERIFIED, OPEN
└── ACP-REVIEW -> 변경 요약, 위험, 승인 포인트
```

### 왜 분리하나

- AIMD 전체는 길고 풍부하다
- handoff는 역할별 최소 컨텍스트가 더 효율적이다
- ACP는 AIMD를 역할 중심으로 재구성한 출력이다

---

## 11. 시스템 프롬프트 요구사항

v1.3에서 AIMD의 성공 여부는 포맷 문법보다 `AI에게 AIMD를 어떻게 생성·갱신하라고 가르치느냐`에 달려 있다.

시스템 프롬프트는 최소한 아래를 알려줘야 한다.

### 필수 인식

```text
- AIMD는 사람이 AI를 통해 생성하는 structured Markdown이다
- 사용자가 .aimd를 직접 작성하지 않아도 된다
- AI는 .aimd 파일을 생성하고 갱신해야 한다
- 여러 AI 에이전트가 같은 AIMD를 참조하고 업데이트할 수 있다
- ACP는 AIMD에서 추출되는 handoff payload다
```

### 필수 행동 규칙

1. 사용자가 PRD나 문서를 주면 AIMD 파일을 생성한다
2. `:::` 블록은 AI가 생성한다
3. 기존 AIMD가 있으면 먼저 읽고 점진적으로 갱신한다
4. 불확실한 내용은 `OPEN` 또는 `ASSUMPTION`으로 표시한다
5. 후속 AI가 읽을 수 있도록 구조를 안정적으로 유지한다
6. 역할별 handoff가 필요할 때 ACP를 추출한다

---

## 12. Validator 요구사항

포맷이 제대로 작동하려면 validator가 있어야 한다. 시스템 프롬프트만으로는 일관성을 완전히 보장할 수 없다.

### 최소 검사 항목

```text
파일 수준
- .aimd 확장자
- UTF-8
- 비어 있지 않음

구조 수준
- 블록 문법 정상
- 문서 목적에 맞는 핵심 블록 존재
- @ref / inherits 형식 정상

내용 수준
- 사실과 추론 구분
- VERIFIED / OPEN 구분
- CRITICAL / FREEZE 일관성

협업 수준
- 후속 AI가 읽고 이어서 작업 가능
- ACP 추출 가능
- 디버깅 흔적 유지
```

### validator의 목적

- 구조 오류 발견
- 잘못된 과신 발견
- handoff 불가능 상태 발견
- 감사 가능성 확보

---

## 13. 디버깅 / 감사 / 컴플라이언스

v1.3의 중요한 차별점은, AIMD가 단순한 구조 문서가 아니라 `AI 판단의 흔적`을 남긴다는 점이다.

### 디버깅 가치

문제가 생겼을 때 다음을 바로 추적할 수 있다.

- 어떤 요구사항을 잘못 읽었는가
- 무엇을 `VERIFIED`라고 오판했는가
- `OPEN`이어야 할 것이 중간에 사라졌는가
- `CRITICAL`을 어느 단계에서 무시했는가
- 어느 ACP handoff에서 잘못된 전제가 넘어갔는가

### 감사 가능성

```text
::: 구조층 = AI 판단 흔적
ACP        = handoff 시점의 구조화된 전달 기록
```

따라서 AIMD/ACP는 아래 역할을 동시에 수행한다.

- 컨텍스트 전달 레이어
- handoff memory 레이어
- 디버깅 레이어
- 감사 가능성 레이어

### 엔터프라이즈 관점

규제가 강한 조직에서는 결과보다 판단 경로가 더 중요할 때가 많다.

이 구조는 다음 질문에 답할 수 있게 돕는다.

- 누가 어떤 전제로 작업했는가
- 무엇이 `VERIFIED`였고 무엇이 `OPEN`이었는가
- 어떤 계약이 `FREEZE`되었는가
- 어느 단계에서 handoff 품질이 무너졌는가

즉, AIMD/ACP는 단순 생산성 도구가 아니라 `감사 가능한 AI 협업 구조`가 될 수 있다.

---

## 14. PRD 기반 멀티 에이전트 개발 시나리오

v1.3의 대표 사용 시나리오는 `하나의 PRD를 여러 AI 에이전트가 병렬 / 순차로 참조하며 개발하는 흐름`이다.

```text
[PM / PO]
  prompt 또는 freeform PRD.md
  "이 PRD를 AIMD로 생성해줘"
          |
          v
[AIMD Generator Agent]
  payment-retry-prd.aimd 생성
          |
          v
[Orchestrator Agent]
  역할별 ACP 추출
  ├─ ACP-FE
  ├─ ACP-BE
  ├─ ACP-DATA
  └─ ACP-QA
          |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
[Frontend]           [Backend]             [Data]
  AIMD / ACP 갱신      AIMD / ACP 갱신        AIMD / ACP 갱신
          \                   |                   /
           \                  |                  /
            +-----------------+-----------------+
                              v
                      [Integration Agent]
                              |
                              v
                           [QA Agent]
                              |
                              v
                      [Review / Deploy]
```

### 핵심 포인트

1. 사람은 AIMD를 직접 손으로 작성하지 않는다
2. AI가 AIMD를 생성한다
3. 여러 AI가 같은 AIMD를 참조한다
4. 필요한 경우 역할별 ACP만 뽑아 쓴다
5. 문제가 생기면 AIMD의 `:::` 구조층을 보면 오판 지점을 추적할 수 있다

---

## 15. 도입 전략

### 1단계: 생성부터 시작

- 사용자는 PRD 또는 자유서술 Markdown을 준다
- AI는 `.aimd` 파일을 생성한다
- 사람은 저장 위치를 결정하고 결과를 검토한다

### 2단계: 참조와 갱신

- 여러 AI가 같은 AIMD를 읽고 구조층을 갱신한다
- `VERIFIED`, `OPEN`, `NEXT`, `FREEZE`를 유지한다

### 3단계: ACP 추출

- 프론트엔드 / 백엔드 / QA / 리뷰용으로 역할별 ACP를 만든다

### 4단계: validator와 감사

- validator로 구조 / 사실성 / handoff 가능성을 검사한다
- 감사 가능성이 중요한 조직에서는 판단 흔적을 운영 자산으로 본다

---

## 16. v1.2 대비 변경 요약

| 항목 | v1.2 | v1.3 |
|------|------|------|
| AIMD 정의 | 사람이 작성하는 구조 포맷 | 사람이 AI를 통해 생성하는 structured Markdown |
| `:::` 블록 | 사람이 직접 쓸 수 있음 | AI가 생성·갱신하는 운영 레이어 |
| Markdown와 관계 | Markdown을 대체/변환 | Prompt/Markdown 모두 입력 가능 |
| `:::ai` 의미 | AI 전용 컨텍스트 | AI 운영 레이어 + 판단 흔적 |
| ACP 관계 | 암시적 | 명시적 handoff payload |
| 핵심 가치 | 토큰 절감, 구조화 | 공유 구조 문서, handoff, 디버깅, 감사 |
| 필수 인프라 | 포맷 자체 중심 | 시스템 프롬프트 + validator 필수 |

---

## 17. 정직한 결론

v1.3에서 AIMD는 더 이상 단순한 "새 마크다운 문법"이 아니다.

정확히는 다음에 가깝다.

```text
AIMD = 사람이 AI를 통해 생성하고,
       여러 AI가 참조·갱신하며,
       필요할 때 ACP를 추출하는
       공유 구조 문서 레이어
```

이 버전에서 중요한 것은 사람이 모든 블록을 직접 쓰는 것이 아니다.

- 사람은 의도와 경계를 제공한다
- AI는 구조를 생성한다
- 여러 AI는 구조를 갱신한다
- validator는 품질을 검사한다
- ACP는 역할별 handoff를 담당한다

한 줄로 요약하면:

> AIMD v1.3은 "AI가 읽기 쉬운 문서 포맷"을 넘어서, "AI들이 함께 쓰고 이어받고 추적할 수 있는 공유 구조 문서"를 지향한다.

---

## AI 기록의 비결정성

다만 AIMD가 있다고 해서 AI가 항상 완전히 예측 가능한 문장으로 기록을 남기는 것은 아니다. 같은 입력이라도 모델, 컨텍스트, 작업 단계에 따라 표현 방식은 달라질 수 있다.

그래서 AIMD의 목적은 `AI가 무엇을 쓸지 완벽히 안다`가 아니라 `AI가 어떤 종류의 기록만 남길 수 있는지 제한한다`는 데 있다.

- `VERIFIED`는 근거가 있는 확인 완료 정보만 남긴다
- `ASSUMPTION`은 추론이나 임시 가정만 남긴다
- `OPEN`은 아직 닫히지 않은 문제만 남긴다
- `CRITICAL[n]`은 실제 제약만 남긴다
- `NEXT`는 다음 작업 책임만 남긴다

즉 AIMD는 문장 자체의 완전한 결정성을 보장하는 포맷이 아니라, `기록의 의미 범위와 추적 가능성`을 통제하는 운영 구조다.
