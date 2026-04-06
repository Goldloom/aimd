# AIMD 철학

프롬프트에서 canonical memory로.

[English Philosophy](PHILOSOPHY.md)

---

## 문제

일반적인 프롬프트 중심 워크플로는 쉽게 흔들립니다.

- 맥락을 계속 반복해야 하고
- 제약이 자주 사라지고
- 세션이 바뀌면 intent가 흔들리고
- 에이전트가 많아질수록 handoff 품질이 급격히 나빠집니다

이건 단순한 UX 문제가 아니라 메모리 포맷의 문제입니다.

---

## 전환

AIMD는 프로젝트 메모리를 구조화된 아티팩트로 다룹니다.

예전에는:

> X를 만들고, Y를 기억하고, Z를 잊지 마

라고 말했다면,

이제는:

> canonical AIMD state를 읽고 이어서 진행해

가 됩니다.

즉, 프롬프트 중심 작업에서 메모리 중심 작업으로 넘어가는 것입니다.

---

## 핵심 믿음

더 좋은 프롬프트는 더 긴 프롬프트가 아닙니다.
더 좋은 memory substrate입니다.

그래서 AIMD는 아래에 집중합니다.

- canonical structure
- stable identifier
- explicit reference
- 낮은 비용의 semantic carryover

---

## 공개 Core와 확장 AIMD

공개 Core는 작게 유지되어야 합니다.

공개 Core의 역할은 아래 의미를 안정적으로 보존하는 것입니다.

- intent
- constraints
- state
- flow

상위 AIMD 레이어는 더 빠르게 진화할 수 있지만, Core는 넓게 채택될 수 있을 정도로 단순해야 합니다.

---

## 방향

AIMD는 모든 prose를 대체하려는 것이 아닙니다.
AI 협업을 위한 canonical memory layer가 되려는 것입니다.

---

SPDX-License-Identifier: Apache-2.0
