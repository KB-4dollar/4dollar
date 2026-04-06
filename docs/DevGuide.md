# 개발 가이드

## 목차

- [목차](#목차)
- [1. 라우터 추가 방법](#1-라우터-추가-방법)
- [2. Pinia 스토어 사용법](#2-pinia-스토어-사용법)
- [3. API 서비스 레이어 구조](#3-api-서비스-레이어-구조)
- [4. 컴포넌트 배치 규칙](#4-컴포넌트-배치-규칙)
- [5. 코드 스타일 가이드](#5-코드-스타일-가이드)
- [6. 스타일링 가이드 (Tailwind + 반응형)](#6-스타일링-가이드-tailwind--반응형)
- [7. 협업 규칙](#7-협업-규칙)

---

## 1. 라우터 추가 방법

라우터 설정 파일: `src/router/index.js`

### 구조

```js
const publicRoutes = [...]   // 공통 라우트 (건드리지 않음)

/** 본인 담당 라우터 추가 */
const authRoutes = []        // 로그인, 회원가입 담당자
const userRoutes = []        // 기능 담당자
```

### 라우트 추가 예시

인증이 필요한 페이지는 `DefaultLayout` 하위에 children으로 추가한다.

```js
const userRoutes = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'list', // /list
        name: 'transactionList',
        component: () => import('@/pages/TransactionListPage.vue'),
      },
      {
        path: 'form', // /form
        name: 'transactionForm',
        component: () => import('@/pages/TransactionFormPage.vue'),
      },
    ],
  },
];
```

> **주의:** `path`에 `/`를 붙이면 절대 경로, 붙이지 않으면 부모 경로의 상대 경로가 된다.
> 인증이 필요한 페이지는 반드시 `meta: { requiresAuth: true }`가 있는 레이아웃 하위에 넣을 것.

---

## 2. Pinia 스토어 사용법

스토어 위치: `src/stores/`

### 기존 스토어

| 파일             | 용도                     |
| ---------------- | ------------------------ |
| `auth.js`        | 로그인 상태, 사용자 정보 |
| `transaction.js` | 거래 내역 CRUD           |

### 스토어 불러오기

```js
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();

// state 접근
const list = transactionStore.transactions;

// getter 접근
const income = transactionStore.totalIncome;

// action 호출
await transactionStore.fetchTransactions();
```

> **주의:** `setup()` 또는 `<script setup>` 안에서 호출해야 한다. 모듈 최상단에서 바로 호출하면 Pinia 초기화 전에 실행되어 오류가 발생한다.

### 새 스토어 추가 시

`src/stores/myFeature.js` 파일을 만들고 아래 구조를 따른다:

```js
import { defineStore } from 'pinia';

export const useMyFeatureStore = defineStore('myFeature', {
  state: () => ({
    // ...
  }),
  getters: {
    // ...
  },
  actions: {
    // ...
  },
});
```

---

## 3. API 서비스 레이어 구조

### 전체 흐름

```
Component
  ↓ (action 호출)
Pinia Store    ← 상태 보관 + service 호출 + 상태 업데이트
  ↓ (service 함수 호출)
Service Layer  ← HTTP 요청만 담당
  ↓
apiClient      ← axios 인스턴스 (인터셉터 포함)
  ↓
json-server
```

**Store에서 axios를 직접 import하지 않는다.** 반드시 service를 통해 호출한다.

### api/ 폴더 구조

```
src/api/
  client/
    apiClient.js        ← axios 인스턴스 (base URL, 인터셉터)
  services/
    authService.js      ← 인증 API (로그인, 회원가입, 로그아웃)
    transactionService.js ← 거래 내역 API (CRUD, 통계)
  constants/
    enumConstants.js    ← 공통 상수 (카테고리, 수입/지출 구분 등)
```

> 각 파일 옆에 `.md` 파일이 있으니 상세 사용법은 해당 파일을 참고한다.

### Store에서 service 연결하는 방법

```js
// stores/transaction.js
import { transactionService } from '@/api/services/transactionService'

actions: {
  async fetchTransactions(params) {
    this.loading = true
    try {
      const res = await transactionService.getTransactions(this.userId, params)
      this.transactions = res.data
    } finally {
      this.loading = false
    }
  },

  async addTransaction(data) {
    await transactionService.createTransaction(this.userId, data)
    await this.fetchTransactions()  // 목록 갱신
  },

  async removeTransaction(id) {
    await transactionService.deleteTransaction(id)
    await this.fetchTransactions()
  },
}
```

### enumConstants 사용법

하드코딩 대신 반드시 상수를 사용한다.

```js
import {
  TRANSACTION_TYPE,
  CATEGORY,
  FILTER_PERIOD,
} from '@/api/constants/enumConstants';

// 하드코딩 ❌
const type = '수입';

// 상수 사용 ✅
const type = TRANSACTION_TYPE.INCOME; // '수입'
const cat = CATEGORY.FOOD; // '식비'
const period = FILTER_PERIOD.MONTHLY; // '월간'
```

사용 가능한 상수 목록:

| 상수                       | 값              |
| -------------------------- | --------------- |
| `TRANSACTION_TYPE.INCOME`  | `'수입'`        |
| `TRANSACTION_TYPE.EXPENSE` | `'지출'`        |
| `CATEGORY.FOOD`            | `'식비'`        |
| `CATEGORY.TRANSPORT`       | `'교통'`        |
| `CATEGORY.CULTURE`         | `'문화생활'`    |
| `CATEGORY.HOSPITAL`        | `'병원'`        |
| `CATEGORY.LIVING`          | `'생활용품'`    |
| `CATEGORY.EVENT`           | `'경조사비'`    |
| `CATEGORY.ETC`             | `'기타'`        |
| `FILTER_PERIOD.DAILY`      | `'일간'`        |
| `FILTER_PERIOD.WEEKLY`     | `'주간'`        |
| `FILTER_PERIOD.MONTHLY`    | `'월간'`        |
| `FILTER_PERIOD.CUSTOM`     | `'사용자 지정'` |

## 4. 컴포넌트 배치 규칙

```
src/components/
  common/     # 전체 공통 컴포넌트 (Header 등)
  ui/         # shadcn-vue 자동 생성 컴포넌트 (건드리지 않음)
```

기능별 컴포넌트는 `components/` 하위에 기능 이름으로 폴더를 만들어 관리한다.

```
src/components/
  common/
  ui/
  transaction/    # 거래 관련 컴포넌트
    TransactionItem.vue
    TransactionFilter.vue
  dashboard/      # 대시보드 관련 컴포넌트
    SummaryCard.vue
```

**페이지 파일**(`src/pages/`)은 라우터와 1:1 매핑되는 파일만 넣는다.
작은 단위 컴포넌트는 `src/components/` 하위에 위치시킨다.

## 5. 코드 스타일 가이드

### Vue SFC 구조 순서

```vue
<script setup>
// 1. import
// 2. store/router
// 3. props/emits
// 4. reactive state
// 5. computed
// 6. lifecycle hooks
// 7. functions
</script>

<template>
  <!-- ... -->
</template>

<style scoped>
/* ... */
</style>
```

### 네이밍 규칙

| 대상              | 규칙               | 예시                      |
| ----------------- | ------------------ | ------------------------- |
| 파일명 (컴포넌트) | PascalCase         | `TransactionItem.vue`     |
| 파일명 (페이지)   | PascalCase + Page  | `TransactionListPage.vue` |
| 파일명 (스토어)   | camelCase          | `transaction.js`          |
| 변수/함수         | camelCase          | `fetchTransactions`       |
| CSS 클래스        | Tailwind 유틸 우선 | —                         |

### Tailwind 클래스 병합

조건부 클래스를 적용할 때는 `cn()` 유틸을 사용한다 (`src/lib/utils.js`).

```js
import { cn } from '@/lib/utils';

// 올바른 방법
const classes = cn('base-class', isActive && 'active-class');

// 잘못된 방법 (충돌 가능)
const classes = `base-class ${isActive ? 'active-class' : ''}`;
```

---

## 6. 스타일링 가이드 (Tailwind + 반응형)

### 브레이크포인트

Tailwind 기본 브레이크포인트를 그대로 사용한다. **모바일 퍼스트** 원칙으로 작성한다.

| 접두사 | 기준        | 대상                    |
| ------ | ----------- | ----------------------- |
| (없음) | 모든 화면   | 모바일 기본             |
| `sm:`  | 640px 이상  | 큰 모바일 / 세로 태블릿 |
| `md:`  | 768px 이상  | 태블릿                  |
| `lg:`  | 1024px 이상 | 데스크탑                |

가계부 서비스는 모바일 사용이 많으므로 **모바일 → 데스크탑 순서**로 스타일을 작성한다.

```html
<!-- 모바일: 1열, 태블릿: 2열, 데스크탑: 3열 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
```

### 레이아웃 패턴

#### 페이지 래퍼 — 모든 페이지 최상위에 공통으로 적용

```html
<div class="max-w-5xl mx-auto px-4 py-6">
  <!-- 페이지 내용 -->
</div>
```

#### 요약 카드 3개 나열 (대시보드)

```html
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div class="bg-card rounded-lg p-4 border border-border">총 수입</div>
  <div class="bg-card rounded-lg p-4 border border-border">총 지출</div>
  <div class="bg-card rounded-lg p-4 border border-border">순이익</div>
</div>
```

#### 거래 목록 행

```html
<!-- 모바일: 세로 쌓기, sm 이상: 가로 나열 -->
<div
  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-border"
>
  <span class="text-sm text-muted-foreground">2026-04-07</span>
  <span class="font-medium">점심</span>
  <span class="text-destructive font-semibold">-15,000원</span>
</div>
```

#### 필터 바

```html
<!-- 모바일: 세로, md 이상: 가로 한 줄 -->
<div class="flex flex-col md:flex-row gap-2">
  <select class="...">
    ...
  </select>
  <input type="date" class="..." />
  <button class="...">조회</button>
</div>
```

### 디자인 토큰 사용

`src/style/global.css`에 정의된 CSS 변수를 Tailwind 유틸로 바로 사용할 수 있다.
하드코딩된 색상(`text-gray-500`, `bg-white`) 대신 토큰을 사용해야 다크모드가 자동으로 동작한다.

| 용도             | 클래스                  | 비고               |
| ---------------- | ----------------------- | ------------------ |
| 페이지 배경      | `bg-background`         | 다크모드 자동 전환 |
| 기본 텍스트      | `text-foreground`       |                    |
| 카드 배경        | `bg-card`               |                    |
| 보조 텍스트      | `text-muted-foreground` | 날짜, 레이블 등    |
| 테두리           | `border-border`         |                    |
| 강조 (수입)      | `text-primary`          |                    |
| 위험/삭제 (지출) | `text-destructive`      |                    |

```html
<!-- 올바른 방법 -->
<p class="text-muted-foreground text-sm">2026-04-07</p>

<!-- 잘못된 방법 — 다크모드에서 깨짐 -->
<p class="text-gray-400 text-sm">2026-04-07</p>
```

### 반응형 텍스트 크기

```html
<!-- 모바일은 작게, 데스크탑은 크게 -->
<h1 class="text-xl md:text-2xl font-bold">대시보드</h1>
<p class="text-sm md:text-base text-muted-foreground">이번 달 요약</p>
```

### 모바일 전용 처리

```html
<!-- 모바일에서 숨김 -->
<span class="hidden sm:inline">카테고리</span>

<!-- 모바일에서만 표시 -->
<button class="sm:hidden">...</button>
```

---

## 7. 협업 규칙

### 브랜치 전략

```
main
⌞ dev
⌞ feature-기능명/
⌞ hotfix-버그명/
```

### 커밋 규칙

- `feat`: 기능명
- `fix`: 버그수정
- `style`: UI수정
- `core`: 코어 기능
- `refactor`: 코드 리팩토링
- `docs`: 문서 관련 작업
