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

const buildTransactionPayload = (transactionData, userId) => {
  const normalizedType = normalizeTransactionType(transactionData.type);
  const normalizedAmount = Number(transactionData.amount);
  const normalizedDate = String(transactionData.date ?? '').trim();
  const normalizedMemo = String(transactionData.memo ?? '').trim();
  const normalizedCategory =
    normalizedType === TRANSACTION_TYPE.EXPENSE
      ? String(transactionData.category ?? '').trim()
      : '';

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

  const normalizedTags =
    normalizedType === TRANSACTION_TYPE.INCOME
      ? parseHashTags(transactionData.tags ?? transactionData.tagInput ?? '')
      : [];

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

  return payload;
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
    if (!id) {
      throw new Error('조회할 거래 ID가 없습니다.');
    }

    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * 수입/지출 등록 (F-01-1, F-01-2)
   * @param {Number|String} userId - 현재 로그인한 사용자 ID (필수)
   * @param {Object} transactionData - 구분, 금액, 날짜, 카테고리 등
   */
  async createTransaction(userId, transactionData) {
    const payload = buildTransactionPayload(transactionData, userId);

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
    if (!id) {
      throw new Error('수정할 거래 ID가 없습니다.');
    }

    const payload = buildTransactionPayload(updateData, updateData.userId);

    try {
      const response = await apiClient.put(`/transactions/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('[transactionService.updateTransaction] update failed', {
        baseURL: apiClient.defaults.baseURL,
        endpoint: `/transactions/${id}`,
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
   * 내역 삭제 (F-02-3)
   * @param {Number|String} id - 내역 고유 ID
   */
  async deleteTransaction(id) {
    if (!id) {
      throw new Error('삭제할 거래 ID가 없습니다.');
    }

    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      console.error('[transactionService.deleteTransaction] delete failed', {
        baseURL: apiClient.defaults.baseURL,
        endpoint: `/transactions/${id}`,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data,
      });

      throw error;
    }
  },
  /**
   * 대시보드 월별 재정 통계 조회 (F-03-1)
   * @param {Number|String} userId - 현재 로그인한 사용자 ID (필수)
   * @param {String} yearMonth - 조회할 연월 (예: '2026-04')
   */
  async getMonthlyStats(userId, yearMonth) {
    const [yearStr, monthStr] = String(yearMonth).split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    // 1. 날짜 범위 계산
    const pad2 = (n) => String(n).padStart(2, '0');
    const startDate = `${yearStr}-${pad2(month)}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${yearStr}-${pad2(month)}-${pad2(lastDay)}`;

    // 2. ✨ [최적화 완료] json-server에 쿼리 파라미터를 보내 서버단에서 필터링된 데이터만 받음
    const { data: transactions } = await apiClient.get('/transactions', {
      params: {
        userId: userId,
        date_gte: startDate, // startDate 크거나 같은(>=) 데이터
        date_lte: endDate    // endDate 작거나 같은(<=) 데이터
      }
    });

    // 3. 서버에서 거르고 가져온 딱 '이번 달 데이터'만 순회하며 통계 계산
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;
    const expenseByCategory = Object.create(null);
    const incomeByTag = Object.create(null); // 수입 태그 집계용

    for (let i = 0; i < transactions.length; i += 1) {
      const t = transactions[i];
      const amount = Number(t.amount) || 0;

      if (t.type === TRANSACTION_TYPE.INCOME) {
        totalIncome += amount;
        incomeCount += 1;
        
        // 수입 태그 합산 로직
        const tags = (t.tags && t.tags.length > 0) ? t.tags : ['기타'];
        tags.forEach(tag => {
          const tagName = tag.startsWith('#') ? tag : `#${tag}`;
          incomeByTag[tagName] = (incomeByTag[tagName] || 0) + amount;
        });

      } else if (t.type === TRANSACTION_TYPE.EXPENSE) {
        totalExpense += amount;
        expenseCount += 1;
        const category = t.category || CATEGORY.ETC;
        expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
      }
    }

    console.log('서버에서 필터링되어 도착한 이번 달 데이터:', transactions);

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
        incomeByTag, 
      },
    };
  },
};
