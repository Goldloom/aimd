# AIMD 실전 가이드

프로젝트를 시작할 때 AIMD를 어떻게 쓰는지 정리한 실전 문서입니다.

[English Guide](GUIDE.md)

---

## 목적

이 가이드는 아래 흐름을 설명합니다.

1. 프로젝트를 prose로 한 번 정의한다
2. 그것을 AIMD Core로 변환한다
3. AI 에이전트가 반복 프롬프트 대신 canonical memory를 읽고 일하게 한다

---

## 권장 시작점

지금 AIMD를 도입한다면:

- [AIMD Core v2 초안](spec/ko/AIMD-core-v2-ko.md)부터 읽고
- v1.5는 레거시 참고 문서로 보고
- 처음에는 Core만 사용하고
- 필요가 분명할 때만 상위 레이어를 추가하는 것이 좋습니다

---

## Day Zero 워크플로

### 1. Intent 작성

먼저 `:::intent`를 작성합니다.
목표, 성공 기준, 포함 범위, 제외 범위를 기록합니다.

### 2. Constraints 고정

`:::rules`에서 아래를 정의합니다.

- 반드시 지켜야 할 것
- 금지할 것
- 이미 고정된 결정

### 3. 현재 상태 기록

`:::state`에서 아래를 기록합니다.

- 검증된 사실
- 열린 이슈
- 가정
- 다음 액션

### 4. 실행 순서 정의

`:::flow`에서 단계와 순서를 표현합니다.

### 5. Handoff 전 정규화

다른 AI에게 넘기기 전에:

- `g+` 같은 draft 전용 ID를 확장하고
- block 순서를 canonical하게 맞추고
- core block 안의 불필요한 prose를 제거하고
- `ref()`를 검증합니다

---

## 좋은 AIMD 습관

- 한 사실은 한 곳에만 둡니다.
- prose보다 symbolic payload를 선호합니다.
- 맥락 반복 대신 `ref()`를 씁니다.
- AIMD를 설명문이 아니라 canonical memory로 취급합니다.

---

## 최소 팀 워크플로

```text
사람이 프로젝트 intent를 정의한다
AI가 AIMD Core를 작성한다
validator가 구조를 검사한다
코딩 에이전트가 AIMD Core를 읽는다
다음 에이전트가 업데이트된 AIMD에서 이어받는다
```

---

## 다음 읽을 문서

- [README](README-ko.md)
- [AIMD Core v2 초안](spec/ko/AIMD-core-v2-ko.md)
- [AIMD v1.5 레거시 스펙](spec/ko/AIMD-v1.5-ko.md)

---

SPDX-License-Identifier: Apache-2.0
