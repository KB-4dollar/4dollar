import apiClient from '../client/apiClient';
import { TRANSACTION_TYPE, CATEGORY, FILTER_PERIOD } from "../constants/enumConstants";
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
    // TODO: transactionData 객체에 userId를 병합({ ...transactionData, userId })하여 POST 요청
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
    const transactions = allTransactions.filter(t => {
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
        expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
      }
    }
    // 콘솔 확인
    console.log("필터링된 결과:", transactions);

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
  }
};
