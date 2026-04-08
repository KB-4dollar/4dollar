# Summary Service (소비 패턴 팩폭 위젯 서비스)

## 📌 개요
`summaryService.js`는 사용자의 당월 거래 내역을 분석하여, 대시보드의 **'소비 패턴 팩폭 위젯(명언 위젯 스타일)'**에 필요한 데이터를 제공하는 비즈니스 로직 모듈입니다.
매번 전체 데이터를 재계산하지 않도록, ① '최다 지출 카테고리 추출'과 ② '해당 카테고리의 랜덤 멘트 반환' 두 가지 역할로 메서드를 분리하여 설계했습니다.

## 🔗 의존성 (Dependencies)
- **`transactionService.js`**: 원본 거래 내역 데이터를 가져오기 위해 호출합니다.
- **`enumConstants.js`**: 카테고리(`CATEGORY`) 상수를 사용합니다.

## 🛠 제공하는 기능 (Methods)

### 1. `getTopExpenseCategory(year, month)`
지정된 연/월의 지출 내역을 모두 조회한 후, 누적 지출액이 가장 큰 카테고리 1개를 계산하여 반환합니다.
- **Parameters**
  - `year` (Number): 기준 연도 (예: 2026)
  - `month` (Number): 기준 월 (예: 4)
- **Returns**
  - `Promise<String>`: 최다 지출 카테고리 상수 (예: `CATEGORY.FOOD`)

### 2. `getRandomFeedback(category)`
특정 카테고리에 할당된 5개의 '팩폭 멘트' 중 1개를 랜덤으로 뽑아 반환합니다. 위젯의 **'새로고침(🔄)' 버튼 클릭 시** 이 함수만 단독으로 호출하여 멘트를 즉시 교체할 수 있습니다.
- **Parameters**
  - `category` (String): 멘트를 가져올 카테고리 (예: `CATEGORY.FOOD`)
- **Returns**
  - `String`: 랜덤으로 선택된 팩폭 멘트 (예: "엥겔 지수가 폭발하기 직전이에요.")

## 💡 사용 예시 (컴포넌트 로직)
```javascript
import { summaryService } from '@/api/services/summaryService';
import { ref, onMounted } from 'vue';

const currentCategory = ref(null);
const feedbackMent = ref('');

// 1. 페이지 로드 시: 최다 지출 카테고리를 찾고 첫 멘트 세팅
onMounted(async () => {
  currentCategory.value = await summaryService.getTopExpenseCategory(2026, 4);
  feedbackMent.value = summaryService.getRandomFeedback(currentCategory.value);
});

// 2. 새로고침 버튼 클릭 시: API 호출 없이 멘트만 즉시 교체
const onRefreshClick = () => {
  feedbackMent.value = summaryService.getRandomFeedback(currentCategory.value);
};