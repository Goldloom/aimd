# ACP/AIMD 사업화 기획서

## 1. 사업 개요

### 사업명

ACP/AIMD 기반 에이전트 협업 운영 플랫폼

### 한 줄 정의

에이전트가 서로 일을 넘길 때 필요한 컨텍스트를 구조화하고, 그 품질과 제약과 검증 상태를 관리하는 표준 + 도구 + SaaS를 제공한다.

### 핵심 명제

앞으로의 AI 운영 문제는 단순히 더 좋은 모델을 쓰는 것이 아니라, 여러 에이전트가 안전하게 협업하도록 만드는 것이다. 그 협업의 가장 취약한 지점은 핸드오프이며, ACP/AIMD는 바로 그 지점을 표준화하고 제품화한다.

---

## 2. 문제 정의

현재 에이전트 활용은 빠르게 늘고 있지만, 실제 운영 현장에서는 아래 문제가 반복된다.

- 에이전트 간 핸드오프가 대부분 자유 서술형 메시지에 의존한다
- 어떤 지시가 절대 우선인지, 어떤 정보가 검증 완료인지 구분이 안 된다
- 사람이 본 문서와 에이전트가 읽는 컨텍스트가 분리되어 관리된다
- 프로젝트 규칙, 참조 문서, 작업 상태, 다음 행동이 한 묶음으로 전달되지 않는다
- 재시도와 재설명 비용이 누적되어 실제 생산성이 떨어진다

이미 MCP, A2A, AGENTS.md 같은 흐름이 나타나고 있지만, 이것들은 주로 연결과 지침을 다룬다. 반면 `핸드오프용 콘텐츠 포맷`과 `그 포맷을 관리하는 제품`은 아직 비어 있다.

이 공백이 바로 사업 기회다.

---

## 3. 솔루션 정의

사업의 핵심은 두 층으로 나뉜다.

### 1. ACP

Agent Context Payload.

에이전트 간 핸드오프 시 전달할 컨텍스트의 공통 의미 모델이다.

- 우선순위
- 검증 상태
- 수정 금지 범위
- 참조
- 다음 행동

을 구조적으로 표현한다.

### 2. AIMD

AI-Enhanced Markdown.

사람이 읽고 쓰고 리뷰하기 좋은 Markdown 기반 authoring format이다. AIMD는 ACP를 만들기 위한 작성 계층으로 동작한다.

정리하면:

- `AIMD`: 사람이 유지보수하는 소스 문서
- `ACP`: 에이전트 간 전달되는 런타임 페이로드

이 구조를 기반으로 표준과 툴과 플랫폼을 함께 사업화한다.

---

## 4. 제품 정의

사업화 대상은 단일 제품이 아니라, 단계적으로 확장되는 제품군이다.

### 제품 1. 오픈 코어 표준 및 개발자 도구

- ACP 명세서
- AIMD 명세서
- CLI parser / builder / validator
- VS Code 확장
- AGENTS.md -> AIMD 변환 도구
- AIMD -> ACP export 기능

목적:

- 빠른 채택
- 생태계 형성
- 표준 논의 주도권 확보

### 제품 2. 팀 협업용 SaaS

- agent handoff workspace
- payload registry
- 정책 템플릿
- 핸드오프 diff / history
- 검증 상태 및 freeze 추적
- 팀별 규칙 집행
- 에이전트 작업 로그와 문서 연결

목적:

- 팀 단위 운영 문제 해결
- 반복 사용 확보
- 유료 전환 시작

### 제품 3. 엔터프라이즈 거버넌스 플랫폼

- 조직 단위 policy management
- 감사 로그
- SSO / RBAC
- private deployment / on-prem
- 규정 준수 템플릿
- 에이전트 운영 대시보드
- MCP / A2A / GitHub / Jira / Notion / Slack 연동

목적:

- 대형 고객 계약
- 높은 ARPA
- 장기 락인

---

## 5. 목표 고객

### 1차 고객

- AI 네이티브 개발팀
- 여러 에이전트를 코드 작성, 리뷰, 문서화, 배포에 사용하는 스타트업
- Cursor, Claude Code, GitHub Copilot, 내부 에이전트를 병행하는 팀

이들은 도입 장벽이 낮고, pain point가 분명하다.

### 2차 고객

- SI / 에이전시 / 솔루션 빌더
- 고객사별로 agent workflow를 설계하는 파트너사
- 내부 지식 문서와 agent handoff를 결합하려는 플랫폼 조직

### 3차 고객

- 금융, 헬스케어, 공공, 대기업 IT 조직
- 감사 추적과 승인 체계와 변경 통제가 필요한 환경

이 시장은 도입은 느리지만, 수익성은 가장 높다.

---

## 6. 고객 가치 제안

ACP/AIMD가 고객에게 주는 가치는 단순한 문서 포맷이 아니다.

### 운영 가치

- 에이전트 핸드오프 누락 감소
- 재설명 비용 감소
- 중요 제약 위반 감소
- 검증된 정보의 재계산 감소

### 협업 가치

- 사람과 에이전트가 같은 문서 기반으로 협업
- 프로젝트 규칙과 런타임 작업이 연결됨
- 역할 분업이 명확해짐

### 통제 가치

- 무엇이 고정되었는지 추적 가능
- 무엇이 검증되었는지 명시 가능
- 누가 어떤 컨텍스트를 넘겼는지 기록 가능

### 비즈니스 가치

- 여러 에이전트를 써도 운영 혼선이 줄어듦
- 대형 조직에서 agent governance 도입이 쉬워짐
- AI 도입이 실험을 넘어 프로세스로 정착됨

---

## 7. 시장 진입 논리

이 사업은 `문법 판매`로 가면 실패한다. `운영 문제 해결`로 가야 한다.

핵심 진입 논리는 아래와 같다.

### 1. 오픈 표준으로 진입

표준과 기본 도구는 공개한다. 그래야 채택이 빠르다.

### 2. 개발자 도구로 습관을 만든다

CLI, VS Code 확장, GitHub 연동을 통해 개발팀의 작성 습관과 리뷰 습관 안으로 들어간다.

### 3. 팀 협업 문제로 유료화한다

개별 문서 작성은 무료에 가깝지만, 팀 단위의 정책 집행과 handoff registry와 감사 추적은 유료 가치가 크다.

### 4. 엔터프라이즈 통제로 확장한다

표준만으로는 돈을 벌기 어렵지만, governance와 compliance는 돈을 벌 수 있다.

---

## 8. 수익 모델

### 1. 오픈 코어

- ACP/AIMD 사양
- 기본 CLI
- 기본 VS Code 확장

무료 제공

목적:

- 확산
- 커뮤니티 형성
- de facto standard 선점

### 2. 팀 플랜 SaaS

예시 기능:

- shared workspace
- payload history
- team policies
- registry search
- approval workflow
- analytics

예시 가격:

- Starter: 무료 또는 저가
- Team: 사용자당 월 과금
- Usage add-on: agent payload volume, validator runs, retention 기준 추가 과금

### 3. 엔터프라이즈 계약

예시 기능:

- SSO
- RBAC
- audit log export
- private cloud / on-prem
- security review pack
- custom connectors
- support SLA

연 단위 계약 모델이 적합하다.

### 4. 전문 서비스

- AIMD 도입 컨설팅
- AGENTS.md / 사내 문서 AIMD 전환
- ACP workflow 설계
- 엔터프라이즈 policy pack 구축

초기 현금 흐름 확보에 유용하다.

### 5. 장기 옵션

- certification program
- marketplace
- partner ecosystem
- 표준 적합성 인증

---

## 9. 경쟁 구도와 차별화

### 직접 대체재

- 일반 Markdown
- AGENTS.md
- Notion / Confluence 템플릿
- ad hoc prompt library

문제:

- 사람이 쓰기에는 충분하지만, 에이전트 핸드오프용 구조가 없다

### 인접 경쟁

- agent orchestration 플랫폼
- workflow automation 플랫폼
- LLMOps / observability 제품

문제:

- 실행 파이프라인은 제공하지만, 문서형 컨텍스트 포맷과 human-reviewable handoff 체계는 약하다

### 차별화 포인트

1. 콘텐츠 레이어를 다룬다
2. 사람과 에이전트가 함께 쓰는 포맷이다
3. 문서 작성부터 핸드오프, 거버넌스까지 수직 통합이 가능하다
4. 표준 제안과 제품 전략이 연결되어 있다

---

## 10. 제품 로드맵

### Phase 1. 표준 + OSS 도구

기간:

- 0~6개월

목표:

- ACP v0.1 명세 공개
- AIMD v1.x 정리
- parser / validator / export CLI
- VS Code extension 안정화
- 샘플 repo / sample workflows 공개

성과 지표:

- GitHub stars
- extension installs
- sample repo fork 수
- pilot 사용자 수

### Phase 2. 팀용 SaaS

기간:

- 6~12개월

목표:

- payload registry
- handoff timeline
- shared policy packs
- GitHub 연동
- workspace UI

성과 지표:

- 주간 활성 workspace
- 월간 handoff payload 수
- 유료 팀 수
- 무료 -> 유료 전환율

### Phase 3. 엔터프라이즈 확장

기간:

- 12~24개월

목표:

- SSO / RBAC
- audit export
- private deployment
- connector ecosystem
- enterprise sales motion 정립

성과 지표:

- 파일럿 기업 수
- ACV
- renewal rate
- 보안 심사 통과 수

---

## 11. 실행 전략

### 제품 전략

먼저 개발자에게 사랑받는 도구를 만든다. 그 위에 팀 운영 기능을 얹는다. 마지막으로 엔터프라이즈 통제를 판다.

### 커뮤니티 전략

- 오픈 명세 유지
- 예시 문서와 샘플 워크플로 공개
- GitHub 중심 배포
- 표준 논의 커뮤니티 참여

### 파트너 전략

- AI 개발 도구 회사
- 컨설팅 / 구축 파트너
- 표준화 커뮤니티
- IDE / DevEx 생태계

---

## 12. KPI 설계

사업이 실제로 살아 있는지 보려면 아래 지표를 봐야 한다.

### 채택 지표

- `.aimd` 또는 ACP 문서 생성 리포지토리 수
- VS Code 확장 설치 수
- CLI 월간 활성 사용자 수
- community contribution 수

### 활용 지표

- 월간 생성 ACP payload 수
- payload당 참조 수
- handoff 성공률
- 수정 재시도 감소율

### 사업 지표

- 유료 팀 수
- MRR / ARR
- enterprise pipeline 수
- ACV
- churn / retention

### 가치 지표

- 에이전트 재시도 턴 감소
- 규칙 위반 감소
- review time 감소
- 문서-작업 연결률 증가

---

## 13. 초기 팀 구성

초기에는 대규모 조직보다 작은 고밀도 팀이 적합하다.

- Founder / Product: 문제 정의, 표준 설계, 고객 인터뷰
- Engineer 1: parser / CLI / spec tooling
- Engineer 2: VS Code / integrations / SaaS backend
- Engineer 3: frontend / workspace / dashboard
- Solutions / DevRel: 커뮤니티 확산, 고객 도입 지원

초기에는 제품 엔지니어링과 DevRel이 매우 중요하다.

---

## 14. 리스크와 대응

### 리스크 1. 대형 모델 사업자가 자체 포맷을 만들 수 있음

대응:

- 특정 모델 종속이 아닌 중립 레이어를 강조한다
- 오픈 명세와 멀티 툴 지원으로 lock-in 회피 가치를 만든다

### 리스크 2. 표준만으로는 매출이 약함

대응:

- 표준은 무료
- 매출은 team workflow, governance, audit, enterprise integration에서 만든다

### 리스크 3. 사용자가 그냥 Markdown으로 버틸 수 있음

대응:

- 전환 도구를 제공한다
- handoff 품질과 audit 가능성을 차별점으로 제시한다
- 규제가 강한 산업부터 공략한다

### 리스크 4. 너무 이른 시장일 수 있음

대응:

- 개발자 도구로 먼저 유틸리티를 만든다
- 컨설팅과 파일럿으로 초기 수요를 검증한다
- SaaS는 실제 사용 패턴이 쌓인 후 확장한다

---

## 15. 투자 및 자금 사용 계획

초기 자금은 아래 영역에 집중하는 것이 적절하다.

- 표준 및 레퍼런스 구현 고도화
- IDE/CLI 경험 개선
- GitHub / IDE / 협업도구 연동
- SaaS MVP 개발
- 초기 고객 파일럿 및 보안 대응

우선순위는 기술 과시가 아니라 `도입 마찰 제거`다.

---

## 16. 사업화 결론

ACP/AIMD의 사업 기회는 포맷 자체를 파는 데 있지 않다. 진짜 기회는 에이전트 협업의 운영 레이어를 잡는 데 있다.

정리하면 사업 논리는 다음과 같다.

1. 에이전트 시대에는 handoff 품질이 핵심 병목이 된다
2. ACP는 그 handoff를 구조화하는 공통 콘텐츠 레이어다
3. AIMD는 사람이 그 레이어를 유지보수할 수 있게 만드는 authoring format이다
4. 오픈 표준과 개발자 도구로 빠르게 침투할 수 있다
5. 팀 협업과 엔터프라이즈 거버넌스에서 수익화할 수 있다

따라서 ACP/AIMD는 단순 문서 포맷 프로젝트가 아니라, `에이전트 운영 체계의 표준 + 플랫폼 사업`으로 볼 수 있다.

이 포지셔닝이 맞다면 사업의 출발점은 명확하다.

- 표준을 제안한다
- 도구를 배포한다
- 팀의 handoff pain을 해결한다
- 엔터프라이즈 governance로 확장한다

이 순서가 가장 현실적이고, 가장 방어력 있는 사업화 경로다.
