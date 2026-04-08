import apiClient from '../client/apiClient';
import { parseHashTags } from '@/utils/tagParser';
import {
  TRANSACTION_TYPE,
  CATEGORY,
  FILTER_PERIOD,
} from '../constants/enumConstants';

const normalizeTransactionType = (type) => {
  if (type === 'income' || type === TRANSACTION_TYPE.INCOME) {
    return TRANSACTION_TYPE.INCOME;
  }

  if (type === 'expense' || type === TRANSACTION_TYPE.EXPENSE) {
    return TRANSACTION_TYPE.EXPENSE;
  }

  return '';
};

export const transactionService = {
  /**
   * 목록 조회 및 필터링 (F-02-1, F-02-2)
   * @param {Number|String} userId - 현재 로그인한 사용자 ID (필수)
   * @param {Object} params - 페이지네이션, 정렬, 필터 조건
   */
  async getTransactions(userId, params) {
    const response = await apiClient.get('/transactions', {
      params: {
        userId,
        _sort: 'date',
        _order: 'desc',
        ...params,
      },
    });
    return response;
  },

  /**
   * 상세 내역 조회 (F-02-3)
   * @param {Number|String} id - 내역 고유 ID
   */
  async getTransactionById(id) {
    // TODO: 단건 상세 조회 (이건 고유 id 자체로 조회 가능)
  },

  /**
   * 수입/지출 등록 (F-01-1, F-01-2)
   * @param {Number|String} userId - 현재 로그인한 사용자 ID (필수)
   * @param {Object} transactionData - 구분, 금액, 날짜, 카테고리 등
   */
  async createTransaction(userId, transactionData) {
    // 폼에서 들어오는 영문 타입값과 API 저장용 한글 enum을 하나로 맞춘다.
    const normalizedType = normalizeTransactionType(transactionData.type);
    const normalizedAmount = Number(transactionData.amount);
    const normalizedDate = String(transactionData.date ?? '').trim();
    const normalizedMemo = String(transactionData.memo ?? '').trim();
    // 지출일 때만 카테고리를 저장하고, 수입은 빈 문자열로 통일한다.
    const normalizedCategory =
      normalizedType === TRANSACTION_TYPE.EXPENSE
        ? String(transactionData.category ?? '').trim()
        : '';

    // 저장 전에 서비스 레이어에서 필수값을 한 번 더 검증한다.
    if (!userId) {
      throw new Error('사용자 정보가 없어 거래를 저장할 수 없습니다.');
    }

    if (!normalizedType) {
      throw new Error('거래 구분이 올바르지 않습니다.');
    }

    if (!Number.isInteger(normalizedAmount) || normalizedAmount < 1) {
      throw new Error('금액은 1원 이상의 정수여야 합니다.');
    }

    if (!normalizedDate) {
      throw new Error('날짜를 입력해주세요.');
    }

    if (normalizedType === TRANSACTION_TYPE.EXPENSE && !normalizedCategory) {
      throw new Error('지출은 카테고리 선택이 필요합니다.');
    }

    // 태그는 수입에서만 허용하고, 해시태그 규칙에 맞춰 정규화한 배열만 저장한다.
    const normalizedTags =
      normalizedType === TRANSACTION_TYPE.INCOME
        ? parseHashTags(transactionData.tags ?? transactionData.tagInput ?? '')
        : [];

    // 서버에는 화면용 임시값 대신 정리된 필드만 전달한다.x
    const payload = {
      userId,
      type: normalizedType,
      amount: normalizedAmount,
      date: normalizedDate,
      category: normalizedCategory,
      memo: normalizedMemo,
      tags: normalizedTags,
    };

    if (transactionData.photo) {
      payload.photo = transactionData.photo;
    }

    try {
      // 정규화된 payload를 그대로 등록 API에 저장한다.
      const response = await apiClient.post('/transactions', payload);
      return response.data;
    } catch (error) {
      console.error('[transactionService.createTransaction] save failed', {
        baseURL: apiClient.defaults.baseURL,
        endpoint: '/transactions',
        payload,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data,
      });

      throw error;
    }
  },

  /**
   * 내역 수정 (F-02-3)
   * @param {Number|String} id - 내역 고유 ID
   * @param {Object} updateData - 수정할 데이터
   */
  async updateTransaction(id, updateData) {
    // TODO: 특정 내역 수정 로직
  },

  /**
   * 내역 삭제 (F-02-3)
   * @param {Number|String} id - 내역 고유 ID
   */
  async deleteTransaction(id) {
    // TODO: 특정 내역 삭제 로직
  },

  /**
   * 대시보드 월별 재정 통계 조회 (F-03-1)
   * @param {Number|String} userId - 현재 로그인한 사용자 ID (필수)
   * @param {String} yearMonth - 조회할 연월 (예: '2026-04')
   */

  // 추후 검색 파라미터 기능이 구현 후 API 요청 방식으로 리팩토링할 예정
  // 현재는 전체 데이터를 불러와 필터링하는 방식으로 구현해둠
  async getMonthlyStats(userId, yearMonth) {
    const [yearStr, monthStr] = String(yearMonth).split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    // 1. 날짜 범위 계산 (기존 로직 유지)
    const pad2 = (n) => String(n).padStart(2, '0');
    const startDate = `${yearStr}-${pad2(month)}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${yearStr}-${pad2(month)}-${pad2(lastDay)}`;

    // 2. [변경] 필터링 없이 해당 사용자의 모든 데이터를 가져옴
    // (userId 필터링 불가능 '/transactions'만 호출)
    const { data: allTransactions } = await apiClient.get('/transactions');

    // 3. [핵심] 자바스크립트 filter로 직접 거르기
    const transactions = allTransactions.filter((t) => {
      const isUserMatch = String(t.userId) === String(userId);
      const isDateInRange = t.date >= startDate && t.date <= endDate;
      return isUserMatch && isDateInRange;
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;
    const expenseByCategory = Object.create(null);

    for (let i = 0; i < transactions.length; i += 1) {
      const t = transactions[i];
      const amount = Number(t.amount) || 0;

      if (t.type === TRANSACTION_TYPE.INCOME) {
        totalIncome += amount;
        incomeCount += 1;
      } else if (t.type === TRANSACTION_TYPE.EXPENSE) {
        totalExpense += amount;
        expenseCount += 1;
        const category = t.category || CATEGORY.ETC;
        expenseByCategory[category] =
          (expenseByCategory[category] || 0) + amount;
      }
    }
    // 콘솔 확인
    console.log('필터링된 결과:', transactions);

    return {
      userId,
      yearMonth,
      period: { startDate, endDate },
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense,
      },
      counts: {
        income: incomeCount,
        expense: expenseCount,
        total: incomeCount + expenseCount,
      },
      breakdown: {
        expenseByCategory,
      },
    };
  },
};
