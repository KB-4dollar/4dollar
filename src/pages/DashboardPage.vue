<script setup>
import { ref, shallowRef, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import { summaryService } from '@/api/services/summaryService';

// 공통 컴포넌트 임포트
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';

// 대시보드 전용 컴포넌트 임포트
import OverviewChart from '@/components/dashboard/OverviewChart.vue';
import IncomeChart from '@/components/dashboard/IncomeChart.vue';
import ExpenseChart from '@/components/dashboard/ExpenseChart.vue';
import FeedbackWidget from '@/components/dashboard/FeedbackWidget.vue';

// ✨ [추가] 우리가 만든 캘린더 컴포넌트 임포트!
import CalendarWidget from '@/components/dashboard/CalendarWidget.vue';

// 빠른 추가 모달
import TransactionFormModal from '@/components/transaction/TransactionFormModal.vue';

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const topCategory = ref('');
const feedbackMessage = ref('');
const errorMessage = ref('');

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

const dashboardTitle = computed(() => {
  const userName = authStore.user?.name || '사용자';
  const currentMonth = today.getMonth() + 1;
  return `${userName}님의 ${currentMonth}월 소비`;
});

const isFormModalOpen = ref(false);

async function fetchStats() {
  const userId = authStore.user?.id ? String(authStore.user.id) : null;
  if (!userId) return;

  try {
    errorMessage.value = '';
    await transactionStore.fetchMonthlyStats(userId, currentYearMonth);
    const category = await summaryService.getTopExpenseCategory(userId, currentYearMonth);
    topCategory.value = category || '지출 없음';
    feedbackMessage.value = summaryService.getRandomFeedback(category);
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
    alert(error.message || '데이터 로딩 중 문제가 발생했습니다.');
  }
}

watch(
  () => authStore.user?.id,
  (newId) => { if (newId) fetchStats(); },
  { immediate: true },
);

function refreshFeedback() {
  const categoryForRefresh = topCategory.value === '지출 없음' ? null : topCategory.value;
  let newMessage = summaryService.getRandomFeedback(categoryForRefresh);
  feedbackMessage.value = newMessage;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}
</script>

<template>
  <PageSectionLayout>
    <div v-if="isLoading" class="flex justify-center py-20">
      <span class="text-text-secondary">재정 데이터를 분석 중입니다...</span>
    </div>

    <div v-else class="flex flex-col gap-6">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="flex flex-col gap-4 lg:col-span-1">
          <SectionCard>
            <p class="mb-2 text-sm font-medium text-text-secondary">총 수입</p>
            <p class="text-2xl font-bold text-accent-ui">
              {{ formatCurrency(stats?.totals?.income) }} 원
            </p>
          </SectionCard>

          <SectionCard>
            <p class="mb-2 text-sm font-medium text-text-secondary">총 지출</p>
            <p class="text-2xl font-bold text-text-primary">
              {{ formatCurrency(stats?.totals?.expense) }} 원
            </p>
          </SectionCard>

          <SectionCard>
            <p class="mb-2 text-sm font-medium text-text-secondary">순이익</p>
            <p class="text-2xl font-bold text-text-primary">
              {{ formatCurrency(stats?.totals?.net) }} 원
            </p>
          </SectionCard>
        </div>

        <div class="lg:col-span-2">
          <CalendarWidget />
        </div>
      </div>

      <SectionCard>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
          <div class="flex flex-col rounded-lg border border-line p-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-3 mb-3 gap-3 sm:gap-0">
              <h3 class="text-base font-bold text-text-primary">{{ dashboardTitle }}</h3>
              <div class="flex gap-3">
                <button
                  v-for="tab in tabs" :key="tab.id"
                  @click="currentTabComponent = tab.component"
                  :class="['text-sm font-bold transition-colors', currentTabComponent === tab.component ? 'text-accent-ui' : 'text-text-muted hover:text-text-primary']"
                >
                  {{ tab.name }}
                </button>
              </div>
            </div>
            <div class="h-[280px] w-full">
              <component :is="currentTabComponent" :stats="stats" />
            </div>
          </div>

          <FeedbackWidget 
            :top-category="topCategory" 
            :feedback-message="feedbackMessage" 
            @refresh="refreshFeedback" 
          />
        </div>
      </SectionCard>
    </div>
  </PageSectionLayout>

  <button
    class="fixed bottom-20 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-button-dark text-button-dark-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
    @click="isFormModalOpen = true"
  >
    <span class="text-2xl font-light leading-none">+</span>
  </button>

  <TransactionFormModal
    :open="isFormModalOpen"
    @close="isFormModalOpen = false"
    @saved="isFormModalOpen = false"
  />
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
</style>