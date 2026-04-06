# 변경 이력

AIMD의 공개 범위 기준 주요 변경 사항을 이 문서에 기록합니다.

이 변경 이력은 다음을 구분합니다.

- 레거시 공개 스펙
- 공개 AIMD Core v2 초안
- 저장소 차원의 공개 문서 업데이트

---

## [2.0-core-draft] - 2026-04-06

### 공개 포지셔닝 업데이트

- 저장소를 `공개 AIMD Core v2 초안 + 레거시 공개 스펙` 구조로 재정리했습니다.
- `AIMD v1.5` 이하가 공개 레거시 라인임을 명확히 했습니다.
- 상위 AIMD 레이어, 상용 구현, 호스팅 제품은 별도로 진화할 수 있음을 명확히 했습니다.

### 새 공개 코어 스펙

- `spec/en/AIMD-core-v2.md`를 추가했습니다.
- `spec/ko/AIMD-core-v2-ko.md`를 추가했습니다.
- 공개 Core 범위를 아래 최소 요소로 정의했습니다.
  - front matter
  - `:::intent`
  - `:::rules`
  - `:::state`
  - `:::flow`
  - 선택적 `:::diff`

### 문서 정비

- `README.md`, `README-ko.md`를 공개 Core 전략에 맞게 다시 작성했습니다.
- `GUIDE.md`, `GUIDE-ko.md`를 AIMD Core 시작 가이드로 다시 작성했습니다.
- `PHILOSOPHY.md`, `PHILOSOPHY-ko.md`를 프롬프트 중심 작업에서 canonical memory 중심 작업으로의 전환 관점으로 정리했습니다.
- `CONTRIBUTING.md`를 업데이트하고 한국어 기여 안내를 추가했습니다.

---

## [1.5.0] - 2026-03-31

### 주요 스펙 업그레이드

- 라인과 블록 간 명시적 참조를 위한 `ref(id)`를 도입했습니다.
- 선언적 검증을 위한 `:::test`를 추가했습니다.
- `v` 라인의 완료 근거로 `@YYYY-MM-DD`를 추가했습니다.
- `intent`, `rules`, `state`, `flow`의 핵심 line prefix를 표준화했습니다.
- 명시적 금지 결과를 위한 `ban`을 공식화했습니다.

### 생태계 및 툴링

- `aimd-vscode`에서 `ref()`, `@date`, `:::test` 하이라이트를 강화했습니다.
- `aimd-cli` 파서와 생성기를 v1.5 기준으로 업데이트했습니다.
- validator 가이드를 referential integrity와 날짜 검증 기준에 맞게 보강했습니다.

---

## [1.4.0] - 2026-03-29

### 최초 공개 표준

- AIMD를 AI 협업용 canonical memory 포맷으로 공개했습니다.
- 네 개의 core block `:::intent`, `:::rules`, `:::state`, `:::flow`를 정의했습니다.
- stable line ID와 기본 validator 가이드를 도입했습니다.
- 초기 공개 저장소 구조와 툴링 방향을 함께 제시했습니다.
