// src/stores/transaction.js
import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    // 거래 내역 목록
    transactions: [],
    // 현재 선택된 거래 (상세/수정용)
    selectedTransaction: null,
    // 로딩 상태
    loading: false,
  }),

  getters: {
    // 수입 합계
    totalIncome: (state) =>
      state.transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),

    // 지출 합계
    totalExpense: (state) =>
      state.transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),

    // 순이익 (수입 - 지출)
    netAmount: (state) => state.totalIncome - state.totalExpense,
  },

  actions: {
    // 거래 내역 전체 조회
    async fetchTransactions() {
      // TODO: GET /api/transactions
    },

    // 거래 등록
    async addTransaction(transaction) {
      // TODO: POST /api/transactions
    },

    // 거래 수정
    async updateTransaction(id, transaction) {
      // TODO: PUT /api/transactions/:id
    },

    // 거래 삭제
    async deleteTransaction(id) {
      // TODO: DELETE /api/transactions/:id
    },
  },
});
