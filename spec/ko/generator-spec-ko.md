# AIMD v1.4 제너레이터 규격 (Generator Specification)

---

## 1. 목적 (Purpose)

이 문서는 `AIMD v1.4` 문서를 생성하거나 업데이트하는 제너레이터(LDM 기반 에이전트 등)를 위한 공식 규격입니다.

제너레이터의 핵심 목적은 아름다운 문서를 쓰는 것이 아니라 다음을 달성하는 것입니다:

1. 소스 의도를 정형화된 라인 세트(Canonical Line Set)로 정규화
2. 일사 일처(One fact, one location) 원칙 유지
3. 안정적인 라인 ID(Stable Line IDs) 부여
4. ACP 투영(Projection) 친화적 구조 구축
5. 토큰 비용이 낮은 v1.4 문서 생성

---

## 2. 입력 및 출력 (Inputs and Outputs)

### 입력 (Inputs)
- 일반 프롬프트 (Plain prompt)
- 일반 마크다운 (Plain Markdown)
- 기존 `.aimd` 파일
- 기존 `.aimd` + 추가 요구사항
- 필요에 따른 참조 문서들

### 출력 (Outputs)
- `mode: c` (정형 데이터 전용) AIMD
- 선택적으로 `mode: cr` (정형 + 렌더 레이어) AIMD
- 필요 시 ACP 투영 번들

기본 출력은 반드시 **`mode: c`**여야 합니다(MUST).

---

## 3. 제너레이터 파이프라인 (Generator Position)

v1.4 제너레이터는 다음 파이프라인의 핵심 구성 요소입니다:

```text
소스 입력
  -> 입력 정규화기
  -> 사실 추출기
  -> 정형 계획기
  -> 라인 정규화기
  -> AIMD 제너레이터
  -> 구문 검증기
  -> 의미 검증기
  -> 압축 검증기
  -> 수정 루프
  -> 최종 AIMD
```

---

## 4. 제너레이션 핵심 원칙 (Core Generation Principles)

### 4.1 정형 데이터 우선 (Canonical First)
제너레이터는 서술형 문장(Prose)보다 정형 데이터(Canonical)를 먼저 생성해야 합니다(MUST).

### 4.2 최소 블록 구성 (Minimal Blocks)
제너레이터는 필수 핵심 블록 생성을 최우선으로 합니다(MUST).

### 4.3 최소 단어 사용 (Minimal Words)
제너레이터는 가능한 한 정규화된 표현을 사용해야 합니다(SHOULD).

### 4.4 안정적 ID 유지 (Stable IDs)
제너레이터는 개정 시에도 기존 라인 ID를 안정적으로 유지해야 합니다(MUST).

### 4.5 무단 왜곡 금지 (No Silent Invention)
제너레이터는 소스에 없는 사실을 '확인된 사실'로 기재해서는 안 됩니다(MUST NOT).

---

## 5. 필수 제너레이션 단계 (Required Generation Steps)

### 1단계: 입력 정규화 (Input Normalization)
입력 소스의 유형(Prompt, MD, AIMD, Hybrid 등)을 분류하고 구조를 파악합니다.

### 2단계: 소스 사실 추출 (Source Fact Extraction)
소스에서 다음 사실 유형을 추출합니다: 목표, 성공 기준, 규칙, 금지 사항, 동결 후보, 확인된 사실, 미결 이슈, 가정, 다음 액션, 실행 흐름 등.

### 3단계: 정형 계획 (Canonical Planning)
추출된 각 사실을 적절한 블록(`intent`, `rules`, `state`, `flow`)에 배치할지 결정합니다.

### 4단계: 라인 정규화 (Line Normalization)
각 사실을 정형화된 페이로드 형식으로 변환합니다 (`key=value` 또는 `subject->result` 등).

### 5단계: 라인 ID 할당 (Line ID Assignment)
각 블록별 접두사(`g`, `ok`, `in`, `out`, `r`, `ban`, `fz`, `v`, `o`, `a`, `n`, `ask`, `s`)를 부여하고 기존 ID를 최대한 재사용합니다.

### 6단계: 선택적 블록 결정 (Optional Block Decision)
`schema`, `api`, `test`, `ref`, `human`, `diff` 등 핸드오프에 직접적으로 필요한 경우에만 선택적 블록을 추가합니다.

### 7단계: 검증 루프 (Validator Loop)
구문, 의미, 압축 검증을 순서대로 수행하고 실패 시 수정을 진행합니다.

---

## 6. 필수 제너레이터 행동 수칙 (Required Behavior)

권장 사항 (SHOULD):
1. 기본 출력 모드를 `mode: c`로 설정하십시오.
2. `:::intent`, `:::rules`, `:::state`, `:::flow`를 항상 먼저 생성하십시오.
3. 동일한 사실을 여러 블록에 중복 기록하지 마십시오.
4. 소스에 없는 정보는 `a*` (가정) 또는 `o*` (미결)로만 기록하십시오.
5. 투영 친화적인 구조로 작성하십시오.

금지 사항 (MUST NOT):
1. 소스에 근거가 없는 '확정적 시나리오'를 지어내지 마십시오.
2. 핵심 규칙을 `:::human` 블록에만 보관하지 마십시오.
3. 선택적 블록을 남용하지 마십시오.
4. 텍스트 비중이 높은 코어 블록을 생성하지 마십시오.

---

## 7. 블록별 생성 규칙 (Per-Block Rules)

각 블록은 최소한의 라인 구성을 포함해야 합니다:
- `:::intent`: 최소 한 개의 `g1` 포함.
- `:::rules`: 최소 한 개의 `r*` 또는 `ban*` 포함.
- `:::state`: 최소 한 개의 `v*` 또는 `o*` 포함 권장.
- `:::flow`: 매우 단순한 흐름이라도 최소 1개 단계로 정문화 필수.

---

## 8. 리비전 업데이트 규칙 (Revision Update Rules)

기존 `.aimd` 파일이 있을 경우, 제너레이터는 다음 우선순위를 따라야 합니다:
1. 기존 라인 ID 재사용
2. 기존 정형 레이어 보존
3. 필요한 `add/drop/set` 변경사항만 적용
4. 선택적 블록 수정 최소화

완전 재작성은 소스 구조가 근본적으로 바뀌었을 경우에만 한정적으로 허용됩니다.

---

## 9. 소스별 제너레이션 정책 (Per-Source Policy)

### 9.1 프롬프트 → AIMD: 불확실성을 `a*` 또는 `o*`로 철저히 분리.
### 9.2 마크다운 → AIMD: 헤더/리스트/표를 정형 사실로 보존 및 수치/기한 추출에 집중.
### 9.3 AIMD → AIMD 업데이트: 안정적인 ID 보존을 최우선으로 하여 새로운 변경사항만 반영.

---

## 10. ACP 생성 규칙 (ACP Generation Rules)

제너레이터는 투영(Projection)을 통해 ACP를 생성해야 하며, 역할을 재해석하여 새로 쓰는 행위를 금지합니다.

---

## 11. 점수 측정 목표 (Scoring Targets)

- **Syntax Pass**: 필수 조건
- **시맨틱/압축 점수**: 최소 85점 이상 추천

---

## 12. 흔한 실패 패턴 (Common Failure Patterns)

1. 코어 블록을 서술형 문장으로 쓰는 행위
2. 진행 상태를 Rules 블록에 넣는 행위
3. 동일 사실을 Rules와 State 양쪽에 중복 기재
4. `:::human` 블록이 지나치게 긴 경우
5. 정형 파일 개정 시 기존 라인 ID를 무단으로 변경

---

## 13. 결론 (Conclusion)

AIMD v1.4 제너레이터는 모델의 글쓰기 능력을 보는 엔진이 아닙니다. 소스를 **라인 기반의 정형 시맨틱 메모리**로 정문화하고, 의미 손실 없이 그 메모리를 **최소한의 비용으로 핸드오프**할 수 있게 만드는 엔진입니다.
