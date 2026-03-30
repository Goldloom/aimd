# AIMD (AI-Enhanced Markdown) v1.5

**부제: 멀티 에이전트 핸드오프를 위한 정형 시맨틱 메모리 (Canonical Semantic Memory for Multi-Agent Handoff)**

---

## 1. 문서 상태 (Document Status)

```text
버전: v1.5
상태: 제안된 규격 (Proposed Spec)
목표: AI 시맨틱 호환성 극대화 + 토큰 비용 최소화
범위: 포맷, 핸드오프 프로토콜, 검증 도구 기준
```

이 문서는 AIMD v1.5의 공식 사양 초안입니다.

---

## 2. 설계 목표 (Design Goals)

v1.5는 다음 두 가지 축을 동시에 최적화합니다:

1. **AI 시맨틱 호환성 극대화**: AI 에이전트가 정보를 오해 없이 정확하게 해석하게 함
2. **토큰 비용 최소화**: 전달되는 정보량을 압축하여 운영 비용 절감

v1.5는 `인간이 읽기 좋은 문서 포맷`보다 **`무손실 핸드오프를 위한 정형 메모리 포맷`**을 최우선 순위에 둡니다.

v1.5는 v1.4 대비 다음 세 가지를 목표 지향적으로 개선합니다:

1. 라인 간 의존성을 표현하는 공식 크로스 레퍼런스 구문 추가
2. `:::test` 블록의 완전한 명세 정의
3. `v` 접두사의 의미 명확화 및 경량 시간 어노테이션 추가

---

## 3. 공식 정의 (Formal Definition)

```text
AIMD v1.5 = AI 공유용 정형 시맨틱 메모리 + 선택적인 인간용 렌더링 레이어
```

v1.5에서 기본 신뢰 원천(Source of Truth)은 서술형 문장(Prose)이 아니라 **정형화된 라인 세트(Canonical Line Set)**입니다.

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
P7. 검증 가능한 참조 (verifiable references)  ← v1.5 신규
```

- **canonical first**: 정형 레이어가 기본 공유 문서가 됩니다.
- **prose optional**: 인간을 위한 설명 레이어는 선택 사항입니다.
- **one fact, one location**: 각 사실은 정확히 한 곳에만 기록됩니다.
- **projection handoff**: 핸드오프는 내용을 다시 쓰는 것이 아니라 필요한 라인을 선택하는 방식입니다.
- **stable line ids**: 모든 의미 단위는 고유하고 안정적인 ID를 가집니다.
- **compression validated**: 품질 기준에 정확성뿐만 아니라 비용 효율성이 포함됩니다.
- **verifiable references**: 라인 간 크로스 레퍼런스는 검증기가 확인할 수 있어야 합니다(MUST).

---

## 6. 정보 레이어 (Information Layers)

```text
Layer 0: 소스 의도 (Source Intent)
Layer 1: 정형 레이어 (Canonical Layer)
Layer 2: 선택적 렌더 레이어 (Optional Render Layer)
Layer 3: ACP 투영 레이어 (ACP Projection Layer)
Layer 4: 검증 레이어 (Validation Layer)
```

각 레이어의 역할은 v1.4와 동일하며, Layer 4에 레퍼런스 무결성 검사가 추가됩니다.

---

## 7. 파일 규격 (File Specification)

### 7.1 확장자 및 인코딩

```yaml
extension: .aimd
encoding:  UTF-8
compat:    CommonMark (Markdown) 상위 호환
```

### 7.2 프론트 매터 (Front Matter)

v1.5 문서는 최소한의 프론트 매터를 사용해야 합니다(SHOULD).

```yaml
---
aimd: "1.5"
src: md
id: payment-retry
rev: 4
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

이 순서는 목적 → 제약 → 상태 → 흐름 순으로 정보를 배치하여 핸드오프 해석 비용을 최소화합니다.

---

## 9. 핵심 블록 세트 (Core Block Set)

### 9.1 필수 핵심 블록
- `:::intent`, `:::rules`, `:::state`, `:::flow`

### 9.2 선택적 블록
- `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`, `:::diff`

### 9.3 제거되거나 흡수된 개념 (v1.4 이후 변경 없음)
- `:::ai` → `:::state`로 흡수
- `:::deps` → `:::flow` 또는 `:::ref`로 흡수
- `:::abbr` → 전역 사전 또는 외부 문서로 이동

---

## 10. 정형 라인 구문 (Canonical Line Syntax)

### 10.1 기본 형식

모든 핵심 블록의 라인은 다음 형식을 따라야 합니다(SHOULD):

```text
<line-id>: <payload>
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

**금지 사항(SHOULD NOT):** 긴 서술형 문장, 의미가 중복되는 반복적 표현, 모호한 수식어 사용

### 10.4 크로스 레퍼런스 구문 (Cross-Reference Syntax)  ← v1.5 신규

페이로드에 `ref()` 표기를 사용하여 다른 라인 ID를 참조할 수 있습니다(MAY):

```text
<line-id>: <payload> ref(<id>[, <id>...])
```

**예시:**

```text
n1: connect_auth_layer ref(v4, r2)
n2: qa_validate_retry ref(v1, o1)
s3: validate_idempotency ref(r1)
```

`ref()`는 해당 라인이 나열된 ID에 의존하거나 직접적으로 연관되어 있음을 표현합니다.

검증기는 `ref()` 내의 모든 ID가 문서 내에 존재하는지 반드시 확인해야 합니다(MUST). 존재하지 않는 ID를 참조하는 것은 의미 오류(Semantic Error)입니다.

`ref()`는 항상 페이로드 끝에 위치하며, 유효한 라인 ID만 포함해야 합니다(MUST NOT 산문 사용).

### 10.5 시간 어노테이션 (Temporal Annotation)  ← v1.5 신규

`:::state`의 `v` 접두사 라인에는 해당 항목이 검증/완료된 날짜를 기록하기 위해 `@YYYY-MM-DD` 어노테이션을 추가할 수 있습니다(MAY):

```text
v3: auth_setup_done @2026-03-30
v7: snapshot_versioning_implemented @2026-03-31
```

정형 페이로드는 `@` 이전의 모든 내용입니다. `@date`는 비의미적 메타데이터이며, 페이로드 사실의 일부로 취급해서는 안 됩니다(MUST NOT).

검증기는 `v` 라인의 `@YYYY-MM-DD`를 유효한 메타데이터로 허용해야 합니다(SHOULD).

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
- 접두사: `v` (검증됨/완료됨), `o` (open), `a` (assumption), `n` (next), `ask` (human confirmation)

**`v` 접두사 명확화 (v1.5 신규):**

`v`는 다음 두 가지 해석을 모두 포괄합니다:
- **검증된 사실**: 참으로 확인된 것 ("X가 사실임을 확인함")
- **완료된 마일스톤**: 수행이 완료된 것 ("X를 완료함")

두 해석 모두 `:::state`에서 유효합니다. "이것이 사실이다"와 "이것이 완료되었다"의 의미적 구분은 핸드오프 목적상 의도적으로 통합됩니다. 두 경우 모두 더 이상의 조치가 필요 없는 항목이기 때문입니다. 완료 시점을 기록하려면 `@date` 어노테이션을 사용하십시오.

**예시:**

```markdown
:::state
v1: billing_billingkey_cycle_done @2026-02-10
v2: pdf_editor_split_done @2026-03-01
o1: direct_supabase_phase4_pending
a1: anthropic_optional_for_gateway
n1: connect_app_specific_tools ref(v1, v2)
:::
```

### 11.4 `:::flow`
실행 순서를 담습니다.
- 접두사: `s` (step)

---

## 12. 선택적 블록 명세

### 12.1 `:::schema`
데이터 구조가 핸드오프에 직접적으로 필요할 때만 사용.

### 12.2 `:::api`
API 계약이 핸드오프에 직접적으로 필요할 때만 사용.

### 12.3 `:::test`  ← v1.5에서 완전히 명세됨

선언적 검증 기준이 핸드오프의 일부가 되어야 할 때 사용합니다(MAY).

**목적:** `:::test`는 `:::state`의 항목이 `v`(검증됨/완료됨)에 도달했을 때 반드시 참이어야 하는 조건을 기록합니다. 이것은 선언적 어서션 레이어이며 실행 스크립트가 아닙니다.

**허용 접두사:**
- `t`: 테스트 어서션

**구문:**

```text
t<N>: <state-id>=<status> -> <assertion>
```

또는 규칙 검사의 경우:

```text
t<N>: <rule-id> -> <assertion>
```

**어서션 형식:**

어서션은 반드시 선언적 기호 표현식이어야 합니다(MUST). 셸 명령어, 명령형 코드, OS 종속 구문을 포함해서는 안 됩니다(MUST NOT).

**권장 어서션 어휘:**

```text
file(path)               — 해당 경로에 파일이 존재해야 함
route(METHOD path)       — HTTP 라우트가 등록되어 있어야 함
no_table(name)           — DB 테이블이 존재하지 않아야 함
env(KEY)                 — 환경변수가 정의되어 있어야 함
schema_field(table.col)  — DB 컬럼이 존재해야 함
```

표준 어휘가 불충분한 경우 커스텀 기호 어서션을 사용할 수 있습니다(MAY):

```text
t5: ban1 -> no_raw_source_in_payload
```

**예시:**

```markdown
:::test
t1: v6=verified -> file(src/lib/snapshot.ts)
t2: n1=completed -> route(POST /api/v1/sync/github)
t3: ban1 -> no_table(raw_source)
t4: v3=verified -> env(DATABASE_URL)
:::
```

**규칙:**
- 각 `t` 라인은 반드시 `:::state` 또는 `:::rules`의 유효한 라인 ID를 참조해야 합니다(MUST).
- 검증기는 `:::test` 어서션을 통합 테스트 생성의 기반으로 활용할 수 있습니다(MAY).
- `:::test`는 다른 블록의 정형 사실을 덮어써서는 안 됩니다(MUST NOT).

### 12.4 `:::ref`
핸드오프에 필수적인 외부 파일, 문서, 코드 참조만 포함해야 합니다(SHOULD).

### 12.5 `:::human`
인간 리뷰어를 위한 설명이 필요할 때 사용합니다. 정형 데이터를 덮어써서는 안 됩니다(MUST NOT).

### 12.6 `:::diff`
개정 변경 요약이 필요할 때만 사용합니다(MAY).

---

## 13. 서술형 문장 금지 구역 (Prose-Free Zone)

v1.5의 핵심 규칙: **핵심 블록 내부에서는 서술형 문장(Free Prose)을 금지합니다.**

**허용 사항:**
- 정규화된 짧은 표현
- `key=value` 또는 `subject->result`
- `ref(<id>...)` 크로스 레퍼런스
- `v` 라인의 `@YYYY-MM-DD` 시간 어노테이션
- 열거형 리터럴

**금지 사항:**
- 긴 설명 문장
- 동의어 반복
- "참고로", "중요한 것은", "다시 말해" 같은 보조 산문

---

## 14. 일사 일처 (One Fact, One Location)

동일한 사실은 오직 한 곳에만 존재해야 합니다(MUST). 다른 블록에서 참조가 필요한 경우 라인 ID를 사용하십시오:

```text
n1: implement_after ref(r2, v3)
```

---

## 15. 통제된 어휘 (Controlled Vocabulary)

정형 레이어는 통제된 어휘를 사용해야 합니다(SHOULD). 동일한 의미에 대해 중복된 표현을 사용하지 마십시오.

---

## 16. ACP 명세 (ACP Specification)

### 16.1 정의
`ACP = 정형 AIMD로부터 역할별 라인 투영(Projection)`

### 16.2 규칙
ACP 추출기는 다음을 수행해야 합니다(SHOULD):
- 의역 최소화
- 라인 ID 보존
- 블록 순서 보존
- **포함된 라인이 `ref()`를 가진 경우, 참조된 라인도 해당 역할에 적합하면 함께 포함** ← v1.5 신규

### 16.3 예시

```text
ACP-BE = intent(g,ok) + rules(all) + state(v,o,a,n) + api + schema
ACP-FE = intent(g,ok) + rules(relevant) + state(v,o,n) + flow
ACP-QA = intent(ok) + rules(all) + state(v,o,a) + test
```

---

## 17. 델타 업데이트 명세 (Delta Update Specification)

v1.5는 전체 재작성보다 델타 업데이트(`add`, `drop`, `set`)를 우선시해야 합니다(SHOULD).

```text
add: o2=startupmate_timeout_guard
drop: a1
set: v3=chat_runtime_nodejs @2026-03-31
```

---

## 18. 검증기 요구사항 (Validator Requirements)

### 18.1 구문 검증기 (Syntax Validator)
다음을 확인합니다:
- 필수 프론트 매터 필드
- 허용된 블록만 사용
- 블록 순서
- 라인 ID 형식
- 중복 라인 ID
- **`v` 라인의 `@date` 형식 (`@YYYY-MM-DD`)** ← v1.5 신규
- **`ref()` 구문 적합성 (괄호 내 유효한 콤마 구분 ID)** ← v1.5 신규

### 18.2 의미 검증기 (Semantic Validator)
다음을 확인합니다:
- 필수 핵심 블록 존재 여부
- verified/open/assumption/next 구분
- 동결 계약 무결성
- 일사 일처 원칙 준수
- ACP 투영 가능성
- **크로스 레퍼런스 무결성: `ref()` 내의 모든 ID가 문서에 존재해야 함(MUST)** ← v1.5 신규
- **`:::test` 라인 ID가 유효한 `:::state` 또는 `:::rules` ID를 참조하는지 확인** ← v1.5 신규

### 18.3 압축 검증기 (Compression Validator)
다음을 확인합니다:
- 핵심 블록 산문 비율
- 중복 의미 비율
- 긴 레이블 사용률
- 선택적 블록 남용
- ACP 평균 토큰 길이

---

## 19. 제너레이터 요구사항 (Generator Requirements)

v1.5 제너레이터는 다음을 수행해야 합니다(SHOULD):
1. 소스 의도 추출
2. 정형 사실 정규화
3. 안정적인 라인 ID 할당
4. 코어 블록 우선 생성
5. `mode: c`를 기본값으로 출력
6. ACP를 투영(Projection)으로 추출
7. **소스에서 명시적 의존 관계가 확인된 경우 `ref()` 어노테이션 추가** ← v1.5 신규
8. **소스에 완료 날짜가 있는 경우 `v` 라인에 `@date` 추가** ← v1.5 신규

---

## 20. 준수 예시 (Conformant Example)

```markdown
---
aimd: "1.5"
src: md
id: payment-retry
rev: 4
mode: c
---

:::intent
g1: payment_retry_without_double_charge
ok1: max_retry=3
ok2: duplicate_charge=forbidden
:::

:::rules
r1: idempotency=required
ban1: duplicate_charge
fz1: api_error_contract
:::

:::state
v1: retry_409_on_processed @2026-03-01
o1: rollback_regression_check
n1: qa_validate_concurrent_retry ref(v1, r1)
:::

:::flow
s1: fail_payment
s2: show_retry
s3: validate_idempotency ref(r1)
s4: return_existing_or_new_result
:::

:::test
t1: v1=verified -> route(POST /api/payment/retry)
t2: ban1 -> no_table(duplicate_charge_log)
t3: n1=completed -> file(tests/retry-concurrent.test.ts)
:::
```

---

## 21. 비준수 예시 (Non-Conformant Example)

서술형 문장으로 가득 찬 `:::state` 블록은 v1.5 규격 미달입니다.

다음 `ref()` 사용 또한 비준수입니다:

```markdown
:::state
n1: connect_auth_layer ref(v99)
:::
```

이유: `v99`가 문서에 존재하지 않습니다. 크로스 레퍼런스 무결성 위반.

---

## 22. v1.4 대비 변경 사항

```text
v1.4 중점: 정형 시맨틱 메모리
v1.5 중점: 검증 가능한 정형 시맨틱 메모리
```

**주요 변경:**

1. **P7 추가**: `verifiable references` — 검증 가능한 참조를 핵심 원칙으로 추가
2. **§10.4 추가**: 공식 크로스 레퍼런스 구문 `ref(<id>...)` 명세
3. **§10.5 추가**: `v` 라인의 시간 어노테이션 `@YYYY-MM-DD` 명세
4. **§11.3 업데이트**: `v` 접두사가 "검증된 사실"과 "완료된 마일스톤" 모두를 명시적으로 포괄함을 명확화
5. **§12.3 완전 명세**: `:::test` 블록의 접두사, 구문, 어서션 어휘 완전 정의
6. **§16.2 업데이트**: ACP 추출기가 `ref()` 연결 라인도 포함해야 함(SHOULD)
7. **§18.1 업데이트**: 구문 검증기의 `@date` 형식 및 `ref()` 적합성 검사 추가
8. **§18.2 업데이트**: 의미 검증기의 크로스 레퍼런스 무결성 검사 MUST 추가
9. **§19 업데이트**: 제너레이터의 `ref()` 및 `@date` 생성 지침 추가

---

## 23. 적합성 목표 (Conformance Goals)

v1.5는 다음 수치를 목표로 합니다:
- 시맨틱 호환성: 95점 이상
- 토큰 효율성: 95점 이상

---

## 24. 흔한 오해 (Common Misconceptions)

### 오해 1: "MD→AIMD 변환은 의도적 손실 압축이다"
**틀렸습니다.** MD→AIMD 변환은 반드시 의미 손실이 없어야 합니다. 압축 대상은 표현 형식이며, 의미는 100% 보존되어야 합니다.

### 오해 2: "'투영(Projection)'이 변환 방식을 설명한다"
**틀렸습니다.** "투영"은 오직 ACP에만 해당합니다. MD→AIMD 변환은 의미 보존적 구조 재구성입니다.

### 오해 3: "'서술형 문장 금지 구역'이 의미 제거를 허용한다"
**틀렸습니다.** 서술형 표현 방식을 금지하는 것이지, 사실 생략을 허용하지 않습니다.

### 오해 4: "`ref()`는 관련된 모든 라인에 필수이다"  ← v1.5 신규
**틀렸습니다.** `ref()`는 소스에 명시적으로 표현된 의존성이 있을 때만 사용해야 합니다(SHOULD). 느슨한 주제적 연관성에는 추가하지 마십시오. `ref()` 남용은 압축 원칙을 위반합니다.

### 오해 5: "`v` 접두사는 오직 '검증된 사실'만을 의미한다"  ← v1.5 신규
**틀렸습니다.** v1.5에서 `v`는 검증된 사실과 완료된 마일스톤을 모두 포괄합니다. "더 이상의 조치가 필요 없는 항목"이라는 것이 `v`의 의도입니다. 완료 시점이 필요하면 `@date`를 사용하십시오.

---

## 25. 결론 (Conclusion)

AIMD v1.5는 겉모습은 마크다운처럼 보이지만, 근본적으로는 AI 에이전트들이 최소한의 토큰 비용과 최소한의 의미적 모호성으로 컨텍스트를 전달할 수 있도록 설계된 정형 메모리 포맷입니다. v1.5는 검증 가능한 크로스 레퍼런스와 선언적 테스트 어서션을 추가하여, AIMD를 "구조화된 자연어"에서 **"검증 가능한 명세"**로 한 발짝 더 나아가게 합니다.
