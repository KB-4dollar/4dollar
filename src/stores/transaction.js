// src/stores/transaction.js
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { transactionService } from '@/api/services/transactionService';
import { TRANSACTION_TYPE } from '@/api/constants/enumConstants';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    // 거래 내역 목록
    transactions: [],
    // 현재 선택된 거래 (상세/수정용)
    selectedTransaction: null,
    // 로딩 상태
    loading: false,
    // 페이지네이션
    totalCount: 0,
    // 대시보드용 월별 통계 데이터를 담을 바구니
    monthlyStats: null,
    // 에러 담을 바구니
    error: null,
  }),

  getters: {
    // 수입 합계 (현재 로드된 목록 기준)
    totalIncome: (state) =>
      state.transactions
        .filter((t) => t.type === TRANSACTION_TYPE.INCOME)
        .reduce((sum, t) => sum + t.amount, 0),

    // 지출 합계 (현재 로드된 목록 기준)
    totalExpense: (state) =>
      state.transactions
        .filter((t) => t.type === TRANSACTION_TYPE.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0),

    // 순이익 (수입 - 지출)
    netAmount: (state) => state.totalIncome - state.totalExpense,

    // 무한스크롤: 아직 불러올 항목이 있는지
    hasMore: (state) => state.transactions.length < state.totalCount,
  },

  actions: {
    // 거래 내역 조회 (필터/페이지네이션 포함)
    // append=true 이면 기존 목록에 이어붙임 (무한스크롤용)
    async fetchTransactions(params = {}, append = false) {
      // TODO: authStore.user가 null일 수 있음 — checkAuth()는 user 객체를 복원하지 않음
      // 로그인 플로우에서 user를 저장하는 로직이 추가되어야 함
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      this.loading = true;
      try {
        const response = await transactionService.getTransactions(
          userId,
          params,
        );
        // json-server v1 페이지네이션: { data: [...], items: N, pages: N }
        // v1이 아닌 경우(배열 직접 반환) 대비 fallback 처리
        let newItems, total;
        if (Array.isArray(response.data)) {
          newItems = response.data;
          total = response.data.length;
        } else {
          newItems = response.data.data ?? [];
          total = response.data.items ?? 0;
        }
        this.transactions = append
          ? [...this.transactions, ...newItems]
          : newItems;
        this.totalCount = total;
      } finally {
        this.loading = false;
      }
    },

    // 대시보드용 통계 가져오기
    async fetchMonthlyStats(userId, yearMonth) {
      this.loading = true;
      this.error = null;
      try {
        const stats = await transactionService.getMonthlyStats(
          userId,
          yearMonth,
        );
        this.monthlyStats = stats; // 성공하면 상태에 저장
      } catch (error) {
        // 서비스에서 던진 정제된 에러를 스토어 상태에 저장하고, UI로 다시 던짐
        this.error = error;
        console.error('[transactionStore.fetchMonthlyStats] failed:', error.message);
        
        throw error; // 여기서 에러를 던지고 DashboardPage.vue의 try-catch에서 잡음
      } finally {
        this.loading = false;
      }
    },

    // 거래 등록
    async addTransaction(transaction) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        throw new Error('로그인한 사용자 정보가 없습니다.');
      }

      this.loading = true;
      try {
        const savedTransaction = await transactionService.createTransaction(
          userId,
          transaction,
        );

        this.transactions = [savedTransaction, ...this.transactions];
        this.totalCount += 1;

        return savedTransaction;
      } catch (error) {
        console.error('[transactionStore.addTransaction] failed', {
          userId,
          transaction,
          message: error.message,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 거래 수정
    async updateTransaction(id, transaction) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        throw new Error('로그인한 사용자 정보가 없습니다.');
      }

      this.loading = true;
      try {
        const updatedTransaction = await transactionService.updateTransaction(
          id,
          {
            ...transaction,
            userId,
          },
        );

        this.transactions = this.transactions.map((item) =>
          String(item.id) === String(id) ? updatedTransaction : item,
        );

        if (
          this.selectedTransaction &&
          String(this.selectedTransaction.id) === String(id)
        ) {
          this.selectedTransaction = updatedTransaction;
        }

        return updatedTransaction;
      } catch (error) {
        console.error('[transactionStore.updateTransaction] failed', {
          id,
          userId,
          transaction,
          message: error.message,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 거래 삭제
    async deleteTransaction(id) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        throw new Error('로그인한 사용자 정보가 없습니다.');
      }

      this.loading = true;
      try {
        await transactionService.deleteTransaction(id);

        this.transactions = this.transactions.filter(
          (item) => String(item.id) !== String(id),
        );
        this.totalCount = Math.max(0, this.totalCount - 1);

        if (
          this.selectedTransaction &&
          String(this.selectedTransaction.id) === String(id)
        ) {
          this.selectedTransaction = null;
        }
      } catch (error) {
        console.error('[transactionStore.deleteTransaction] failed', {
          id,
          userId,
          message: error.message,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
