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
  async getMonthlyStats(userId, yearMonth) {
    // TODO: 특정 유저(userId)의 특정 기간 데이터를 조회하여 통계 산출
  }
};