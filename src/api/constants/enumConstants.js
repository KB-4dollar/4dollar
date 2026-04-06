/**
 * 수입/지출 구분 ENUM
 */
export const TRANSACTION_TYPE = Object.freeze({
  INCOME: '수입',
  EXPENSE: '지출',
});

/**
 * 카테고리 ENUM
 */
export const CATEGORY = Object.freeze({
  FOOD: '식비',
  TRANSPORT: '교통',
  CULTURE: '문화생활',
  HOSPITAL: '병원',
  LIVING: '생활용품',
  EVENT: '경조사비',
  ETC: '기타',
});

/**
 * 기간 필터 ENUM
 */
export const FILTER_PERIOD = Object.freeze({
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
  CUSTOM: '사용자 지정',
});

