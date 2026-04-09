import apiClient from '../client/apiClient';
import { parseHashTags } from '@/utils/tagParser';
import {
  TRANSACTION_TYPE,
  CATEGORY,
  FILTER_PERIOD,
} from '../constants/enumConstants';
import { ErrorCode } from '../constants/errorCode';

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

  if (normalizedMemo.length > 100) {
    throw new Error('메모는 100자 이하여야 합니다.');
  }
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

  if (normalizedAmount > 999999999) {
    throw new Error('금액은 10억원 미만이어야 합니다.');
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
   */
  async getMonthlyStats(userId, yearMonth) {
    // [리팩토링] 로직 전체를 try-catch로 감싸서 예외 상황 통제
    try {
      const [yearStr, monthStr] = String(yearMonth).split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);

      const pad2 = (n) => String(n).padStart(2, '0');
      const startDate = `${yearStr}-${pad2(month)}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${yearStr}-${pad2(month)}-${pad2(lastDay)}`;

      const { data: transactions } = await apiClient.get('/transactions', {
        params: {
          userId: userId,
          date_gte: startDate,
          date_lte: endDate
        }
      });

      let totalIncome = 0;
      let totalExpense = 0;
      let incomeCount = 0;
      let expenseCount = 0;
      const expenseByCategory = Object.create(null);
      const incomeByTag = Object.create(null);

      for (let i = 0; i < transactions.length; i += 1) {
        const t = transactions[i];
        const amount = Number(t.amount) || 0;

        if (t.type === TRANSACTION_TYPE.INCOME) {
          totalIncome += amount;
          incomeCount += 1;
          
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

      return {
        userId,
        yearMonth,
        period: { startDate, endDate },
        totals: { income: totalIncome, expense: totalExpense, net: totalIncome - totalExpense },
        counts: { income: incomeCount, expense: expenseCount, total: incomeCount + expenseCount },
        breakdown: { expenseByCategory, incomeByTag },
      };

    } catch (error) {
      // [리팩토링] 시스템 에러를 우리가 정의한 비즈니스 에러 상수로 변환하여 던짐
      console.error('[transactionService.getMonthlyStats] failed:', error);
      
      const enhancedError = new Error(ErrorCode.DASHBOARD_FAILED.msg);
      enhancedError.code = ErrorCode.DASHBOARD_FAILED.code;
      enhancedError.originalError = error; // 디버깅용 원본 에러 보존
      
      throw enhancedError; // 스토어(Store)로 에러를 전달
    }
  },
};
