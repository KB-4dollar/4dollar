# 🏷️ enumConstants.js 상세 가이드

`src/constants/enumConstants.js`는 문자열 **하드코딩으로 인한 오타 방지 및 코드 일관성 유지**를 위해 제공되는 공통 상수 집합입니다.
수입/지출 구분, 카테고리 명칭 등을 렌더링하거나 DB에 저장할 때 반드시 이 상수를 임포트하여 사용해야 합니다.

## 1. 상수 목록

### `TRANSACTION_TYPE` (수입/지출 구분)
- `TRANSACTION_TYPE.INCOME`: '수입'
- `TRANSACTION_TYPE.EXPENSE`: '지출'

### `CATEGORY` (기획안 명시 7종 카테고리)
- `CATEGORY.FOOD`: '식비'
- `CATEGORY.TRANSPORT`: '교통'
- `CATEGORY.CULTURE`: '문화생활'
- `CATEGORY.HOSPITAL`: '병원'
- `CATEGORY.LIVING`: '생활용품'
- `CATEGORY.EVENT`: '경조사비'
- `CATEGORY.ETC`: '기타'


## 2. 사용 예제

컴포넌트의 `<template>` 영역에서 직접 사용하거나 `<script>` 로직 내에서 비교/저장할 때 활용합니다.

```javascript
import { TRANSACTION_TYPE, CATEGORY } from '@/constants/enumConstants';

// 데이터 생성 시 적용
const newTransaction = {
  type: TRANSACTION_TYPE.EXPENSE, // '지출' 저장
  category: CATEGORY.TRANSPORT,   // '교통' 저장
  amount: 3000,
  date: '2026-04-07'
};

// 조건문 사용 시
if (item.category === CATEGORY.FOOD) {
  console.log('이 항목은 식비입니다.');
}