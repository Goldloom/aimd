# AI-Works Platform — 디자인 시스템

> 플랫폼 내 모든 앱이 따르는 단일 디자인 규격입니다.
> 새 앱을 추가하거나 기존 앱을 수정할 때 이 문서를 기준으로 합니다.
>
> **원전 참조**: `design-notionstyle.md` — Notion 스타일 가이드에서 AI 서비스에 맞는 원칙(철학·타이포·아이콘)을 추출해 반영했다. 색상·레이아웃 방향은 다크 AI 서비스 기준으로 독립 적용.
>
> **연관 문서**: 아키텍처 설계서 (`docs/260325(최종)통합플랫폼_아키텍처_설계서...md`)
> → 앱의 `manifest.ts`에서 선언하는 `appColor` 값은 이 문서의 테마 컬러 표를 기준으로 한다.

---

## 목차

1. [디자인 철학](#1-디자인-철학)
2. [원칙](#2-원칙)
3. [앱 레이아웃 타입](#3-앱-레이아웃-타입)
4. [앱별 테마 컬러](#4-앱별-테마-컬러)
5. [디자인 토큰](#5-디자인-토큰)
6. [타이포그래피](#6-타이포그래피)
7. [아이콘 원칙](#7-아이콘-원칙)
8. [공통 컴포넌트](#8-공통-컴포넌트)
9. [사이드바 규격](#9-사이드바-규격)
10. [히어로 섹션 규격](#10-히어로-섹션-규격)
11. [카드 규격](#11-카드-규격)
12. [버튼 규격](#12-버튼-규격)
13. [입력 필드 규격](#13-입력-필드-규격)
14. [배지 규격](#14-배지-규격)
15. [파일 구조](#15-파일-구조)

---

## 1. 디자인 철학

> `design-notionstyle.md`의 4가지 핵심 원칙을 AI 서비스 맥락으로 재해석했다.

| 원칙 | 설명 | AI 서비스 적용 |
|------|------|--------------|
| **Calm Intelligence** | UI는 배경으로 물러나고 AI 결과물이 주인공이다 | 강한 액센트 컬러는 AI 출력 영역에 집중, 나머지는 무채색 유지 |
| **Progressive Disclosure** | 필요한 것만, 필요한 순간에 노출한다 | 고급 설정·부가 기능은 기본 화면에 노출 금지, 토글/더보기로 숨김 |
| **Functional Minimalism** | 장식이 아닌 기능을 위한 디자인이다 | 그라디언트·애니메이션은 상태 전달의 의미가 있을 때만 사용 |
| **Fluid & Frictionless** | 지연 없는 반응, 빠른 탐색을 최우선으로 한다 | AI 응답 중 스켈레톤·스트리밍 처리 필수, 로딩 블로킹 금지 |

---

## 2. 원칙

| 원칙 | 설명 |
|------|------|
| **구조는 통일** | 모든 앱이 동일한 셸 레이아웃 컴포넌트를 사용한다 |
| **테마 컬러는 앱별 1개** | 각 앱은 고유한 강조색 1개를 가지며, 사용 방식은 공통 규칙을 따른다 |
| **다크 퍼스트** | 앱 영역은 항상 다크 배경 (`bg-slate-950`) 기준으로 설계한다 |
| **간격의 일관성** | 섹션 `p-8`, 카드 `p-6`, 아이템 간격 `gap-6` 을 기본으로 한다 |
| **hover는 항상 제공** | 클릭 가능한 모든 요소에는 hover 상태를 명시한다 |

---

## 3. 앱 레이아웃 타입

앱은 용도에 따라 두 가지 레이아웃 타입 중 하나를 사용한다.

### 타입 A — 사이드바형

섹션이 여러 개이고 자유롭게 이동 가능한 앱에 사용한다.

```
┌─────────────┬──────────────────────────────────┐
│  사이드바    │  히어로 섹션                       │
│  (220px)    ├──────────────────────────────────┤
│  ● 메뉴1    │                                  │
│  ○ 메뉴2    │  메인 콘텐츠                       │
│  ○ 메뉴3    │                                  │
│             │                                  │
└─────────────┴──────────────────────────────────┘
```

**사용 앱:** Mdvault, Content Factory, Tax, Webdesign, Teambot

**구현:** `<AppLayout type="sidebar">` + `<AppSidebar>` 사용

---

### 타입 B — 풀페이지형

단계별 플로우가 있거나 화면 전체를 사용하는 앱에 사용한다.

```
┌──────────────────────────────────────────────┐
│  스텝 인디케이터 (선택 사항)                   │
├──────────────────────────────────────────────┤
│                                              │
│  메인 콘텐츠 (풀너비, max-w-4xl 또는 5xl)    │
│                                              │
└──────────────────────────────────────────────┘
```

**사용 앱:** Contract, Proposal, Analytics, Recoder, Fax

**구현:** `<AppLayout type="page">` 사용

---

## 4. 앱별 테마 컬러

각 앱은 고유한 테마 컬러 1개를 가진다. 겹치는 색상은 없어야 한다.

> **연동**: 각 앱의 `manifest.ts` → `appColor` 값이 아래 표의 Tailwind 토큰 이름과 일치해야 한다.
> AppGrid, AppSidebar, AppHero는 `manifest.appColor`를 읽어 테마를 자동 적용한다.

| 앱 | 슬러그 | 테마 컬러 | Tailwind 토큰 | CSS 변수 |
|----|--------|---------|-------------|---------|
| **AI-Claworks** ★ | `claworks` | Pink | `pink-400` | `--app-claworks` |
| **AI-Console** ★ | `console` | Slate | `slate` (시스템) | `--app-console` |
| **AI-Mdvault** | `mdvault` | Violet | `violet-400` | `--app-mdvault` |
| **AI 콘텐츠 팩토리** | `content-factory` | Emerald | `emerald-400` | `--app-content-factory` |
| **AI 데이터 분석기** | `analytics` | Sky | `sky-400` | `--app-analytics` |
| **AI 계약서 검토기** | `contract` | Cyan | `cyan-400` | `--app-contract` |
| **AI-Tax** | `tax` | Amber | `amber-400` | `--app-tax` |
| **AI 제안서 빌더** | `proposal` | Indigo | `indigo-400` | `--app-proposal` |
| **AI-Webdesign** | `webdesign` | Fuchsia | `fuchsia-400` | `--app-webdesign` |
| **AI 업무진단기** | `diagnosis` | Orange | `orange-400` | `--app-diagnosis` |
| **업무 자동화 설계기** | `automation` | Teal | `teal-400` | `--app-automation` |
| **AI 사업계획서** | `business-plan` | Blue | `blue-400` | `--app-business-plan` |
| **AI 카피라이터** | `copywriter` | Rose | `rose-400` | `--app-copywriter` |
| **AI 고객응대 생성기** | `customer-service` | Purple | `purple-400` | `--app-customer-service` |
| **AI ROI 계산기** | `roi` | Lime | `lime-400` | `--app-roi` |
| **AI-Word** | `word` | Green | `green-400` | `--app-word` |
| **AI-Sheet** (Airtable 대체) | `sheet` | Yellow | `yellow-400` | `--app-sheet` |
| **AI-Slides** | `slides` | Red | `red-400` | `--app-slides` |
| **AI-Teambot** | `teambot` | Sky (변형) | `sky-300` ⚠️ | `--app-teambot` |
| **AI-Recoder** | `recoder` | Pink (변형) | `pink-300` ⚠️ | `--app-recoder` |
| **AI-Pdf** | `ai-pdf` | Fuchsia | `fuchsia-400` | `--app-ai-pdf` |
| **PDF Editor Pro** | `pdf-editor` | Indigo | `indigo-400` | `--app-pdf-editor` |

> ★ **특수 앱 (AppGrid 배너 렌더링)**
> - `AI-Claworks` (`agent` 카테고리, sortOrder: -1): 최상단 에이전트 배너. 100% 무인화 목표의 오케스트레이터.
> - `AI-Console` (`workspace` 카테고리, sortOrder: 0): 데이터 허브 배너. AI-Claworks에 MCP 노출.
>
> **PDF 앱 2종 역할 분리** (2026-03-27 확정)
> - `AI-Pdf` (`fuchsia-400`, `/apps/ai-pdf`): AI 분석·생성·서명 요청·법인 프로필 — AI 문서 실행 앱
> - `PDF Editor Pro` (`indigo-400`, `/apps/pdf`): 폼 필드 직접 편집·어노테이션·OCR·페이지 관리 — 데스크탑형 편집기
> - 두 앱은 동일한 `/api/pdf/*` API와 `pdf_vault` DB를 공유한다.
>
> **⚠️ 팔레트 변형 토큰 적용 앱 2종** (AI-Fax 제거, AI-HR 제거로 pink-400 확보됨)
> Teambot·Recoder는 각각 기존 앱과 같은 색상 패밀리의 `-300` 변형 토큰을 사용한다.
>
> | 앱 | 배정 토큰 | 밝기 구분 기준 |
> |---|---|---|
> | AI-Teambot | `sky-300` | Analytics `sky-400`보다 밝음 |
> | AI-Recoder | `pink-300` | AI-Claworks `pink-400`보다 밝음 |
>
> **변형 토큰 적용 규칙** (`-400` → `-300`, hover는 `-200`):
> ```
> 아이콘 색상:   text-{color}-300
> 배지 배경:     bg-{color}-300/10   border-{color}-300/30
> 선택된 항목:   bg-{color}-300/10   border-{color}-300/50
> Primary 버튼:  bg-{color}-300      text-slate-950   hover:bg-{color}-200
> ```

### 테마 컬러 사용 규칙

각 앱에서 테마 컬러는 아래 4가지 용도로만 사용한다. (표준 앱 기준: `-400` 토큰)

```
1. 아이콘 색상:     text-{color}-400
2. 배지 배경:       bg-{color}-400/10   border-{color}-400/30
3. 선택된 항목:     bg-{color}-400/10   border-{color}-400/50
4. Primary 버튼:    bg-{color}-400      text-slate-950   hover:bg-{color}-300
```

---

## 5. 디자인 토큰

`globals.css` `@theme` 블록에 정의한다.

### 앱 배경 / 카드

| 토큰 역할 | Tailwind 클래스 | 값 |
|---------|--------------|---|
| 앱 배경 | `bg-slate-950` | `#020817` |
| 카드 배경 | `bg-white/[0.03]` | rgba(255,255,255,0.03) |
| 카드 배경 (진함) | `bg-slate-950/60` | — |
| 카드 보더 | `border-white/10` | rgba(255,255,255,0.10) |
| 카드 hover 배경 | `bg-white/[0.05]` | — |
| 카드 hover 보더 | `border-white/20` | — |

### 텍스트

| 역할 | 클래스 |
|------|--------|
| 주 텍스트 | `text-white` |
| 보조 텍스트 | `text-white/65` |
| 약한 텍스트 | `text-white/40` |
| 레이블 | `text-white/75` |
| 비활성 | `text-white/30` |
| 앱 레이블 (대문자) | `text-{color}-300/80 uppercase tracking-[0.2em] text-xs` |

### 보더 반경

| 요소 | 클래스 | 픽셀 |
|------|--------|------|
| 대형 섹션 | `rounded-3xl` | 24px |
| 카드 | `rounded-2xl` | 16px |
| 버튼 / 입력 | `rounded-2xl` | 16px |
| 소형 배지 | `rounded-full` | — |
| 토글 항목 | `rounded-xl` | 12px |

### 간격

| 역할 | 클래스 |
|------|--------|
| 섹션 패딩 | `p-8` |
| 카드 패딩 | `p-6` |
| 소형 카드 패딩 | `p-4` |
| 섹션 간격 | `gap-8` |
| 카드 내부 간격 | `gap-6` |
| 아이템 목록 간격 | `space-y-3` |

### 그림자

| 역할 | 클래스 |
|------|--------|
| Primary 버튼 그림자 | `shadow-lg shadow-{color}-500/20` |
| 카드 호버 그림자 | 없음 (보더 변화로 대체) |

---

## 6. 타이포그래피

> `design-notionstyle.md` 섹션 4에서 발췌, AI 서비스 다크 UI에 맞게 조정.

### 폰트 패밀리

| 역할 | 폰트 | 이유 |
|------|------|------|
| 영문 UI | **Geist** | Vercel 제작, AI 서비스 최적화, 다크 배경에서 가독성 우수 |
| 한국어 | **Pretendard** | Apple SD Gothic Neo 대체, 가변 폰트, 웨이트 일관성 |
| 코드 / 모노 | **Geist Mono** | 코드 블록, API 키, 토큰 수 표시 |

```css
/* globals.css — next/font 사용 권장 */
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

/* Pretendard — CDN */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css');

font-family: 'Geist', 'Pretendard Variable', ui-sans-serif, system-ui, sans-serif;
```

### 타입 스케일

| Tailwind 클래스 | 크기 | line-height | 용도 |
|----------------|------|------------|------|
| `text-[11px]` | 11px | 1.4 | 상태 배지, 태그 (대문자) |
| `text-xs` | 12px | 1.5 | 보조 텍스트, 캡션, 타임스탬프 |
| `text-sm` | 14px | 1.6 | **기본 UI 텍스트** — 버튼, 레이블, 메뉴 |
| `text-base` | 16px | 1.6 | 본문, 입력 필드 내용 |
| `text-lg` | 18px | 1.5 | 소형 섹션 제목 |
| `text-xl` | 20px | 1.4 | 카드 제목 |
| `text-2xl` | 24px | 1.3 | 섹션 제목 |
| `text-3xl` | 30px | 1.25 | **히어로 제목** |
| `text-4xl` | 40px | 1.2 | 페이지 타이틀 (최대, 랜딩 전용) |

### 폰트 웨이트

| 용도 | 클래스 | 값 |
|------|--------|-----|
| 본문, 설명 텍스트 | `font-normal` | 400 |
| UI 레이블, 메뉴 | `font-medium` | 500 |
| 강조, 버튼, 활성 메뉴 | `font-semibold` | 600 |
| 히어로 제목, 카드 헤딩 | `font-bold` | 700 |

---

## 7. 아이콘 원칙

> `design-notionstyle.md` 섹션 2(비주얼 아이덴티티)에서 발췌, 플랫폼 컴포넌트에 맞게 구체화.

### 라이브러리

모든 앱은 **Lucide React** 아이콘만 사용한다. Heroicons, Radix Icons 등 혼용 금지.

```tsx
import { FileText, Sparkles, RefreshCw, Loader2 } from 'lucide-react'
```

### 크기 규격

| 용도 | 크기 | className |
|------|------|-----------|
| 인라인 (텍스트 나란히) | 16px | `h-4 w-4` |
| 기본 UI, 메뉴 아이템 | 16px | `h-4 w-4` |
| 섹션 헤더, 카드 헤딩 | 20px | `h-5 w-5` |
| 빈 상태(empty state), 히어로 | 24px | `h-6 w-6` |

### stroke 규격

```tsx
// 모든 아이콘: strokeWidth={1.5} (Lucide 기본값 2에서 변경)
// AppSidebar, AppHero 등 공통 컴포넌트는 내부적으로 고정
<FileText className="h-4 w-4 text-white/60" strokeWidth={1.5} />
```

> `strokeWidth={1.5}` 는 다크 배경에서 아이콘이 너무 두껍게 보이지 않도록 한다.
> `strokeWidth={2}` (기본)는 밝은 배경 전용.

### AI 전용 아이콘 규칙

AI 기능임을 시각적으로 구분하기 위해 아래 아이콘을 일관되게 사용한다.

| 상황 | 아이콘 | 색상 |
|------|--------|------|
| AI 생성 / AI 기능 진입 | `<Sparkles />` | `text-{color}-400` (테마 컬러) |
| AI 처리 중 (로딩) | `<Loader2 className="animate-spin" />` | `text-{color}-400` |
| 재생성 | `<RefreshCw />` | `text-white/60` |
| 결과 복사 | `<Copy />` | `text-white/60` |
| AI 편집 모드 | `<Pencil />` | `text-white/60` |

```tsx
// AI 생성 버튼 패턴
<button className="inline-flex items-center gap-2 rounded-2xl
  bg-{color}-400 px-5 py-3 text-sm font-bold text-slate-950
  transition hover:bg-{color}-300">
  <Sparkles className="h-4 w-4" strokeWidth={1.5} />
  AI로 생성하기
</button>

// AI 처리 중 패턴
<Loader2 className="h-4 w-4 animate-spin text-{color}-400" strokeWidth={1.5} />
```

---

## 8. 공통 컴포넌트

`src/components/app-shell/` 에 위치한다.

```
src/components/app-shell/
  AppLayout.tsx     # 타입 A/B 레이아웃 래퍼
  AppSidebar.tsx    # 사이드바 (타입 A 전용)
  AppHero.tsx       # 히어로 섹션
  AppCard.tsx       # 표준 카드
  index.ts          # named export 모음
```

### 사용 예시

```tsx
// 타입 A (사이드바형)
import { AppLayout, AppSidebar, AppHero } from "@/components/app-shell";

<AppLayout type="sidebar" sidebar={<AppSidebar appColor="violet" items={navItems} />}>
  <AppHero appColor="violet" label="AI-Mdvault Beta" title="템플릿 실행 및 문서 관리" />
  {/* 콘텐츠 */}
</AppLayout>

// 타입 B (풀페이지형)
<AppLayout type="page">
  {/* 콘텐츠 */}
</AppLayout>
```

---

## 9. 사이드바 규격

### 구조

```
┌─────────────────────┐
│ 앱 뱃지              │  rounded-2xl, bg-{color}/10, border-{color}/20, p-4
│  아이콘  앱 이름     │
│  한 줄 설명          │
├─────────────────────┤
│ 메뉴 항목들          │  space-y-1
│  ● 활성 메뉴         │  bg-{color}/10  border-{color}/30  text-{color}-300
│  ○ 비활성 메뉴       │  bg-transparent  border-transparent  text-white/60
├─────────────────────┤  (선택적 구분선)
│ 하단 추가 메뉴       │
└─────────────────────┘
```

### className 규격

```tsx
// 사이드바 컨테이너
"fixed left-0 top-14 z-10 hidden h-[calc(100vh-56px)] w-[220px]
 border-r border-white/[0.06] bg-slate-950 p-4 lg:flex lg:flex-col"

// 앱 뱃지
"mb-5 rounded-2xl border border-{color}-400/20 bg-{color}-400/10 p-4"

// 메뉴 아이템 (비활성)
"flex items-center gap-3 rounded-xl border border-transparent
 px-3 py-2.5 text-sm text-white/60
 hover:border-white/10 hover:bg-white/[0.03] hover:text-white transition-colors"

// 메뉴 아이템 (활성)
"flex items-center gap-3 rounded-xl border border-{color}-400/30
 bg-{color}-400/10 px-3 py-2.5 text-sm font-semibold text-{color}-300"

// 메인 콘텐츠 오프셋
"flex-1 pt-14 lg:pl-[220px]"
```

---

## 10. 히어로 섹션 규격

모든 앱의 최상단에 위치하는 섹션. 앱 설명과 컨텍스트 배너를 표시한다.

### 구조

```
┌─────────────────────────────────────────┐
│ [앱 레이블 뱃지]  (작은 대문자 텍스트)    │
│ 제목                                     │
│ 설명 텍스트                              │
│ [컨텍스트 배너] (선택, 다른 앱에서 전달됨) │
└─────────────────────────────────────────┘
```

### className 규격

```tsx
// 섹션 컨테이너
"overflow-hidden rounded-3xl border border-{color}-400/20
 bg-[radial-gradient(circle_at_top_left,rgba({color-rgb},0.15),transparent_40%),
     linear-gradient(135deg,rgba(2,8,23,0.98),rgba(15,23,42,0.95))]
 p-8"

// 앱 레이블 (아이콘 + 대문자 텍스트)
"mb-4 flex items-center gap-2 text-xs font-semibold
 uppercase tracking-[0.2em] text-{color}-300/80"

// 제목
"text-3xl font-bold tracking-tight text-white"

// 설명
"mt-3 max-w-2xl text-sm leading-7 text-white/60"

// 컨텍스트 배너
"mt-5 rounded-2xl border border-{color}-400/20
 bg-{color}-400/10 px-4 py-3 text-sm text-{color}-100"
```

---

## 11. 카드 규격

### 일반 카드

```tsx
// 기본 카드
"rounded-2xl border border-white/10 bg-white/[0.03] p-6"

// hover 가능한 카드
"rounded-2xl border border-white/10 bg-white/[0.02]
 transition hover:border-white/20 hover:bg-white/[0.05]"

// 선택된 카드
"rounded-2xl border border-{color}-400/50 bg-{color}-400/10"

// 섹션 카드 (대형)
"rounded-3xl border border-white/10 bg-slate-950/60 p-6"
```

### 섹션 헤더 (카드 내부)

```tsx
// 아이콘 + 제목
"mb-4 flex items-center gap-2 text-sm font-semibold text-white"
// 아이콘 색상은 테마 컬러: className="h-4 w-4 text-{color}-300"
```

---

## 12. 버튼 규격

### Primary 버튼

```tsx
// 크기: 기본
"inline-flex items-center gap-2 rounded-2xl
 bg-{color}-400 px-5 py-3 text-sm font-bold
 text-slate-950 transition hover:bg-{color}-300
 disabled:cursor-not-allowed disabled:opacity-50"

// 크기: 소형
"inline-flex items-center gap-2 rounded-xl
 bg-{color}-400 px-4 py-2 text-xs font-bold
 text-slate-950 transition hover:bg-{color}-300"
```

### Secondary 버튼

```tsx
"inline-flex items-center gap-2 rounded-2xl
 border border-white/10 bg-white/[0.05]
 px-5 py-3 text-sm font-semibold text-white
 transition hover:border-white/20 hover:bg-white/[0.08]"
```

### Ghost 버튼 / 링크

```tsx
"text-sm font-medium text-{color}-300
 underline decoration-white/20 underline-offset-4
 hover:text-{color}-200"
```

### 상태

```tsx
// 로딩 스피너
<Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />

// 비활성
"disabled:cursor-not-allowed disabled:opacity-50"
```

---

## 13. 입력 필드 규격

```tsx
// 텍스트 입력
"w-full rounded-2xl border border-white/10
 bg-white/[0.03] px-4 py-3 text-sm text-white
 outline-none transition
 placeholder:text-white/25
 focus:border-{color}-400/50"

// 텍스트에어리어
"min-h-[100px] w-full rounded-2xl border border-white/10
 bg-white/[0.03] px-4 py-3 text-sm text-white
 outline-none transition resize-none
 placeholder:text-white/25
 focus:border-{color}-400/50"

// 셀렉트
"w-full rounded-2xl border border-white/10
 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"

// 레이블
"mb-2 block text-sm font-medium text-white/75"
```

---

## 14. 배지 규격

```tsx
// 앱 상태 배지 (대문자)
"rounded-full bg-white/5 px-2.5 py-0.5
 text-[10px] font-bold uppercase tracking-wider text-white/50"

// 테마 컬러 배지
"inline-flex items-center gap-1 rounded-full
 border border-{color}-400/30 bg-{color}-400/10
 px-3 py-1 text-xs font-semibold text-{color}-300"

// 에러
"rounded-2xl border border-rose-400/30
 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"

// 성공
"rounded-2xl border border-emerald-400/20
 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"

// 정보 (테마 컬러)
"rounded-2xl border border-{color}-400/20
 bg-{color}-400/10 px-4 py-3 text-sm text-{color}-100"
```

---

## 15. 파일 구조

### 공통 컴포넌트 위치

```
platform/src/
  components/
    app-shell/              ← 공통 앱 레이아웃 컴포넌트
      AppLayout.tsx         # 타입 A/B 선택 래퍼
      AppSidebar.tsx        # 사이드바 (타입 A 전용)
      AppHero.tsx           # 히어로 섹션
      AppCard.tsx           # 표준 카드
      index.ts              # named export
    platform/               # 기존 플랫폼 레벨 컴포넌트
      GlobalHeader.tsx
      AppGrid.tsx
      PlanBadge.tsx
      UsageMeter.tsx
    apps/                   # 앱별 전용 컴포넌트
      tax/
      webdesign/
```

### 앱 구조 (타입 A 예시)

```
app/(platform)/apps/{app-name}/
  manifest.ts               # appColor 포함 앱 선언 ← 디자인 시스템 연결 지점
  page.tsx                  # 서버 컴포넌트 (인증 체크)
  {AppName}Client.tsx       # 클라이언트 루트 (AppLayout 래핑)
  {Feature}View.tsx         # 각 섹션별 뷰 컴포넌트
```

### 앱 구조 (타입 B 예시)

```
app/(platform)/apps/{app-name}/
  manifest.ts               # appColor 포함 앱 선언 ← 디자인 시스템 연결 지점
  page.tsx
  {AppName}Client.tsx       # 상태 기반 화면 전환 포함
```

### 앱 카테고리 & AppGrid 렌더링 규칙

| 카테고리 | 대상 앱 | AppGrid 렌더링 | sortOrder |
|----------|--------|---------------|-----------|
| `agent` | **AI-Claworks** | **최상단 에이전트 배너** (타일 아님) | -1 |
| `workspace` | **AI-Console** | **워크스페이스 배너** (타일 아님) | 0 |
| `business` | 진단기, 제안서, 계약서, ROI 등 | 컬러 타일 | 1+ |
| `document` | Mdvault, 콘텐츠 팩토리, Word, Sheet 등 | 컬러 타일 | 1+ |
| `automation` | Tax, 자동화 설계기 등 | 컬러 타일 | 1+ |
| `utility` | Analytics, Recoder, Webdesign 등 | 컬러 타일 | 1+ |

`agent`·`workspace` 앱은 AppGrid 타일 그리드와 분리해 순서대로 배너 렌더링한다.

```tsx
// AppGrid.tsx 렌더링 분기
const agentApps     = apps.filter(a => a.category === 'agent')
const workspaceApps = apps.filter(a => a.category === 'workspace')
const regularApps   = apps.filter(a => a.category !== 'agent' && a.category !== 'workspace')

// agent    → <AppAgentBanner />    (최상단, 100% 무인화 허브)
// workspace → <AppWorkspaceBanner /> (두 번째)
// regular  → <AppTile /> 그리드
```

### AI-Claworks manifest.ts 예시 (agent 카테고리)

```typescript
// src/app/apps/claworks/manifest.ts
export const manifest: AppManifest = {
  slug: 'claworks',
  name: 'AI-Claworks',
  description: '창업기업의 AI 사업파트너 — 먼저 보고, 먼저 말하고, 함께 실행한다',
  icon: 'Bot',
  category: 'agent',       // ← AppGrid 에이전트 배너 렌더링 트리거
  appColor: 'pink',        // ← pink-400
  minPlan: 'FREE',
  route: '/apps/claworks',
  sortOrder: -1,           // ← AI-Console보다 위
}
```

### AI-Console manifest.ts 예시 (workspace 카테고리)

```typescript
// src/app/apps/console/manifest.ts
export const manifest: AppManifest = {
  slug: 'console',
  name: 'AI-Console',
  description: '10인 이하 팀을 위한 AI 통합 업무 관리 — CRM · 파이프라인 · 프로젝트 · 재무',
  icon: 'LayoutDashboard',
  category: 'workspace',   // ← AppGrid 워크스페이스 배너 렌더링 트리거
  appColor: 'slate',       // ← 시스템 앱 전용 (컬러드 테마 없음)
  minPlan: 'FREE',
  route: '/apps/console',
  sortOrder: 0,
}
```

### manifest.ts → 디자인 시스템 연결 방식

`appColor`가 `manifest.ts`에 선언되면, 공통 컴포넌트들이 이를 자동으로 소비한다.
앱 코드에서 컬러를 하드코딩하지 않는다.

```tsx
// AppGrid.tsx — app_registry에서 appColor를 읽어 타일에 적용
<AppTile color={app.appColor} name={app.name} icon={app.icon} />

// AppSidebar.tsx — manifest.appColor로 활성 메뉴 스타일 결정
<AppSidebar appColor={manifest.appColor} items={navItems} />

// AppHero.tsx — manifest.appColor로 그라디언트·배지 색상 결정
<AppHero appColor={manifest.appColor} label={manifest.name} title="..." />
```

> **원칙**: 앱 개발자는 `manifest.ts`의 `appColor` 한 곳만 설정한다.
> 나머지 테마 적용은 공통 컴포넌트가 처리한다.

---

## 적용 우선순위

현재 디자인 규격과 가장 많이 벗어난 순서로 적용한다.

| 우선순위 | 앱 | 주요 작업 |
|---------|----|------------|
| 1 | **Mdvault** | 사이드바 추가, 테마 violet 적용, 자동화/인박스/어시스턴트 뷰 추가 |
| 2 | **Content Factory** | 사이드바 복원, 테마 emerald 통일, 누락 메뉴 복원 |
| 3 | **Tax** | 테마 amber 적용, AppLayout 타입 A 적용 |
| 4 | **Proposal** | 다크모드 전환, 테마 indigo 적용 |
| 5 | **Analytics** | 히어로 섹션 규격 정렬, 테마 sky 통일 |
| 6 | **Contract** | 테마 cyan 정렬 (현재 sky 사용 중) |
| 7 | **Webdesign** | 사이드바를 AppSidebar로 교체, 테마 fuchsia 적용 |

> **폰트 적용**: 신규 앱은 Geist + Pretendard를 기본 적용. 기존 앱은 다음 UI 작업 시 함께 교체.
> **아이콘 적용**: 신규 앱은 Lucide + strokeWidth={1.5} 기본 적용. 기존 앱은 컴포넌트 수정 시 함께 교체.

---

*최종 수정: 2026-03-25*
