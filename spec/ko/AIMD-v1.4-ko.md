# AIMD (AI-Enhanced Markdown) v1.4

**부제: 멀티 에이전트 핸드오프를 위한 정형 시맨틱 메모리 (Canonical Semantic Memory for Multi-Agent Handoff)**

---

## 1. 문서 상태 (Document Status)

```text
버전: v1.4
상태: 제안된 규격 (Proposed Spec)
목표: AI 시맨틱 호환성 극대화 + 토큰 비용 최소화
범위: 포맷, 핸드오프 프로토콜, 검증 도구 기준
```

이 문서는 AIMD v1.4의 공식 사양 초안입니다.

---

## 2. 설계 목표 (Design Goals)

v1.4는 다음 두 가지 축을 동시에 최적화합니다:

1. **AI 시맨틱 호환성 극대화**: AI 에이전트가 정보를 오해 없이 정확하게 해석하게 함
2. **토큰 비용 최소화**: 전달되는 정보량을 압축하여 운영 비용 절감

v1.4는 `인간이 읽기 좋은 문서 포맷`보다 **`무손실 핸드오프를 위한 정형 메모리 포맷`**을 최우선 순위에 둡니다.

---

## 3. 공식 정의 (Formal Definition)

```text
AIMD v1.4 = AI 공유용 정형 시맨틱 메모리 + 선택적인 인간용 렌더링 레이어
```

v1.4에서 기본 신뢰 원천(Source of Truth)은 서술형 문장(Prose)이 아니라 **정형화된 라인 세트(Canonical Line Set)**입니다.

---

## 4. 규범적 용어 (Normative Language)

- `MUST`: 필수 사항
- `MUST NOT`: 금지 사항
- `SHOULD`: 강력 권장 사항
- `SHOULD NOT`: 특별한 이유가 없는 한 피해야 함
- `MAY`: 선택 사항

---

## 5. 핵심 원칙 (Core Principles)

```text
P1. 정형 데이터 우선 (canonical first)
P2. 서술형 문장은 선택 (prose optional)
P3. 일사 일처 (one fact, one location)
P4. 투영 기반 핸드오프 (projection handoff)
P5. 안정적인 라인 ID (stable line ids)
P6. 압축 효율 검증 (compression validated)
```

- **canonical first**: 정형 레이어가 기본 공유 문서가 됩니다.
- **prose optional**: 인간을 위한 설명 레이어는 선택 사항입니다.
- **one fact, one location**: 각 사실은 정확히 한 곳에만 기록됩니다.
- **projection handoff**: 핸드오프는 내용을 다시 쓰는 것이 아니라 필요한 라인을 선택(Projection)하는 방식입니다.
- **stable line ids**: 모든 의미 단위는 고유하고 안정적인 ID를 가집니다.
- **compression validated**: 품질 기준에 정확성뿐만 아니라 '비용 효율성'이 포함됩니다.

---

## 6. 정보 레이어 (Information Layers)

```text
Layer 0: 소스 의도 (Source Intent)
Layer 1: 정형 레이어 (Canonical Layer)
Layer 2: 선택적 렌더 레이어 (Optional Render Layer)
Layer 3: ACP 투영 레이어 (ACP Projection Layer)
Layer 4: 검증 레이어 (Validation Layer)
```

### Layer 0: 소스 의도 (Source Intent)
입력의 기원입니다.
- 자연어 요구사항
- 기존 마크다운 (Markdown)
- 기존 AIMD 문서

### Layer 1: 정형 레이어 (Canonical Layer)
실질적인 협업의 진실의 원천입니다.
- 기본 핸드오프 대상
- 압축된 라인 기반 표현
- 시맨틱 태그 및 고정 ID

### Layer 2: 선택적 렌더 레이어 (Optional Render Layer)
인간 리뷰어를 위한 설명 레이어입니다.
- 기본적으로 핸드오프에 포함되지 않음
- 충돌 발생 시 정형 레이어가 우선함

### Layer 3: ACP 투영 레이어 (ACP Projection Layer)
역할별 라인 선택 결과물입니다. (BE, FE, QA, Review 등)

### Layer 4: 검증 레이어 (Validation Layer)
구조, 의미, 압축 효율을 검증합니다.

---

## 7. 파일 규격 (File Specification)

### 7.1 확장자 및 인코딩
```yaml
extension: .aimd
encoding:  UTF-8
compat:    CommonMark (Markdown) 상위 호환
```

### 7.2 프론트 매터 (Front Matter)
v1.4 문서는 최소한의 프론트 매터를 사용해야 합니다(SHOULD).

```yaml
---
aimd: "1.4"
src: md
id: payment-retry
rev: 3
mode: c
---
```

**필드 정의:**
- `aimd`: 필수(MUST). 포맷 버전.
- `src`: 권장(SHOULD). `prompt | md | hybrid | aimd`
- `id`: 권장(SHOULD). 문서 고유 식별자.
- `rev`: 권장(SHOULD). 리비전 번호.
- `mode`: 권장(SHOULD). `c (canonical) | r (render) | cr (both)`

---

## 8. 문서 블록 순서 (Document Block Order)

정형 문서는 다음 순서를 따르는 것을 권장합니다(SHOULD):
1. 프론트 매터 (Front Matter)
2. `:::intent`
3. `:::rules`
4. `:::state`
5. `:::flow`
6. [기타 선택적 블록]

이 순서는 목적 -> 제약 -> 상태 -> 흐름 순으로 정보를 배치하여 핸드오프 해석 비용을 최소화합니다.

---

## 9. 핵심 블록 세트 (Core Block Set)

### 9.1 필수 핵심 블록
- `:::intent`, `:::rules`, `:::state`, `:::flow`

### 9.2 선택적 블록
- `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`, `:::diff`

### 9.3 제거되거나 흡수된 개념
v1.4에서는 다음 블록들이 제거되거나 병합되었습니다:
- `:::ai` → `:::state`로 흡수
- `:::deps` → `:::flow` 또는 `:::ref`로 흡수
- `:::abbr` → 전역 사전 또는 외부 문서로 이동

---

## 10. 정형 라인 구문 (Canonical Line Syntax)

### 10.1 기본 형식
모든 핵심 블록의 라인은 다음 형식을 따라야 합니다(SHOULD):
` <line-id>: <payload> `

**예시:**
```text
g1: single_domain_platform
r1: nextjs=single_app
v1: plan_sot=subscriptions.plan
o1: turborepo_threshold_unresolved
s1: auth->billing->registry->apps
```

### 10.2 라인 ID 규칙 (Line ID Rules)
라인 ID는 다음 조건을 만족해야 합니다(MUST):
- 블록의 의미와 연결된 접두사(Prefix) 사용
- 문서 내에서 유일함
- 개정(Revision) 시에도 최대한 안정적으로 유지됨

### 10.3 페이로드 규칙 (Payload Rules)
페이로드는 다음과 같아야 합니다(SHOULD):
- 정규화된 짧은 표현 사용
- `key=value` 또는 `subject->result` 형식 사용
- 열거형(Enum) 스타일의 리터럴 사용

**금지 사항(SHOULD NOT):**
- 긴 서술형 문장
- 의미가 중복되는 반복적 표현
- 모호한 수식어 사용

---

## 11. 코어 블록 상세 명세

### 11.1 `:::intent`
문서의 목표와 성공 기준을 담습니다.
- 접두사: `g` (goal), `ok` (success criteria), `in` (in-scope), `out` (out-scope)

### 11.2 `:::rules`
제약 사항, 금지 사항, 동결 사항을 담습니다.
- 접두사: `r` (required), `ban` (forbidden), `fz` (freeze)

### 11.3 `:::state`
검증 상태와 미결 상태를 담습니다.
- 접두사: `v` (verified), `o` (open), `a` (assumption), `n` (next), `ask` (human confirmation)

### 11.4 `:::flow`
실행 순서를 담습니다.
- 접두사: `s` (step)

---

## 12. 선택적 블록 명세

- `:::schema`: 데이터 구조가 핸드오프에 직접적으로 필요할 때만 사용.
- `:::api`: API 계약이 핸드오프에 직접적으로 필요할 때만 사용.
- `:::human`: 인간 리뷰어를 위한 설명이 필요할 때 사용 (정형 데이터를 덮어써서는 안 됨).

---

## 13. 서술형 문장 금지 구역 (Prose-Free Zone)

v1.4의 핵심 규칙: **핵심 블록 내부에서는 서술형 문장(Free prose)을 금지합니다.**

---

## 14. 일사 일처 (One Fact, One Location)

동일한 사실은 오직 한 곳에만 존재해야 합니다(MUST). 다른 블록에서 참조가 필요한 경우 라인 ID를 사용하십시오(예: `n1: implement(r2)`).

---

## 15. 통제된 어휘 (Controlled Vocabulary)

정형 레이어는 통제된 어휘를 사용해야 합니다(SHOULD). 동일한 의미에 대해 중복된 표현(예: `billing_sot`, `pricing_truth` 등)을 사용하지 마십시오.

---

## 16. ACP 명세 (ACP Specification)

### 16.1 정의
`ACP = 정형 AIMD로부터 역할별 라인 투영(Projection)`

### 16.2 규칙
ACP 추출기는 다음을 수행해야 합니다(SHOULD):
- 의역 최소화
- 라인 ID 보존
- 블록 순서 보존

---

## 17. 델타 업데이트 명세 (Delta Update Specification)

v1.4는 전체 재작성보다 델타 업데이트(`add`, `drop`, `set`)를 우선시해야 합니다(SHOULD). 이는 토큰 비용을 절감하고 라인 ID의 안정성을 유지하기 위함입니다.

---

## 18. 검증기 요구사항 (Validator Requirements)

검증기는 3가지 레이어로 구성됩니다:
1. **구문 검증기 (Syntax)**: 포맷, 구조, 라인 ID 규칙 확인.
2. **의미 검증기 (Semantic)**: 의미 보존성, 일사 일처 원칙 준수 확인.
3. **압축 검증기 (Compression)**: 토큰 비용, 서술형 비율, 중복성 확인.

---

## 19. 제너레이터 요구사항 (Generator Requirements)

v1.4 제너레이터는 다음을 수행해야 합니다(SHOULD):
1. 소스 의도 추출
2. 정형 사실 정규화
3. 안정적인 라인 ID 할당
4. 코어 블록 우선 생성
5. `mode: c`를 기본값으로 출력

---

## 20. 준수 예시 (Conformant Example)

(생략 - 영문판과 동일한 코드 블록 사용)

---

## 21. 비평상 예시 (Non-Conformant Example)

서술형 문장으로 가득 찬 `:::state` 블록 등은 v1.4 규격 미달입니다.

---

## 22. v1.3 대비 변경 사항

1. `:::ai` → `:::state` 로 변경
2. 필수 코어 블록 세트 고정
3. 라인 ID가 핵심 개념으로 승격됨
4. ACP가 '투영'으로 재정의됨
5. 압축 검증기 추가

---

## 23. 적합성 목표 (Conformance Goals)

v1.4는 다음 수치를 목표로 합니다:
- 시맨틱 호환성: 95점 이상
- 토큰 효율성: 95점 이상

---

## 24. 흔한 오해 (Common Misconceptions)

이 섹션은 AIMD 규격에 대해 알려진 오해를 정정합니다.

### 오해 1: "MD→AIMD 변환은 의도적 손실 압축이다"

**틀렸습니다.** MD→AIMD 변환은 반드시 의미 손실이 없어야 합니다(semantically lossless).

| | 잘못된 이해 | 올바른 이해 |
|---|---|---|
| 압축 대상 | 의미(semantic content) | 표현 형식(장황함, 중복) |
| 목표 | 의도적 정보 손실 | 의미 100% 보존 |
| "압축"의 의미 | 더 적은 사실 | 동일한 사실을 정규화된 표현으로 |

### 오해 2: "'투영(Projection)'이 변환 방식을 설명한다"

**틀렸습니다.** AIMD에서 "투영(Projection)"은 오직 **ACP(Agent Context Projection)**에만 해당합니다 — 완성된 canonical 문서에서 역할별 라인을 선택하는 하위 작업입니다.

```text
올바른 "투영" 사용:
  ACP-FE = intent(g,ok) + rules(relevant) + state(v,o,n) + flow 선택
  ACP-BE = intent(g,ok) + rules(all) + state(v,o,a,n) + api + schema 선택

잘못된 사용: "MD→AIMD 변환이 투영이다"
```

MD→AIMD 변환은 **의미 보존적 구조 재구성(lossless semantic restructuring)**이지, 투영이 아닙니다.

### 오해 3: "'서술형 문장 금지 구역'이 의미 제거를 허용한다"

**틀렸습니다.** 서술형 문장 금지 구역은 코어 블록 내의 *서술형 표현 방식*(긴 문장, 모호한 수식어, 수사적 반복)을 금지합니다. 사실을 생략하는 것은 허용되지 않습니다. 소스의 모든 사실은 canonical 라인으로 표현되어야 합니다.

---

## 25. 결론 (Conclusion)

AIMD v1.4는 겉모습은 마크다운처럼 보이지만, 근본적으로는 **AI 에이전트들이 최소한의 토큰 비용과 최소한의 의미적 모호성으로 컨텍스트를 전달할 수 있도록 설계된 정형 메모리 포맷**입니다.
