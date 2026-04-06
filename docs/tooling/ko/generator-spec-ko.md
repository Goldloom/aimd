# AIMD v1.5 제너레이터 규격 (Generator Specification)

---

## 1. 목적 (Purpose)

이 문서는 `AIMD v1.5` 문서를 생성하거나 업데이트하는 제너레이터를 위한 공식 규격입니다.

제너레이터의 핵심 목적:

1. 소스 의도를 정형화된 라인 세트(Canonical Line Set)로 정규화
2. 일사 일처(One fact, one location) 원칙 유지
3. 안정적인 라인 ID(Stable Line IDs) 부여
4. ACP 투영(Projection) 친화적 구조 구축
5. 토큰 비용이 낮은 v1.5 문서 생성
6. 소스에 명시적 관계가 있을 때 `ref()` 크로스 레퍼런스 생성 (§10.4)
7. `v` 라인에 비의미적 메타데이터로서 `@date` 어노테이션 추가 (§10.5)
8. 표준화된 어휘를 사용하여 선언적 `:::test` 어서션 생성 (§12.3)

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

## 3. 제너레이터 파이프라인 (Generator Pipeline)

```text
소스 입력
  -> 입력 정규화기
  -> 사실 추출기
  -> 정형 계획기
  -> 라인 정규화기
  -> 레퍼런스 추출기  ← v1.5 신규
  -> AIMD 제너레이터
  -> 구문 검증기
  -> 의미 검증기     (ref 무결성 검사 포함)
  -> 압축 검증기
  -> 수정 루프
  -> 최종 AIMD
```

---

## 4. 제너레이션 핵심 원칙 (Core Generation Principles)

### 4.1 정형 데이터 우선 (Canonical First)
제너레이터는 서술형 문장보다 정형 데이터를 먼저 생성해야 합니다(MUST).

### 4.2 최소 블록 구성 (Minimal Blocks)
제너레이터는 필수 핵심 블록 생성을 최우선으로 합니다(MUST).

### 4.3 최소 단어 사용 (Minimal Words)
제너레이터는 가능한 한 정규화된 표현을 사용해야 합니다(SHOULD).

### 4.4 안정적 ID 유지 (Stable IDs)
제너레이터는 개정 시에도 기존 라인 ID를 안정적으로 유지해야 합니다(MUST).

### 4.5 무단 왜곡 금지 (No Silent Invention)
제너레이터는 소스에 없는 사실을 '확인된 사실'로 기재해서는 안 됩니다(MUST NOT).

### 4.6 무손실 소스 충실도 (Lossless Source Fidelity)
제너레이터는 소스의 모든 의미 내용을 반드시 보존해야 합니다(MUST).

### 4.7 보수적 레퍼런스 (Conservative References)  ← v1.5 신규
제너레이터는 소스에 없는 `ref()` 관계를 만들어내서는 안 됩니다(MUST NOT).
- 소스에서 명시적으로 의존성이나 순서 관계가 기술된 경우에만 `ref()` 추가
- 느슨한 주제적 유사성에는 `ref()` 추가 금지
- 불확실한 경우 `ref()` 생략

---

## 5. 필수 제너레이션 단계 (Required Generation Steps)

### 1단계: 입력 정규화 (Input Normalization)
입력 소스의 유형(Prompt, MD, AIMD, Hybrid 등)을 분류하고 구조를 파악합니다.

### 2단계: 소스 사실 추출 (Source Fact Extraction)
소스에서 다음 사실 유형을 추출합니다:
- 목표, 성공 기준, 규칙, 금지 사항, 동결 후보
- 확인된 사실, 미결 이슈, 가정, 다음 액션, 실행 흐름
- **라인 간 의존 관계** ← v1.5 신규
- **완료 날짜 또는 타임스탬프** ← v1.5 신규

### 3단계: 정형 계획 (Canonical Planning)
추출된 각 사실을 적절한 블록에 배치합니다:
- 목표 → `intent.g*`
- 성공 기준 → `intent.ok*`
- 필수 규칙 → `rules.r*`
- 금지 사항 → `rules.ban*`
- 경계 동결 → `rules.fz*`
- 확인된 사실 → `state.v*`
- 미결 항목 → `state.o*`
- 가정 → `state.a*`
- 다음 액션 → `state.n*`
- 실행 단계 → `flow.s*`
- 검증 어서션 → `test.t*` (§12.3)

### 4단계: 라인 정규화 (Line Normalization)
각 사실을 정형화된 페이로드 형식으로 변환합니다.

**권장 형식:** `key=value`, `subject->result`, 안정적 기호 표현

**금지:** 긴 산문, 하나의 라인에 여러 사실 결합, 소스 의미를 벗어나는 임의 요약

### 5단계: 레퍼런스 추출 (Reference Extraction) (§10.4)
모든 라인에 ID가 할당된 후 의존 관계를 추출합니다:
- 소스의 명시적 "~에 의존", "~ 이후", "~에 의해 차단됨" 관계에 대해 의존 라인에 `ref(<id>...)` 추가
- 제너레이터는 추론된 유사성이나 테마적 연결에 기반해 `ref()`를 가공해서는 안 됩니다.
- 의미 검증기(Semantic Validator)는 모든 `ref()` 내 ID가 문서에 존재하는지 확인해야 합니다. 존재하지 않는 ID 참조는 반드시 수정해야 할 의미적 오류입니다.
- `ref()`는 항상 페이로드 끝에 추가되며, 설명(prose)을 포함해서는 안 됩니다.

### 6단계: 라인 ID 할당 (Line ID Assignment)
블록별 접두사 시스템을 따릅니다:
- `g`, `ok`, `in`, `out`
- `r`, `ban`, `fz`
- `v`, `o`, `a`, `n`, `ask`
- `s`
- `t`, `ref`, `p`, `e`

기존 리비전이 있는 경우 기존 라인 ID를 최대한 재사용해야 합니다(SHOULD).

### 7단계: 선택적 블록 결정 (Optional Block Decision)
핸드오프에 직접적으로 필요한 경우에만 선택적 블록을 추가합니다.

`:::test`: 소스에 검증 기준, 승인 테스트, 완료 조건이 포함된 경우 또는 QA 핸드오프가 필요한 경우 생성합니다.

### 8단계: 검증 루프 (Validator Loop)
구문, 의미(ref 무결성 포함), 압축 검증을 순서대로 수행합니다.

---

## 6. 필수 제너레이터 행동 수칙 (Required Behavior)

**권장 사항 (SHOULD):**
1. 기본 출력 모드를 `mode: c`로 설정
2. `:::intent`, `:::rules`, `:::state`, `:::flow`를 항상 먼저 생성
3. 동일한 사실을 여러 블록에 중복 기록하지 않음
4. 소스에 없는 정보는 `a*` 또는 `o*`로만 기록
5. 투영 친화적인 구조로 작성
6. 리비전 시 라인 보존 업데이트 우선
7. **소스에 명시적 관계가 있을 때만 `ref()` 추가** ← v1.5 신규
8. **소스에 날짜가 있을 때만 `v` 라인에 `@date` 추가** ← v1.5 신규

**금지 사항 (MUST NOT):**
1. 소스에 근거가 없는 확정적 사실 발명
2. 핵심 규칙을 `:::human` 블록에만 보관
3. 선택적 블록 남용
4. 텍스트 비중이 높은 코어 블록 생성
5. 기존 안정적 라인 ID 불필요한 변경
6. **소스에 없는 `ref()` 관계 발명** ← v1.5 신규

---

## 7. 블록별 생성 규칙 (Per-Block Rules)

### 7.1 `:::intent`: 최소 `g1` 포함 필수. `ok*`, `in*`, `out*` 가능 시 포함.
### 7.2 `:::rules`: 최소 `r*` 또는 `ban*` 하나 이상. 동결 경계는 `fz*`로 분리.
### 7.3 `:::state`: 최소 `v*` 또는 `o*` 하나 이상 권장. 
**`v` 접두사 보완 (§11.3):** `v`는 검증된 사실과 완료된 마일스톤을 모두 포괄합니다. 

**시간 어노테이션 (§10.5):** 소스에 완료 날짜가 있으면 `v` 라인에 `@YYYY-MM-DD` 추가. `@date`는 비의미적 메타데이터이며 페이로드의 사실(fact) 내용으로 취급해서는 안 됩니다.

### 7.4 `:::flow`: 최소 1개 단계로 정규화 필수.

### 7.5 `:::test` (§12.3)

다음 경우에만 생성합니다:
- 소스에 검증 기준, 승인 테스트, 완료 조건이 명시적으로 포함된 경우
- QA 핸드오프가 필요한 경우

**구문:** `t<N>: <state-id>=<status> -> <assertion>`

**어서션 어휘(Vocabulary):**
- `file(path)`: 파일 존재 여부
- `route(METHOD path)`: API 경로 등록 여부
- `no_table(name)`: DB 테이블 부재 여부
- `env(KEY)`: 환경 변수 정의 여부
- `schema_field(table.col)`: 스키마 컬럼 존재 여부

각 `t` 라인은 반드시 기존 `v`, `o`, `n` 또는 규칙 라인 ID를 참조해야 합니다(MUST).

어서션은 선언적 기호 형식이어야 합니다. 셸 명령어나 OS 종속 구문은 사용해서는 안 됩니다(MUST NOT).

---

## 8. 리비전 업데이트 규칙 (Revision Update Rules)

기존 `.aimd` 파일이 있을 경우 다음 우선순위를 따릅니다:
1. 기존 라인 ID 재사용
2. 기존 정형 레이어 보존
3. 필요한 `add/drop/set` 변경사항만 적용
4. 선택적 블록 수정 최소화
5. `ref()` 추가 시 전체 라인 교체가 아닌 `add` 델타로 처리

완전 재작성은 소스 구조가 근본적으로 변경되었을 경우에만 허용됩니다.

---

## 9. 소스별 제너레이션 정책 (Per-Source Policy)

### 9.1 프롬프트 → AIMD
불확실성을 `a*` 또는 `o*`로 철저히 분리. 소스에 없는 `ref()` 관계 발명 금지.

### 9.2 마크다운 → AIMD
헤더/리스트/표를 정형 사실로 보존. 수치/기한 추출에 집중. 소스의 모든 사실은 반드시 canonical 출력에 존재해야 합니다(무손실 변환). "~에 의존", "~ 이후", "~에 의해 차단됨" 같은 의존성 언어를 `ref()` 후보로 추출합니다.

### 9.3 AIMD → AIMD 업데이트
안정적인 ID 보존을 최우선으로 하여 새로운 변경사항만 반영. `o → v` 전환 시 날짜가 알려진 경우 `@date` 추가.

---

## 10. ACP 생성 규칙 (ACP Generation Rules)

투영(Projection)을 통해 ACP를 생성해야 하며, 역할을 재해석하여 새로 쓰는 행위는 금지됩니다.

라인이 ACP에 포함되고 `ref()`를 가진 경우, 해당 역할에 적합하다면 참조된 라인도 ACP에 포함해야 합니다(SHOULD).

---

## 11. 점수 측정 목표 (Scoring Targets)

- **Syntax Pass**: 필수 조건
- **시맨틱/압축 점수**: 최소 85점 이상 권장
- **우수 기준**: 시맨틱 92점 이상, 압축 90점 이상

---

## 12. 흔한 실패 패턴 (Common Failure Patterns)

1. 코어 블록을 서술형 문장으로 쓰는 행위
2. 진행 상태를 Rules 블록에 넣는 행위
3. 동일 사실을 Rules와 State 양쪽에 중복 기재
4. `:::human` 블록이 지나치게 긴 경우
5. ACP를 라인 선택이 아닌 새로운 요약으로 생성
6. 정형 파일 개정 시 기존 라인 ID를 무단으로 변경
7. MD→AIMD 변환을 의도적 손실 압축으로 취급
8. **소스에 없는 `ref()` 관계 발명** ← v1.5 신규
9. **`:::test` 어서션에 셸 명령어 작성** ← v1.5 신규
10. **존재하지 않는 ID를 가리키는 `ref()` 생성** ← v1.5 신규

---

## 13. 출력 예시 (Output Example)

```markdown
---
aimd: "1.5"
src: md
id: aiworks-platform
rev: 8
mode: c
---

:::intent
g1: single_domain_platform
ok1: shared_layers_once
ok2: app_specific_logic_only
:::

:::rules
r1: nextjs=single_app
r2: plan_sot=subscriptions.plan
ban1: app_specific_auth
fz1: r2_key={userId}/{appSlug}/{nanoid}.{ext}
:::

:::state
v1: billing_billingkey_cycle_done @2026-02-10
o1: startupmate_direct_supabase_phase4
n1: connect_app_tools_after_app_completion ref(v1, r2)
:::

:::flow
s1: source_read
s2: canonical_extract
s3: rules_lock ref(r1, r2)
s4: app_mapping
s5: acp_project
:::

:::test
t1: v1=verified -> route(POST /api/billing/cycle)
t2: ban1 -> no_file(src/app/[app]/auth)
:::
```

---

## 14. 구현 우선순위 (Implementation Priority)

1. 소스 사실 추출
2. 정형 계획
3. 라인 정규화
4. 안정적 ID 할당
5. 레퍼런스 추출
6. 검증 루프 (ref 무결성 포함)
7. 리비전 패치 모드
8. ACP 투영

---

## 15. 결론 (Conclusion)

AIMD v1.5 제너레이터는 모델의 글쓰기 능력을 보는 엔진이 아닙니다. 소스를 라인 기반의 정형 시맨틱 메모리로 정규화하고, 의미 손실 없이 최소한의 비용으로 핸드오프할 수 있게 만드는 동시에 — 이제는 검증 가능한 크로스 레퍼런스와 선언적 테스트 어서션도 생성하여 에이전트가 의존성 순서와 완료 기준을 전체 문서를 다시 읽지 않고도 추론할 수 있게 하는 엔진입니다.
