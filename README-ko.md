# AIMD (AI-Enhanced Markdown) v1.4

[English Version](README.md)

AIMD는 AI 에이전트 간의 **무손실 의도 전달(Lossless Intent Handoff)**과 **정형 시맨틱 메모리(Canonical Semantic Memory)** 관리를 위해 설계된 고성능 마크다운 확장 규격입니다.

이 사양은 인간의 가독성을 유지하면서 동시에 AI 모델이 최저의 토큰 비용으로 최상의 논리적 일관성을 유지할 수 있도록 최적화되었습니다.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![AIMD Spec](https://img.shields.io/badge/AIMD-v1.4--Canonical-orange)](spec/AIMD-v1.4.md)

---

## 🚀 왜 AIMD인가?

전통적인 마크다운이나 자연서술형 문서는 AI 에이전트 파이프라인에서 다음과 같은 고질적인 문제를 야기합니다:
*   **중언부언(Verbosity)**: 불필요한 수식어와 중복된 표현으로 인한 토큰 낭비.
*   **상태 불일치(State Drift)**: 여러 에이전트가 문서를 수정할 때 이전 의도나 제약사항이 유실되는 현상.
*   **파싱 난이도**: 비정형 텍스트에서 핵심 사양과 비즈니스 로직을 추출하는 데 드는 높은 연산 비용.

**AIMD는 이러한 문제를 "시맨틱 투영(Semantic Projection)"과 "정형 라인 메모리(Canonical Line Memory)"를 통해 해결합니다.**

---

## 🛠️ 핵심 저장소 구조

*   [`spec/`](spec/): 핵심 사양 및 가이드라인
    *   [`AIMD-v1.4.md`](spec/AIMD-v1.4.md) / [한국어](spec/AIMD-v1.4-ko.md): AIMD 코어 문법 및 블록 규격.
    *   [`generator-spec.md`](spec/generator-spec.md) / [한국어](spec/generator-spec-ko.md): AI 모델이 AIMD를 생성하기 위한 엔진 사양.
    *   [`generator-prompt.md`](spec/generator-prompt.md) / [한국어](spec/generator-prompt-ko.md): 실전용 시스템 프롬프트 및 마스터 가이드.
*   [`README.md`](README.md) / [한국어](README-ko.md): 프로젝트 메인 가이드.
*   [`.cursorrules`](.cursorrules): AI용 워크스페이스 전역 규칙 파일.
*   [`.agents/workflows/aimd.md`](.agents/workflows/aimd.md): Antigravity 등을 위한 슬래시 명령어 워크플로우.

---

## 🧠 핵심 철학: 시맨틱 앵커 (Semantic Anchors)

AIMD v1.4는 문서를 네 가지 핵심 앵커(Anchors)로 구조화합니다:

1.  **Intent (의도)**: "무엇을(Goal)" 그리고 "어떻게 성공(Success Criteria)"할 것인가.
2.  **Rules (제약)**: "하면 안 되는 것(Ban)"과 "절대 지켜야 하는 것(Required)".
3.  **State (상태)**: "확인된 사실(Verified)", "남은 과제(Open)", "다음 액션(Next)".
4.  **Flow (단계)**: 실행을 위한 구체적인 "단계(Steps)".

---

## 💻 AI 워크스페이스 설정 가이드 (Getting Started)

이 프로젝트의 AIMD v1.4 규격을 자신의 실무 프로젝트에 즉시 적용하려면 다음 인프라 파일들을 자신의 프로젝트 루트(Root)로 복사하십시오:

### 1단계: 전역 규칙 활성화 (`.cursorrules`)
프로젝트 루트에 `.cursorrules` 파일을 배치하면, Cursor나 Copilot 같은 AI가 자동으로 AIMD v1.4 규격을 준수합니다.

### 2단계: 슬래시 명령어 활성화 (`.agents/workflows/aimd.md`)
Antigravity와 같은 도구에서 `/aimd` 명령어를 통해 언제든지 규격 요약과 지침을 불러올 수 있습니다.

### 3단계: 상세 사양 참조 (`spec/` 폴더)
AI가 특정 문법이나 접두사(Prefix) 규칙이 궁금할 때 `spec/` 폴더의 명세서를 참고하도록 하십시오.

---

## 📜 라이선스 및 저작권

Copyright © 2026 Hwehsoo Kim (Goldloom). All rights reserved.

본 프로젝트는 **Apache License 2.0**에 따라 라이선스가 부여됩니다. 상업적 이용, 수정 및 배포가 자유롭지만 저작권 고지 및 라이선스 사본 포함 의무를 준수해야 합니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하십시오.

---

AIMD v1.4는 현재 제안된 사양 단계입니다. 구현 및 피드백을 언제든지 환영합니다.
