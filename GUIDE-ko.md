# AIMD (AI-Enhanced Markdown) v1.5 실전 상세 가이드

본 가이드는 AIMD v1.5 스펙을 활용하여 **신규 프로젝트를 기획 단계부터 AI 네이티브하게 시작하는 워크플로우**를 다룹니다.

---

## 1. 개요: 왜 처음부터 AIMD인가?

전통적인 문서(`.md`)는 인간의 가독성을 최우선으로 합니다. 하지만 AI와 협업할 때는 **'의미적 명확성'**, **'검증 가능성'**, 그리고 **'낮은 토큰 비용'**이 생산성의 핵심입니다. 

AIMD v1.5로 프로젝트를 시작하면:
1. **모호함 제거**: 서술형 문장 대신 정규화된 라인(`g1`, `r1` 등)으로 기획의 핵심을 선언합니다.
2. **추적 가능한 의존성**: `ref()`를 사용하여 규칙, 마일스톤, 구현 세부 사항 간의 관계를 명확히 연결합니다.
3. **즉각적 구현**: 기획서가 완성되는 순간, AI 에이전트는 별도의 요약 없이 즉시 코드를 작성할 수 있는 '완벽한 기억'을 갖게 됩니다.
4. **자동화된 검증**: `:::test` 블록을 통해 AI가 즉시 검증할 수 있는 선언적 어서션을 정의합니다.

---

## 2. 0일차: 신규 프로젝트 워크플로우 (Quick Start)

신규 프로젝트(예: 'AI 설문조사 도구')를 시작할 때 다음 4단계를 따르세요.

### Phase 1: 핵심 의도 선언 (`:::intent`)
가장 먼저 프로젝트의 **목적(Goal)**과 **성공 기준(Success Criteria)**을 정의합니다.

```markdown
:::intent
g1: ai_native_smart_survey_builder
ok1: survey_generation_time < 30sec
ok2: multi_language_support_by_default
in1: registration+survey_creation+analytics
out1: advanced_crm_integration
:::
```

### Phase 2: 제약 사항 및 의존성 설정 (`:::rules`)
기술 스택, 보안 원칙, 그리고 **절대로 하지 말아야 할 일(Ban)**을 명시합니다. 관련 있는 규칙은 `ref()`로 엮어줍니다.

```markdown
:::rules
r1: stack=Next.js_15+Drizzle+Tailwind4
r2: auth=Better_Auth+SSO
r3: encryption_at_rest ref(r2)
ban1: no_client_side_form_logic_leak ref(r1)
fz1: r2_key_pattern={userId}/{surveyId}/{nanoid}.{ext}
:::
```

### Phase 3: 데이터 구조 선언 (`:::schema`)
이 단계에서 테이블 구조나 객체 데이터를 정의하면, AI에게 "이 스키마를 바탕으로 DB 마이그레이션 코드를 짜줘"라고 즉시 명령할 수 있습니다.

```markdown
:::schema
surveys(id TEXT PK, user_id, title TEXT, description TEXT, created_at)
questions(id TEXT PK, survey_id->surveys.id, type TEXT[text|select|rating], content TEXT)
:::
```

### Phase 4: 실행 및 검증 흐름 정의 (`:::flow` & `:::test`)
마일스톤을 정의하고, 이를 검증하기 위한 자동화된 테스트를 설정합니다.

```markdown
:::flow
s1: infrastructure_setup(nextjs+lucia+drizzle) @2026-03-31
s2: auth_implementation(email+kakao) ref(r2)
s3: survey_generator_engine_ai_connect ref(s2)
:::

:::test
t1: s1=verified -> env(DATABASE_URL)
t2: s2=verified -> route(/api/auth/callback)
:::
```

---

## 3. 핵심 실전 팁 (v1.5 Best Practices)

1. **Prose-Free Zone (서술형 문구 배제)**
   - 코어 블록 내부에는 서술형 문장을 쓰지 마세요. 
   - `key=value`, `subject->result`, `ref(id)` 같은 짧고 강력한 표현을 사용하세요.
   
2. **검증 가능한 참조 (Verifiable References)**
   - `ref(id1, id2)`를 사용하여 논리적 의존성을 표현하세요. AI가 관계를 추측하게 하지 마십시오.

3. **시간적 증거 (@date)**
   - 완료된 마일스톤(`v` 라인)에는 `@YYYY-MM-DD`를 마킹하여 검증 가능한 타임라인을 유지하세요.

4. **One Fact, One Location (한 가지 사실은 한 곳에만)**
   - 동일한 정보를 여러 곳에 반복하지 마세요. 대신 라인 ID를 참조하세요.

---

## 4. 관련 자료

* [AIMD v1.5 스펙 전문](spec/ko/AIMD-v1.5-ko.md)
* [신규 프로젝트 시작용 템플릿](examples/bootstrap-ko.aimd)
