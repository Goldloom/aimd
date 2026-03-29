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

기본 출력은 반드시 **`mode: c`**여야 합니다.

---

## 3. 제너레이션 핵심 원칙 (Core Generation Principles)

### 3.1 정형 데이터 우선 (Canonical First)
제너레이터는 서술형 문장(Prose)보다 정형 데이터(Canonical)를 먼저 생성해야 합니다.

### 3.2 최소 블록 구성 (Minimal Blocks)
제너레이터는 필수 핵심 블록(`intent`, `rules`, `state`, `flow`) 생성을 최우선으로 합니다.

### 3.3 최소 단어 사용 (Minimal Words)
제너레이터는 가능한 한 정규화된 짧은 표현을 사용해야 합니다.

### 3.4 안정적 ID 유지 (Stable IDs)
제너레이터는 개정 시에도 기존 라인 ID를 최대한 안정적으로 유지해야 합니다.

### 3.5 무단 왜곡 금지 (No Silent Invention)
제너레이터는 소스에 없는 사실을 '확인된 사실(v)'로 임의로 추가해서는 안 됩니다.

---

## 4. 필수 제너레이션 단계 (Required Generation Steps)

### 1단계: 입력 정규화 (Input Normalization)
입력 소스의 유형(Prompt, MD, AIMD 등)을 분류하고 구조를 파악합니다.

### 2단계: 소스 사실 추출 (Source Fact Extraction)
목표, 성공 기준, 규칙, 금지 사항, 확인된 사실, 미결 과제, 가정, 다음 액션, 실행 흐름 등을 추출합니다.

### 3단계: 정형 계획 (Canonical Planning)
추출된 각 사실을 어떤 블록(`intent`, `rules`, `state`, `flow`)에 배치할지 결정합니다.

### 4단계: 라인 정규화 (Line Normalization)
각 사실을 정형화된 페이로드(Payload) 형식으로 변환합니다. (`key=value` 또는 `subject->result` 선호)

### 5단계: 라인 ID 할당 (Line ID Assignment)
각 블록에 맞는 고유 접두사(`g`, `r`, `v`, `s` 등)를 사용하여 ID를 부여합니다. 기존 문서가 있다면 기존 ID를 재사용합니다.

### 6단계: 선택적 블록 결정 (Optional Block Decision)
`schema`, `api`, `test`, `ref` 등 핸드오프에 직접적으로 필요한 경우에만 선택적 블록을 추가합니다.

### 7단계: 검증 루프 (Validator Loop)
구문(Syntax), 의미(Semantic), 압축(Compression) 검증을 차례로 수행하고 실패 시 수정합니다.

---

## 5. 소스별 제너레이션 정책 (Per-Source Policy)

### 5.1 프롬프트 → AIMD
- 소스 정보가 최소화되어 있으므로, 불확실한 내용은 반드시 `a*` (Assumption)나 `o*` (Open)로 남겨둡니다.

### 5.2 마크다운 → AIMD
- 소스의 구조적 신호(헤더, 리스트, 표 등)를 보존하여 정형 데이터로 변환합니다. 숫자, 날짜, 제약 사항 추출에 집중합니다.

### 5.3 AIMD → AIMD 업데이트
- **안정적인 ID 보존**이 가장 중요합니다. 새로운 변경 사항만 반영하고, 불필요한 전체 재작성을 피합니다.

---

## 6. 결론 (Conclusion)

AIMD v1.4 제너레이터는 좋은 문서를 쓰는 모델이 아닙니다. 소스를 **라인 기반의 정형 시맨틱 메모리**로 정문화하고, 의미 손실 없이 그 메모리를 **최소한의 비용으로 핸드오프**할 수 있게 만드는 엔진입니다.
