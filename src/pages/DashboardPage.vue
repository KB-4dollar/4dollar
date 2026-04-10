<script setup>
import { ref, shallowRef, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import { summaryService } from '@/api/services/summaryService';

import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import OverviewChart from '@/components/dashboard/OverviewChart.vue';
import IncomeChart from '@/components/dashboard/IncomeChart.vue';
import ExpenseChart from '@/components/dashboard/ExpenseChart.vue';
import FeedbackWidget from '@/components/dashboard/FeedbackWidget.vue';
import CalendarWidget from '@/components/dashboard/CalendarWidget.vue';
import GoalSpendingWidget from '@/components/dashboard/GoalSpending.vue';
import TransactionFormModal from '@/components/transaction/TransactionFormModal.vue';

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const topCategory = ref('');
const feedbackMessage = ref('');
const today = new Date();
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const currentTabComponent = shallowRef(OverviewChart);

const tabs = [
  { id: 'overview', name: '전체 요약', component: OverviewChart },
  { id: 'income', name: '수입 분석', component: IncomeChart },
  { id: 'expense', name: '지출 분석', component: ExpenseChart },
];

const stats = computed(() => transactionStore.monthlyStats);
const isLoading = computed(() => transactionStore.loading);
const dashboardTitle = computed(() => `${authStore.user?.name || '사용자'}님의 ${today.getMonth() + 1}월 소비`);
const isFormModalOpen = ref(false);

// DashboardPage.vue의 fetchStats 함수 부분을 아래와 같이 수정하세요.

async function fetchStats() {
  const userId = authStore.user?.id;
  if (!userId) return;
  
  try {
    // ✨ 1. 통계와 전체 내역을 동시에 요청 (로딩 상태를 한 번에 처리)
    await Promise.all([
      transactionStore.fetchMonthlyStats(userId, currentYearMonth),
      transactionStore.fetchTransactions({
        userId: userId,
        // 현재 달의 시작일과 종료일 계산
        date_gte: `${currentYearMonth}-01`,
        date_lte: `${currentYearMonth}-${new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()}`
      })
    ]);

    const category = await summaryService.getTopExpenseCategory(userId, currentYearMonth);
    topCategory.value = category || '지출 없음';
    feedbackMessage.value = summaryService.getRandomFeedback(category);
  } catch (error) { 
    console.error('데이터 로드 실패:', error); 
  }
}

watch(() => authStore.user?.id, (id) => { if (id) fetchStats(); }, { immediate: true });

function refreshFeedback() {
  feedbackMessage.value = summaryService.getRandomFeedback(topCategory.value === '지출 없음' ? null : topCategory.value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}
</script>

<template>
  <PageSectionLayout title="대시보드">
    <div v-if="isLoading" class="flex justify-center py-20 text-text-muted">데이터 분석 중...</div>

    <div v-else class="flex flex-col gap-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div class="flex flex-col gap-4 lg:col-span-1 h-[620px]">
          <SectionCard class="h-[100px] flex flex-col justify-center">
            <p class="text-xs font-medium text-text-secondary mb-1">총 수입</p>
            <p class="text-xl font-bold cherry-text">{{ formatCurrency(stats?.totals?.income) }} 원</p>
          </SectionCard>
          <SectionCard class="h-[100px] flex flex-col justify-center">
            <p class="text-xs font-medium text-text-secondary mb-1">총 지출</p>
            <p class="text-xl font-bold text-text-primary">{{ formatCurrency(stats?.totals?.expense) }} 원</p>
          </SectionCard>
          <SectionCard class="h-[100px] flex flex-col justify-center">
            <p class="text-xs font-medium text-text-secondary mb-1">순이익</p>
            <p class="text-xl font-bold text-text-primary">{{ formatCurrency(stats?.totals?.net) }} 원</p>
          </SectionCard>
          <GoalSpendingWidget />
        </div>

        <div class="lg:col-span-2">
          <CalendarWidget />
        </div>
      </div>

      <SectionCard class="p-0 overflow-hidden relative border-2 cherry-border cherry-bg shadow-sm min-h-[350px]">
        <div class="absolute -top-4 -left-4 text-8xl opacity-20 select-none pointer-events-none">🌸</div>
        <div class="absolute -bottom-8 -right-4 text-9xl opacity-20 select-none pointer-events-none">🌸</div>

        <div class="grid grid-cols-1 lg:grid-cols-2 relative z-10 h-full">
          
          <div class="flex flex-col p-8 lg:border-r cherry-border bg-transparent">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b cherry-border pb-4 mb-6 gap-3 sm:gap-0">
              <h3 class="text-base font-bold text-text-primary">{{ dashboardTitle }}</h3>
              <div class="flex gap-2">
                <button v-for="tab in tabs" :key="tab.id" @click="currentTabComponent = tab.component"
                  :class="['text-sm font-bold px-3 py-1.5 rounded-lg transition-colors', 
                    currentTabComponent === tab.component ? 'cherry-badge cherry-text' : 'text-text-muted hover:cherry-text']"
                >
                  {{ tab.name }}
                </button>
              </div>
            </div>
            <div class="h-[280px] w-full">
              <component :is="currentTabComponent" :stats="stats" />
            </div>
          </div>

          <div class="p-8 flex items-center justify-center h-full">
            <FeedbackWidget :top-category="topCategory" :feedback-message="feedbackMessage" @refresh="refreshFeedback" />
          </div>

        </div>
      </SectionCard>
    </div>
  </PageSectionLayout>

  <button class="fixed bottom-20 right-8 z-40 h-14 w-14 rounded-full bg-button-dark text-white shadow-lg transition-transform hover:scale-105" @click="isFormModalOpen = true">
    <span class="text-2xl">+</span>
  </button>
  <TransactionFormModal :open="isFormModalOpen" @close="isFormModalOpen = false" @saved="isFormModalOpen = false" />
</template>

<style scoped>
/* 🌸 벚꽃 테마 전용 디자인 토큰 준수 */
.cherry-bg { background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%); }
.cherry-border { border-color: #fbcfe8; }
.cherry-text { color: #db2777; }
.cherry-badge {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #fbcfe8;
  box-shadow: 0 2px 4px rgba(219, 39, 119, 0.05);
}
.hover\:cherry-text:hover { color: #db2777; }
</style>