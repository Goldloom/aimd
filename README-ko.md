# AIMD — AI-Enhanced Markdown v1.4

[English Version](README.md)

**멀티 에이전트 핸드오프를 위한 정형 시맨틱 메모리**

[![AIMD Spec](https://img.shields.io/badge/AIMD-v1.4--Canonical-orange)](spec/ko/AIMD-v1.4-ko.md)

---

## AIMD란 무엇인가?

AIMD는 **AI 에이전트 간의 소통**을 위해 설계된 문서 포맷입니다.

대부분의 문서는 인간이 읽기 위해 작성됩니다. 반면 AIMD는 AI 에이전트가 읽고, 해석하고, 전달하기 위해 작성됩니다. 이는 최소한의 토큰 비용으로 최상의 의미적 정밀도(Semantic Fidelity)를 유지하는 것을 목표로 합니다.

```
인간 작성 → 일반 마크다운(Markdown)
AI 변환 → AIMD 정형 메모리(Canonical Memory)
AI 핸드오프 → 다음 AI가 중단된 지점부터 정확히 이어서 작업 수행
```

---

## 왜 AIMD인가?

AI 에이전트들이 협업할 때, 보통 비정형 마크다운이나 JSON을 주고받습니다. 이는 다음과 같은 세 가지 문제를 야기합니다:

1.  **토큰 낭비**: 서술형 문장(Prose)은 동일한 사실을 여러 곳에서 중복해서 반복합니다.
2.  **의미적 왜곡(Semantic Drift)**: 에이전트마다 동일한 문장을 다르게 해석할 수 있습니다.
3.  **핸드오프 손실**: 핵심 제약 사항, 미결 이슈, 가설 등이 텍스트 속에 묻혀 잊혀지거나 유실됩니다.

AIMD는 어떤 AI라도 모호함 없이 파싱할 수 있는 **압축된 정형 메모리 포맷**을 정의하여 이 세 가지 문제를 모두 해결합니다.

---

## RAG 최적화를 위한 AIMD

AIMD는 **검색 증강 생성(RAG)** 및 시맨틱 메모리 워크플로우를 위해 특수 제작되었습니다. 벡터 기반 지식 창고(Knowledge Vault)에서 일반 텍스트나 마크다운보다 네 가지 핵심적인 우위를 점합니다:

1.  **토큰 효율성**: 정규화된 키-값 쌍(예: `g1`, `ok1`)에 집중함으로써, 최소한의 오버헤드로 높은 의미 밀도를 제공하여 AI의 컨텍스트 윈도우를 보존합니다.
2.  **구조적 청킹(Chunking)**: `:::intent`, `:::rules`, `:::flow`와 같은 섹션은 자연스러운 의미적 경계를 제공합니다. 이를 통해 문장 중간이 잘리는 파편화 없이 특정 맥락을 정밀하게 검색할 수 있습니다.
3.  **높은 의미 밀도**: 언어적 노이즈를 제거하여, 벡터 DB가 불필요한 수식어가 아닌 "핵심 의미" 관계를 더 정확하게 인덱싱하고 쿼리와 매칭할 수 있게 합니다.
4.  **제약 사항 강제**: AI 모델은 정형화된 규칙(`r1`, `ban1`)을 단순한 권고가 아닌 엄격한 논리적 제약으로 해석하므로, 태스크 수행 중 할루시네이션(환각)을 획기적으로 줄여줍니다.

---

## 멀티 에이전트 오케스트레이션을 위한 AIMD

AIMD는 멀티 에이전트 시스템 및 오케스트레이터를 위한 네이티브 **정형 상태 관리(Canonical State Management)** 레이어입니다. 비정형 텍스트의 혼란스러운 교환을 예측 가능한 라인 단위의 시맨틱 핸드셰이크로 전환합니다:

1.  **동적 역할 투영(ACP)**: 오케스트레이터는 동일한 문서에서 특정 역할에 맞는 뷰(예: `ACP-BE`, `ACP-FE`)만 필터링하여 제공할 수 있습니다. 이를 통해 에이전트는 관련 맥박만 공급받으면서 입력 토큰을 획기적으로 절약합니다.
2.  **무손실 태스크 핸드오프**: `:::state` 블록(접두사 `v`, `o`, `n` 사용)은 확인된 사실, 미결 이슈, 다음 단계를 스냅샷으로 캡처합니다. 후속 에이전트는 이를 통해 100%의 재현율로 작업을 이어받을 수 있습니다.
3.  **세밀한 델타 업데이트**: 오케스트레이터는 전체 문서를 다시 보내는 대신 라인 단위 연산(`add`, `drop`, `set`)을 통해 의도를 전달할 수 있어 에이전트 간 트래픽과 토큰 오버헤드를 최소화합니다.
4.  **논리적 일관성 강제**: 목표(`:::intent`)와 제약(`:::rules`)을 중앙 집중화함으로써, 모든 하위 에이전트가 준수해야 할 '단일 진실 공급원(Single Source of Truth)'을 유지하고 에이전트 군집 내의 논리적 이탈을 방지합니다.

---

## AI-Native PRD 엔지니어링을 위한 AIMD

전통적인 제품 요구사항 문서(PRD)를 AIMD로 변환하면 AI 에이전트가 모호함 없이 실행할 수 있는 "살아있는 명세서"가 됩니다:

1.  **모호성 제로**: 수동적인 서술("시스템은 보안이 유지되어야 한다")을 능동적인 정형 제약(`ban1: plaintext_storage`)으로 변환합니다.
2.  **구현 즉시 가능 문법**: 에이전트가 별도의 "정보 추출" 단계를 거칠 필요가 없습니다. 구조화된 블록(`:::api`, `:::schema`)은 코딩 에이전트가 즉시 소비할 수 있는 데이터입니다.
3.  **실시간 진척도 추적**: `:::state` 블록은 실시간 대시보드 역할을 수행하며, 요구사항 문서 내에서 검증된 기능(`v`)과 보류 중인 작업(`n`)을 직접 추적합니다.
4.  **토큰 효율적 유지보수**: 방대한 PRD는 처리 비용이 높습니다. AIMD는 약 20%의 토큰 비용으로 동일한 논리 밀도를 제공하여, 더 빠르고 저렴한 멀티 에이전트 반복 작업을 가능하게 합니다.

---

## 퀵 예제 (Quick Example)

```markdown
---
aimd: "1.4"
src: md
id: payment-retry
rev: 3
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
v1: retry_409_on_processed
o1: rollback_regression_check
n1: qa_validate_concurrent_retry
:::

:::flow
s1: fail_payment
s2: show_retry
s3: validate_idempotency
s4: return_existing_or_new_result
:::
```

---

## 핵심 원칙 (Key Principles)

| 원칙 | 설명 |
|-----------|-------------|
| `canonical first` | 서술형 문장이 아닌 정형화된 레이어가 진실의 원천임 |
| `prose optional` | 인간용 설명은 별도의 선택적 레이어로 분리됨 |
| `one fact, one location` | 모든 사실은 오직 한 곳에만 존재함 |
| `projection handoff` | 역할별 핸드오프는 문서 재작성이 아닌 '라인 선택'으로 이루어짐 |
| `stable line ids` | 라인 ID는 버전이 바뀌어도 유지되어 델타 업데이트를 지원함 |
| `compression validated` | 토큰 비용은 문서 품질의 핵심 지표임 |

---

## 핵심 블록 (Core Blocks)

모든 AIMD 문서는 다음 네 가지 블록을 순서대로 포함해야 합니다:

| 블록 | 목적 | 주요 접두사 (Prefix) |
|-------|---------|--------------|
| `:::intent` | 목표 및 성공 기준 | `g`, `ok`, `in`, `out` |
| `:::rules` | 제약 사항, 금지 사항, 고정 사항 | `r`, `ban`, `fz` |
| `:::state` | 확인된 사실, 미결 이슈, 가설, 다음 액션 | `v`, `o`, `a`, `n`, `ask` |
| `:::flow` | 실행 단계 | `s` |

선택적 블록: `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`, `:::diff`

---

## 정형 라인 포맷 (Canonical Line Format)

코어 블록 내부의 모든 라인은 다음 형식을 따릅니다:

```
<line-id>: <payload>
```

페이로드 규칙:
- `key=value` 또는 `subject->result` 형식 선호
- 짧고 정규화된 형태 유지
- 코어 블록 내 서술형 문장 금지
- 라인당 하나의 사실만 기재

---

## ACP — 역할별 투영 (Projection)

AIMD는 라인 단위 투영을 통해 역할별 핸드오프를 지원합니다:

```
ACP-BE  = intent(g,ok) + rules(all) + state(v,o,a,n) + api + schema
ACP-FE  = intent(g,ok) + rules(relevant) + state(v,o,n) + flow
ACP-QA  = intent(ok) + rules(all) + state(v,o,a) + test
```

투영은 문서를 다시 쓰는 것이 아니라, 필요한 **라인만 선택**하는 것을 의미합니다.

---

## 델타 업데이트 (Delta Updates)

매번 전체 문서를 다시 쓰지 않고 변경 사항만 전달합니다:

```
add: o2=startupmate_timeout_guard
drop: a1
set: v3=chat_runtime_nodejs
```

이를 통해 라인 ID의 안정성을 유지하고 업데이트당 토큰 비용을 최소화합니다.

---

## 검증 파이프라인 (Validator Pipeline)

AIMD는 3단계 검증 파이프라인을 정의합니다:

```
구문 검증기(Syntax) → 의미 검증기(Semantic) → 압축 검증기(Compression)
```

| 검증기 | 확인 사항 |
|-----------|--------|
| 구문 (Syntax) | 포맷, 프론트 매터, 블록 구조, 라인 ID 규칙 |
| 의미 (Semantic) | 의미 보존성, 일사 일처 원칙, ACP 투영 안전성 |
| 압축 (Compression) | 토큰 비용, 서술형 비율, 중복성, 델타 효율성 |

---

## 🛠️ 핵심 저장소 구조

*   [`spec/en/`](spec/en/): 영문 핵심 사양 및 가이드라인
    *   [`AIMD-v1.4.md`](spec/en/AIMD-v1.4.md): AIMD 코어 문법 및 블록 규격.
    *   [`generator-spec.md`](spec/en/generator-spec.md): AI 모델 생성기 엔진 사양.
*   [`spec/ko/`](spec/ko/): 한글 핵심 사양 및 가이드라인
    *   [`AIMD-v1.4-ko.md`](spec/ko/AIMD-v1.4-ko.md): AIMD 코어 문법 및 블록 규격.
    *   [`generator-spec-ko.md`](spec/ko/generator-spec-ko.md): AI 모델 생성기 엔진 사양.
    *   [`generator-prompt-ko.md`](spec/ko/generator-prompt-ko.md): 한국어 마스터 프롬프트 및 가이드.
*   [`README.md`](README.md) / [한국어](README-ko.md): 프로젝트 메인 가이드.
*   [`.cursorrules`](.cursorrules): AI용 워크스페이스 전역 규칙 파일.
*   [`.agents/workflows/aimd.md`](.agents/workflows/aimd.md): Antigravity 등을 위한 슬래시 명령어 워크플로우.

---

## 상태

현재 버전: **v1.4** (Proposed Spec)

AIMD v1.4는 제안된 사양 단계입니다. 구현 및 피드백을 언제든지 환영합니다.

---

## 💻 AI 워크스페이스 설정 가이드 (AI-Native Setup Guide)

이 프로젝트의 AIMD v1.4 규격을 자신의 실무 프로젝트에 즉시 적용하려면 다음 인프라 파일들을 자신의 프로젝트 루트(Root)로 복사하십시오:

### 1단계: 전역 규칙 활성화 (`.cursorrules`)
프로젝트 루트에 `.cursorrules` 파일을 배치하면, Cursor나 Copilot 같은 AI가 자동으로 AIMD v1.4 규격을 준수합니다.

### 2단계: 슬래시 명령어 활성화 (`.agents/workflows/aimd.md`)
Antigravity와 같은 도구에서 `/aimd` 명령어를 통해 언제든지 규격 요약과 지침을 불러올 수 있습니다.

### 3단계: 상세 사양 참조 (`spec/ko/` 폴더)
AI가 특정 문법이나 접두사(Prefix) 규칙이 궁금할 때 `spec/ko/` 폴더 내의 명세서를 참고하도록 하십시오.

---

Copyright © 2026 Hwehsoo Kim (Goldloom). All rights reserved. 본 프로젝트는 **Apache License 2.0**에 따라 라이선스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하십시오.
