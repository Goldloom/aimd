# AIMD Semantic Validator 명세

## 1. 목적

규칙 기반 validator는 문법, 블록 유무, `@ref` 경로, 빈 지시자 같은 형식 문제를 잡는다.  
semantic validator는 그 위에서 `이 AIMD가 실제로 다음 AI가 신뢰하고 써도 되는 문서인가`를 판단한다.

핵심 목표는 네 가지다.

- 사실과 추론을 구분한다.
- 블록 간 의미 충돌을 찾는다.
- 역할별 handoff 안전성을 평가한다.
- 실패 시 어떤 판단이 잘못되었는지 역추적 가능하게 만든다.

---

## 2. 적용 범위

semantic validator는 아래 입력을 대상으로 한다.

- `.aimd` 원문
- 필요 시 원본 `prompt` 또는 원본 `Markdown`
- `@ref`로 연결된 파일
- 상속된 `inherits` 체인
- 필요 시 기존 ACP 산출물

출력은 단순 pass/fail이 아니라 `진단 리포트`여야 한다.

- `severity`: error / warning / info
- `code`: 안정적인 규칙 ID
- `block`: 문제 발생 블록
- `evidence`: 근거 문장, 행, 참조 파일
- `repair_hint`: 수정 제안

---

## 3. 검증 레벨

### Level 1. Source Fidelity

원문에 있는 핵심 사실이 AIMD에 누락되거나 왜곡되지 않았는지 본다.

검사 항목:

- 원문 요구사항이 `:::intent`, `:::flow`, `:::rules`, `:::test`에 반영되었는가
- 원문에 없는 내용을 AIMD가 확정 사실처럼 추가하지 않았는가
- 원문의 숫자, 날짜, 상태값, API path, 필드명이 바뀌지 않았는가
- 원문의 부정 제약이 긍정 문장으로 뒤집히지 않았는가

대표 오류:

- `semantic.source_missing_requirement`
- `semantic.source_invented_fact`
- `semantic.source_value_mismatch`

### Level 2. Inference Boundary

AI가 추론한 내용을 `VERIFIED`처럼 다루지 않았는지 본다.

검사 항목:

- 근거 없는 새 필드, 새 API, 새 flow step이 `ASSUMPTION` 없이 들어갔는가
- 명시되지 않은 흐름을 추론했는데 `OPEN` 또는 `ASSUMPTION`이 없는가
- `VERIFIED` 항목에 실제 근거 문장이나 참조가 있는가

대표 오류:

- `semantic.inference_unmarked`
- `semantic.verified_without_evidence`

### Level 3. Intra-Document Consistency

문서 내부 블록끼리 의미가 맞는지 본다.

검사 항목:

- `:::schema` 필드와 `:::api` payload가 충돌하지 않는가
- `:::flow` 단계와 `:::test` 시나리오가 같은 시스템을 설명하는가
- `:::rules`의 금지사항과 `:::ai`의 `CRITICAL`이 서로 모순되지 않는가
- `FREEZE` 대상과 실제 변경 블록이 충돌하지 않는가

대표 오류:

- `semantic.schema_api_conflict`
- `semantic.flow_test_conflict`
- `semantic.freeze_violation`

### Level 4. Handoff Safety

다음 AI가 이 문서를 읽고 안전하게 이어서 일할 수 있는지 본다.

검사 항목:

- `OPEN`과 `VERIFIED`가 구분되는가
- `NEXT`가 있으면 다음 작업 범위가 읽히는가
- 중요한 제약이 prose에만 있고 구조 블록에 없는가
- ACP로 추출할 때 필요한 정보가 구조적으로 드러나는가

대표 오류:

- `semantic.handoff_missing_open_state`
- `semantic.handoff_implicit_constraint`
- `semantic.handoff_missing_next`

### Level 5. Role Fit

역할별 ACP가 해당 에이전트에게 맞는 정보만 담고 있는지 본다.

검사 항목:

- `ACP-FE`에 backend 내부 구현 세부가 과도하게 섞였는가
- `ACP-QA`에 테스트보다 구현 지시가 과도한가
- `ACP-review`에 승인 기준 대신 구현 세부만 남았는가

대표 오류:

- `semantic.role_frontend_noise`
- `semantic.role_qa_missing_acceptance`
- `semantic.role_review_missing_risk`

### Level 6. Auditability

문제가 생겼을 때 판단 경로를 역추적할 수 있는지 본다.

검사 항목:

- `VERIFIED` 항목마다 근거가 있는가
- `ASSUMPTION`이 왜 생겼는지 소스 연결이 되는가
- `CRITICAL`과 `FREEZE`의 출처가 보이는가
- 누가 생성했고 무엇을 추론했는지 구분되는가

대표 오류:

- `semantic.audit_missing_evidence`
- `semantic.audit_missing_origin`

---

## 4. 핵심 규칙 세트

### 4.1 사실성 규칙

- `VERIFIED`는 반드시 원문, `@ref`, 코드, 상속 블록 중 하나에 근거가 있어야 한다.
- 원문에 없는 수치와 날짜는 `ASSUMPTION` 또는 `OPEN` 없이 확정할 수 없다.
- 원문의 `must not`, `금지`, `반드시`는 손실 없이 구조 블록으로 승격되어야 한다.

### 4.2 구조 대응 규칙

- 요구사항이 3개 이상이면 최소 1개 이상의 `:::intent` 또는 `:::flow`가 있어야 한다.
- API path가 명시됐으면 `:::api`에 대응 항목이 있어야 한다.
- 필드 표나 데이터 표가 있으면 `:::schema` 또는 명시적 보존 근거가 있어야 한다.

### 4.3 추론 표시 규칙

- 추론으로 생성한 flow는 `ASSUMPTION`을 남겨야 한다.
- 추론으로 생성한 schema는 `ASSUMPTION` 또는 `OPEN`으로 검증 필요성을 남겨야 한다.
- 역할별 ACP에서 삭제된 정보는 손실이 아니라 `scope narrowing`이어야 한다.

### 4.4 운영 안전 규칙

- `CRITICAL`은 일반 설명이 아니라 실제 실행 제약이어야 한다.
- `OPEN` 항목은 downstream 작업을 막는지, 아니면 참고 수준인지 구분 가능해야 한다.
- `NEXT`는 가능하면 agent role 또는 다음 작업 형태가 드러나야 한다.

---

## 5. 실행 방식

semantic validator는 한 번에 전부 하는 단일 검사기보다 `다단계 파이프라인`이 적합하다.

1. 구조 파서
2. source-to-AIMD alignment 검사
3. 블록 간 consistency 검사
4. 역할별 ACP 적합성 검사
5. auditability 검사

각 단계는 독립된 규칙 ID를 가져야 한다.

---

## 6. 권장 점수 모델

단순 pass/fail 대신 점수화가 유용하다.

- `Structure score`: 0-100
- `Fidelity score`: 0-100
- `Handoff score`: 0-100
- `Auditability score`: 0-100

최종 판정 예시:

- `Pass`: 모든 critical error 없음, 평균 85 이상
- `Pass with Warnings`: error 없음, 평균 70 이상
- `Fail`: critical error 존재 또는 평균 70 미만

---

## 7. 샘플 리포트 형식

```yaml
result: fail
scores:
  structure: 92
  fidelity: 61
  handoff: 74
  auditability: 58
issues:
  - severity: error
    code: semantic.verified_without_evidence
    block: "::ai"
    message: VERIFIED item has no traceable evidence in source or refs
    evidence:
      - "VERIFIED: payment retry always returns 202"
    repair_hint: "Downgrade to ASSUMPTION or attach source/API evidence"

  - severity: warning
    code: semantic.handoff_missing_open_state
    block: "::flow"
    message: inferred flow exists without OPEN marker for unresolved retry policy
```

---

## 8. 구현 우선순위

1. `VERIFIED` 근거 검사
2. source-to-AIMD 요구사항 정렬 검사
3. `CRITICAL/FREEZE` 충돌 검사
4. 역할별 ACP 적합성 검사
5. 점수화와 repair hint

---

## 9. 한 줄 결론

semantic validator는 문법 검사기가 아니라 `AI가 만든 AIMD를 다음 AI가 신뢰해도 되는지 판정하는 의미 검사기`다.
