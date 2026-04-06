
# 💰 transactionService.js 상세 가이드

`src/services/transactionService.js`는 수입/지출 내역의 **조회, 등록, 수정, 삭제 및 통계(F-01, F-02, F-03 시리즈)**를 담당합니다.

## 1. 메서드 상세

### `getTransactions(userId, params)`
목록을 조회하고 필터링합니다. 무한 스크롤 적용 시 `params`의 `_page` 값을 증가시키며 호출합니다.
- **기획 ID**: F-02-1, F-02-2
- **Parameters**:
  - `userId` (String|Number): 현재 로그인한 유저 ID
  - `params` (Object): `{ _page: 1, _limit: 20, _sort: '-date', category: '식비' }` 등 json-server 필터/정렬 규칙

### `getTransactionById(id)`
특정 내역의 상세 정보를 조회합니다.
- **기획 ID**: F-02-3
- **Parameters**:
  - `id` (String|Number): 내역 고유 ID

### `createTransaction(userId, transactionData)`
새로운 수입/지출 내역을 등록합니다.
- **기획 ID**: F-01-1, F-01-2
- **Parameters**:
  - `userId` (String|Number): 현재 로그인한 유저 ID
  - `transactionData` (Object): `{ type, amount, date, category, memo, imageUrl }`
- **동작**: `transactionData`에 `userId`를 병합하여 POST 요청

### `updateTransaction(id, updateData)`
기존 내역을 수정합니다.
- **기획 ID**: F-02-3
- **Parameters**:
  - `id` (String|Number): 내역 고유 ID
  - `updateData` (Object): 수정할 필드 데이터

### `deleteTransaction(id)`
내역을 삭제합니다. (호출 전 사용자 확인 팝업 필수)
- **기획 ID**: F-02-3
- **Parameters**:
  - `id` (String|Number): 내역 고유 ID

### `getMonthlyStats(userId, yearMonth)`
대시보드 차트를 위한 월별 재정 통계를 조회합니다.
- **기획 ID**: F-03-1
- **Parameters**:
  - `userId` (String|Number): 유저 ID
  - `yearMonth` (String): 'YYYY-MM' 형식의 연월 데이터

## 2. 사용 예제

```javascript
import { transactionService } from '@/services/transactionService';

// 목록 무한 스크롤 조회 예시
const loadMore = async () => {
  const data = await transactionService.getTransactions(currentUserId, {
    _page: currentPage.value,
    _limit: 20,
    _sort: '-date'
  });
  transactionList.value.push(...data);
};
```
