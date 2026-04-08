// src/api/services/summaryService.js
import { transactionService } from './transactionService';
import { CATEGORY, TRANSACTION_TYPE } from '../constants/enumConstants';

// 팩폭 멘트 풀 (카테고리별 5개씩)
const FEEDBACK_POOL = {
  [CATEGORY.FOOD]: [
    "엥겔 지수가 폭발하기 직전이에요. 배달 앱 VIP는 훈장이 아닙니다.",
    "식비가 식도락 여행 수준이네요. 오늘은 냉장고 파먹기를 추천합니다.",
    "카페인 중독이 의심되네요. 텀블러와 친해져 보는 건 어떨까요?",
    "식비 지출이 심상치 않아요. 오늘은 요리사가 되어보는 건 어떨까요?",
    "디저트 배는 따로 있다지만, 통장 잔고는 따로 있지 않습니다."
  ],
  // TODO: 나머지 교통, 문화생활, 병원, 생활용품, 경조사비, 기타 멘트 추가
};

export const summaryService = {
  
  /**
   * 1. 당월 최다 지출 카테고리 추출
   * @param {number} year 
   * @param {number} month 
   * @returns {Promise<string>} 최다 지출 카테고리 (예: '식비')
   */
  async getTopExpenseCategory(year, month) {
    // 1. transactionService를 통해 해당 월의 거래 내역 조회
    // const transactions = await transactionService.getMonthlyTransactions(year, month);
    
    // TODO: TRANSACTION_TYPE.EXPENSE 인 데이터만 필터링
    // TODO: 카테고리별 누적 지출 합계 계산 (reduce 등 활용)
    // TODO: 지출 합계가 가장 큰 카테고리명 찾기
    
    // 임시 반환값 (UI 작업을 위해 우선 식비로 고정)
    return CATEGORY.FOOD; 
  },

  /**
   * 2. 카테고리별 랜덤 팩폭 멘트 반환 (API 호출 안 함, 동기 함수)
   * @param {string} category 
   * @returns {string} 랜덤 멘트
   */
  getRandomFeedback(category) {
    // 1. 입력받은 카테고리에 해당하는 멘트 배열 가져오기
    const pool = FEEDBACK_POOL[category];
    
    // 방어 로직: 해당 카테고리 멘트가 없거나 지출이 아예 없는 경우
    if (!pool || pool.length === 0) {
      return "이번 달은 지출이 아주 깔끔하네요! 훌륭합니다.";
    }

    // TODO: Math.random()을 사용하여 배열 중 랜덤하게 1개 요소 추출
    
    // 임시 반환값
    return "멘트 산출 로직 구현 전입니다."; 
  }

};