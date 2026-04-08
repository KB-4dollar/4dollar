<!-- <script setup>
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
  authStore.user = { id: "1", name: "박신형" };
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
  <PageSectionLayout title="대시보드">
    <div v-if="isLoading" class="flex justify-center py-20">
      <span class="text-text-secondary"> 재정 데이터를 분석 중입니다...</span>
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
        <div class="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-3 mb-2 gap-3 sm:gap-0">
          
          <h2 class="text-lg font-bold text-text-primary leading-none">{{ dashboardTitle }}</h2>

          <div class="flex gap-4">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTabComponent = tab.component"
              :class="[
                'text-sm font-bold transition-colors',
                currentTabComponent === tab.component
                  ? 'text-accent-ui' 
                  : 'text-text-muted hover:text-text-primary'
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <div class="text-right mb-6">
          <span class="text-xs text-text-muted">{{ currentYearMonth }} 기준</span>
        </div>
        
        <div class="h-[350px] w-full">
          <component :is="currentTabComponent" />
        </div>
      </SectionCard>
    </template>
  </PageSectionLayout>
</template>

<style scoped>
</style> -->


<script setup>
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';

// TODO: 개발이 완료되면 아래 컴포넌트들의 주석을 해제하고 import 합니다.
// import SummaryMentCard from '@/components/dashboard/SummaryMentCard.vue';
// import CompareBriefingCard from '@/components/dashboard/CompareBriefingCard.vue';
// import OverviewChart from '@/components/dashboard/OverviewChart.vue';
// import ConsumptionHeatmap from '@/components/dashboard/ConsumptionHeatmap.vue';
</script>

<template>
  <PageSectionLayout title="대시보드">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
      <SectionCard title="총 수입">
        <div class="flex h-32 items-center justify-center">
          <p class="text-text-secondary text-sm">총 지출 데이터 표시 부분입니다.</p>
        </div>
      </SectionCard>
      
      <SectionCard title="총 지출">
        <div class="flex h-32 items-center justify-center">
          <p class="text-text-secondary text-sm">총 수입 데이터 표시 부분입니다.</p>
        </div>
      </SectionCard>
      
      <SectionCard title="순수익">
        <div class="flex h-32 items-center justify-center">
          <p class="text-text-secondary text-sm">순수익 데이터 표시 부분입니다.</p>
        </div>
      </SectionCard>
    </div>

    <SectionCard title="소비 패턴 분석">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        <div class="flex min-h-[300px] items-center justify-center rounded-lg border border-line bg-surface-muted p-4">
          <p class="text-text-secondary text-sm">차트 컴포넌트 구현 부분입니다.</p>
        </div>
        
        <div class="flex min-h-[300px] items-center justify-center rounded-lg border border-line bg-surface-muted p-4">
          <p class="text-text-secondary text-sm">잔디형 소비 패턴 히트맵 구현 부분입니다.</p>
        </div>

      </div>
    </SectionCard>

  </PageSectionLayout>
</template>

<style scoped>
/* Tailwind 유틸리티 클래스를 사용하므로 추가 CSS는 최소화합니다. */
</style>