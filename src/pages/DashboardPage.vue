<script setup>
// 1. import
import { shallowRef, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';

// 공통 컴포넌트 임포트
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';

// 대시보드 전용 컴포넌트 임포트 (DevGuide 규칙 준수)
import OverviewChart from '@/components/dashboard/OverviewChart.vue';
import IncomeChart from '@/components/dashboard/IncomeChart.vue';
import ExpenseChart from '@/components/dashboard/ExpenseChart.vue';

// 2. store/router
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// 4. reactive state
const today = new Date();
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// 탭 관리를 위한 상태 (shallowRef를 써서 컴포넌트 객체의 불필요한 반응성 오버헤드를 막음)
const currentTabComponent = shallowRef(OverviewChart);

const tabs = [
  { id: 'overview', name: '전체 요약', component: OverviewChart },
  { id: 'income', name: '수입 분석', component: IncomeChart },
  { id: 'expense', name: '지출 분석', component: ExpenseChart }
];

// 5. computed
const stats = computed(() => transactionStore.monthlyStats);
const isLoading = computed(() => transactionStore.loading);

const dashboardTitle = computed(() => {
  const userName = authStore.user?.name || '사용자';
  const currentMonth = today.getMonth() + 1;
  return `${userName}님의 ${currentMonth}월의 소비는`;
});

// 6. lifecycle hooks
watch(
  () => authStore.user?.id, 
  (newId) => {
    console.log("👀 유저 ID 변화 감지:", newId);
    if (newId) {
      fetchStats();
    }
  }, 
  { immediate: true } // 컴포넌트 로드 시 이미 로그인이 되어있다면 바로 실행
);

onMounted(() => {
  console.log("✅ 대시보드 마운트 완료");
  // authStore 에 user 저장 (회원가입 화면 구현 완료 후 주석 처리 예정)
  // authStore.user = { id: "1", name: "박신형" };
});

// 7. functions
// 선언 위치가 라이프사이클 아래로 내려갔으므로, 오류 방지를 위해 일반 함수로 선언
async function fetchStats() {
  const userId = authStore.user?.id ? String(authStore.user.id) : null;
  
  console.log("🔍 fetchStats 실행 시도 - 현재 유저ID:", userId); 

  if (userId) {
    console.log("🚀 트랜잭션 데이터 요청을 보냅니다! (대상 날짜: " + currentYearMonth + ")");
    await transactionStore.fetchMonthlyStats(userId, currentYearMonth);
  } else {
    console.warn("⚠️ 유저 ID가 없어서 요청을 보낼 수 없습니다.");
  }
}

// 숫자에 콤마 찍어주는 함수
function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}
</script>

<template>
  <PageSectionLayout>
    <div v-if="isLoading" class="flex justify-center py-20">
      <span class="text-text-secondary">재정 데이터를 분석 중입니다...</span>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        <SectionCard>
          <p class="mb-2 text-sm font-medium text-text-secondary">총 수입</p>
          <p class="text-2xl font-bold text-accent-ui">
            {{ formatCurrency(stats?.totals?.income) }}
            <span class="ml-0.5 text-sm font-normal text-text-muted">원</span>
          </p>
        </SectionCard>

        <SectionCard>
          <p class="mb-2 text-sm font-medium text-text-secondary">총 지출</p>
          <p class="text-2xl font-bold text-text-primary">
            {{ formatCurrency(stats?.totals?.expense) }}
            <span class="ml-0.5 text-sm font-normal text-text-muted">원</span>
          </p>
        </SectionCard>

        <SectionCard>
          <p class="mb-2 text-sm font-medium text-text-secondary">순이익</p>
          <p class="text-2xl font-bold text-text-primary">
            {{ formatCurrency(stats?.totals?.net) }}
            <span class="ml-0.5 text-sm font-normal text-text-muted">원</span>
          </p>
        </SectionCard>
      </div>

      <SectionCard>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-text-primary">{{ dashboardTitle }}</h2>
          <span class="text-xs text-text-muted">{{ currentYearMonth }} 기준</span>
        </div>

        <div class="flex gap-4 mb-6 border-b border-line">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTabComponent = tab.component"
            :class="[
              'pb-2 text-sm font-bold transition-colors border-b-2',
              currentTabComponent === tab.component
                ? 'border-accent-ui text-accent-ui' 
                : 'border-transparent text-text-muted hover:text-text-primary'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="h-[350px] w-full">
          <component :is="currentTabComponent" />
        </div>
      </SectionCard>
    </template>
  </PageSectionLayout>
</template>

<style scoped>
</style>
