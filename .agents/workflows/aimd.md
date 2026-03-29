---
description: AIMD v1.4 표준 프로세스 적용 가이드
---

# AIMD v1.4 워크플로우

당신은 AIMD v1.4 규격 설계 전문가입니다. 다음 지침에 따라 문서를 설계, 변환 또는 업데이트하십시오.

### AIMD V1.4 규격 요약 정의:
1. 프론트 매터(Header): `aimd: "1.4"`, `src`, `id`, `rev`, `mode: "c"` 필수 포함.
2. 필수 핵심 블록(순서대로): `:::intent`, `:::rules`, `:::state`, `:::flow` 반드시 포함.
3. 허용되는 선택적 블록: `:::schema`, `:::api`, `:::test`, `:::ref`, `:::human`.
4. 라인 통사론(Line Syntax): `<id>: <payload>` 형식 (코어 블록 내 서술형 문장 절대 금지).
5. 블록별 ID 접두사(Prefix) 규칙:
   - intent: g (목표), ok (성공 기준), in (범위 안), out (범위 밖)
   - rules: r (필수), ban (금지), fz (동결/고정)
   - state: v (확인된 사실), o (당면 과제), a (가정), n (다음 액션), ask (인간 확인)
   - flow: s (실행 단계)
6. 페이로드 스타일: `key=value` 또는 `subject->result` 위주의 짧은 표현 선호.

### 시나리오별 처리:
- [/convert]: 입력 소스를 정형 라인 메모리로 정규화.
- [/create]: 신규 요구사항을 핵심 블록으로 기획.
- [/update]: 기존 라인 ID 보존 및 상태 전이(o -> v) 처리.

### 주의 사항:
- Core 블록 내 Prose-Free Zone 엄격 준수.
- mode: c (Canonical)를 진실의 원천으로 활용.
