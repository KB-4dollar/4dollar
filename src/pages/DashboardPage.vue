<script setup>
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

// TODO: 개발이 완료되면 아래 명언 위젯 컴포넌트의 주석을 해제하고 우측 영역에 교체합니다.
// import SummaryMentCard from '@/components/dashboard/SummaryMentCard.vue';

// 2. store setup
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// 3. reactive state
const today = new Date();
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// 탭 관리를 위한 상태 (shallowRef를 써서 컴포넌트 객체의 불필요한 반응성 오버헤드를 막음)
const currentTabComponent = shallowRef(OverviewChart);

const tabs = [
  { id: 'overview', name: '전체 요약', component: OverviewChart },
  { id: 'income', name: '수입 분석', component: IncomeChart },
  { id: 'expense', name: '지출 분석', component: ExpenseChart }
];

// 4. computed
const stats = computed(() => transactionStore.monthlyStats);
const isLoading = computed(() => transactionStore.loading);

const dashboardTitle = computed(() => {
  const userName = authStore.user?.name || '사용자';
  const currentMonth = today.getMonth() + 1;
  return `${userName}님의 ${currentMonth}월 소비`;
});

// 5. lifecycle hooks
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

// 6. functions
async function fetchStats() {
  const userId = authStore.user?.id ? String(authStore.user.id) : null;
  
  console.log("🔍 fetchStats 실행 시도 - 현재 유저ID:", userId); 

  if (userId) {
    console.log("🚀 트랜잭션 데이터 요청 (대상 날짜: " + currentYearMonth + ")");
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

      <SectionCard title="소비 패턴 분석">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
          
          <div class="flex flex-col rounded-lg border border-line p-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-3 mb-3 gap-3 sm:gap-0">
              <h3 class="text-base font-bold text-text-primary">{{ dashboardTitle }}</h3>

              <div class="flex gap-3">
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

            <div class="text-right mb-4">
              <span class="text-xs text-text-muted">{{ currentYearMonth }} 기준</span>
            </div>
            
            <div class="h-[280px] w-full">
              <component :is="currentTabComponent" />
            </div>
          </div>

          <div class="relative flex flex-col min-h-[300px] items-center justify-center rounded-lg border border-line bg-surface-muted p-6">
            <button class="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 1 0 2.13-5.85L21 8"></path>
              </svg>
            </button>

            <div class="text-center">
              <span class="inline-block px-2 py-1 mb-4 text-xs font-bold rounded-full bg-line text-text-secondary">
                💡 이번 달 팩폭 알림
              </span>
              <p class="text-lg md:text-xl font-bold text-text-primary leading-relaxed break-keep">
                "카페인 중독이 의심되네요.<br/>텀블러와 친해져 보는 건 어떨까요?"
              </p>
              <p class="mt-4 text-sm text-text-muted">가장 지출이 큰 카테고리: <strong class="text-text-secondary">식비</strong></p>
            </div>
          </div>

        </div>
      </SectionCard>
    </template>
  </PageSectionLayout>
</template>

<style scoped>
/* Tailwind 유틸리티를 활용하므로 추가 CSS 작성 생략 */
</style>