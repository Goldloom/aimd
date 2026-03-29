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

1. **AI 시맨틱 호환성 극대화**: AI가 정보를 오해 없이 정확하게 해석하게 함
2. **토큰 비용 최소화**: 전달되는 정보량을 압축하여 운영 비용 절감

v1.4는 `인간이 읽기 좋은 문서 포맷`보다 **`무손실 핸드오프를 위한 정형 메모리 포맷`**을 우선시합니다.

---

## 3. 공식 정의 (Formal Definition)

```text
AIMD v1.4 = AI 공유용 정형 시맨틱 메모리 + 선택적인 인간용 렌더링 레이어
```

v1.4에서 기본 신뢰 원천(Source of Truth)은 서술형 문장이 아니라 **정형화된 라인 세트(Canonical Line Set)**입니다.

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

---

## 7. 파일 규격 (File Specification)

### 7.1 확장자 및 인코딩

```yaml
extension: .aimd
encoding:  UTF-8
compat:    CommonMark (Markdown) 상위 호환
```

### 7.2 프론트 매터 (Front Matter)

v1.4 문서는 최소한의 프론트 매터를 사용해야 합니다.

```yaml
---
aimd: "1.4"
src: md
id: payment-retry
rev: 3
mode: c
---
```

---

## 8. 문서 블록 순서 (Document Block Order)

정형 문서는 다음 순서를 따르는 것을 권장합니다:

1. 프론트 매터 (Front Matter)
2. `:::intent` (목적)
3. `:::rules` (제약 사항)
4. `:::state` (현재 상태)
5. `:::flow` (실행 흐름)
6. [기타 선택적 블록]

---

## 9. 핵심 블록 세트 (Core Block Set)

### 9.1 필수 핵심 블록
- `:::intent`: 목표 및 성공 기준 (`g`, `ok`, `in`, `out`)
- `:::rules`: 제약 사항, 금지 사항, 동결 사항 (`r`, `ban`, `fz`)
- `:::state`: 확인된 사실, 당면 과제, 가정, 다음 액션 (`v`, `o`, `a`, `n`, `ask`)
- `:::flow`: 실행 순서 (`s`)

### 9.2 선택적 블록
- `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`, `:::diff`

---

## 10. 정형 라인 구문 (Canonical Line Syntax)

모든 핵심 블록의 라인은 다음 형식을 따라야 합니다:

```text
<line-id>: <payload>
```

**예시:**
- `g1: single_domain_platform`
- `r1: nextjs=single_app`
- `v1: billing_logic_v3_done`

---

## 11. 서술형 문장 금지 (Prose-Free Zone)

v1.4의 핵심 규칙:
**핵심 블록 내부에서는 자유 서술형 문장(Free prose)을 금지합니다.**

- **허용됨**: 짧은 심볼릭 표현, 정규화된 구문, `key=value`, `subject->result`
- **금지됨**: 긴 설명, 가독성을 위한 수식어, "참고로", "중요하게도" 등의 부사구

---

## 12. 델타 업데이트 (Delta Update)

멀티 에이전트 환경에서 전체 문서를 매번 다시 쓰는 것은 비효율적입니다. v1.4는 델타 업데이트를 우선시합니다.

```text
add: o2=startupmate_timeout_guard
drop: a1
set: v3=chat_runtime_nodejs
```

---

## 13. 결론 (Conclusion)

AIMD v1.4는 겉모습은 Markdown처럼 보이지만, 근본적으로는 **AI 에이전트들이 최소한의 토큰 비용과 최소한의 의미적 모호성으로 컨텍스트를 전달할 수 있도록 설계된 정형 메모리 포맷**입니다.
