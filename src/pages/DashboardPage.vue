<script setup>
import { ref, shallowRef, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import { summaryService } from '@/api/services/summaryService';

// 공통 컴포넌트 임포트
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';

// 대시보드 전용 컴포넌트 임포트 (DevGuide 규칙 준수)
import OverviewChart from '@/components/dashboard/OverviewChart.vue';
import IncomeChart from '@/components/dashboard/IncomeChart.vue';
import ExpenseChart from '@/components/dashboard/ExpenseChart.vue';

//빠른 추가 모달
import TransactionFormModal from '@/components/transaction/TransactionFormModal.vue';

// TODO: 개발이 완료되면 아래 명언 위젯 컴포넌트의 주석을 해제하고 우측 영역에 교체합니다.
// import SummaryMentCard from '@/components/dashboard/SummaryMentCard.vue';

// 2. store setup
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// 3. reactive state
const topCategory = ref('');
const feedbackMessage = ref('');
// 에러 메시지를 화면에 띄우기 위한 상태 변수
const errorMessage = ref('');

const today = new Date();
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// 탭 관리를 위한 상태 (shallowRef를 써서 컴포넌트 객체의 불필요한 반응성 오버헤드를 막음)
const currentTabComponent = shallowRef(OverviewChart);

const tabs = [
  { id: 'overview', name: '전체 요약', component: OverviewChart },
  { id: 'income', name: '수입 분석', component: IncomeChart },
  { id: 'expense', name: '지출 분석', component: ExpenseChart },
];

// 4. computed
const stats = computed(() => transactionStore.monthlyStats);
const isLoading = computed(() => transactionStore.loading);

const dashboardTitle = computed(() => {
  const userName = authStore.user?.name || '사용자';
  const currentMonth = today.getMonth() + 1;
  return `${userName}님의 ${currentMonth}월 소비`;
});

// 빠른 추가 모달
const isFormModalOpen = ref(false);

async function fetchStats() {
  const userId = authStore.user?.id ? String(authStore.user.id) : null;

  if (!userId) {
    console.warn('⚠️ 유저 ID가 없어서 요청을 보낼 수 없습니다.');
    return;
  }

  // [리팩토링] 스토어와 서비스의 호출을 try-catch로 감쌉니다.
  try {
    errorMessage.value = ''; // 요청 시작 전 에러 초기화

    // 1. 차트용 전체 통계 데이터 요청 (에러가 나면 여기서 throw 됨)
    await transactionStore.fetchMonthlyStats(userId, currentYearMonth);

    // 2. 팩폭 위젯 데이터 연동
    const category = await summaryService.getTopExpenseCategory(
      userId,
      currentYearMonth,
    );
    topCategory.value = category || '지출 없음';
    feedbackMessage.value = summaryService.getRandomFeedback(category);
  } catch (error) {
    // [리팩토링] 스토어에서 던진 에러(D001 등)를 여기서 낚아챔
    console.error('대시보드 데이터 로딩 실패:', error);

    // 사용자에게 보여줄 에러 메시지 세팅 (alert 대신 화면에 우아하게 띄우기 위함)
    errorMessage.value =
      error.message || '데이터를 불러오는 중 문제가 발생했습니다.';

    //alert를 띄우기
    alert(errorMessage.value);
  }
}

// 5. lifecycle hooks
watch(
  () => authStore.user?.id,
  (newId) => {
    console.log('👀 유저 ID 변화 감지:', newId);
    if (newId) {
      fetchStats();
    }
  },
  { immediate: true }, // 컴포넌트 로드 시 이미 로그인이 되어있다면 바로 실행
);

onMounted(() => {
  console.log('✅ 대시보드 마운트 완료');
  // authStore 에 user 저장 (회원가입 화면 구현 완료 후 주석 처리 예정)
  // authStore.user = { id: "1", name: "박신형" };
});

// 6. functions

// ✨ 위젯 새로고침 버튼 클릭 시 실행할 함수 (카테고리는 유지하고 멘트만 다시 뽑기)
function refreshFeedback() {
  const categoryForRefresh =
    topCategory.value === '지출 없음' ? null : topCategory.value;

  // 디버깅용: 현재 어떤 카테고리로 멘트를 찾고 있는지 콘솔 확인
  console.log('🔄 새로고침 시도 카테고리:', categoryForRefresh);

  let newMessage = summaryService.getRandomFeedback(categoryForRefresh);

  // 멘트 풀이 여러 개일 경우, 이전 멘트와 똑같은 게 나오면 다를 때까지 다시 뽑기
  let attempts = 0;
  while (newMessage === feedbackMessage.value && attempts < 5) {
    newMessage = summaryService.getRandomFeedback(categoryForRefresh);
    attempts++;
  }

  feedbackMessage.value = newMessage;
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

    <div v-else>
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
          <div class="flex flex-col rounded-lg border border-line p-4">
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-3 mb-3 gap-3 sm:gap-0"
            >
              <h3 class="text-base font-bold text-text-primary">
                {{ dashboardTitle }}
              </h3>

              <div class="flex gap-3">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="currentTabComponent = tab.component"
                  :class="[
                    'text-sm font-bold transition-colors',
                    currentTabComponent === tab.component
                      ? 'text-accent-ui'
                      : 'text-text-muted hover:text-text-primary',
                  ]"
                >
                  {{ tab.name }}
                </button>
              </div>
            </div>

            <div class="h-[280px] w-full">
              <component :is="currentTabComponent" :stats="stats" />
            </div>
          </div>

          <div
            class="cherry-bg cherry-border relative flex flex-col min-h-[300px] items-center justify-center rounded-2xl border p-6 overflow-hidden shadow-sm"
          >
            <div
              class="absolute -top-4 -left-4 text-7xl opacity-20 select-none pointer-events-none"
            >
              🌸
            </div>
            <div
              class="absolute -bottom-6 -right-2 text-8xl opacity-20 select-none pointer-events-none"
            >
              🌸
            </div>

            <button
              type="button"
              @click="refreshFeedback"
              class="cherry-spin cherry-text-light hover:cherry-text cherry-icon-bg absolute top-4 right-4 transition-all z-10 p-2 rounded-full text-xl leading-none"
              title="다른 팩폭 보기"
            >
              🌸
            </button>

            <div
              class="text-center z-10 relative flex flex-col items-center w-full"
            >
              <span
                class="cherry-badge cherry-text inline-block px-4 py-1.5 mb-6 text-xs font-bold rounded-full"
              >
                🌸 이번 달 팩폭 알림
              </span>

              <div class="relative px-6 w-full">
                <span
                  class="cherry-quote absolute -top-4 left-0 text-5xl leading-none"
                  >"</span
                >
                <p
                  class="text-lg md:text-xl font-bold text-text-primary leading-relaxed break-keep relative z-10"
                >
                  {{ feedbackMessage }}
                </p>
                <span
                  class="cherry-quote absolute -bottom-8 right-0 text-5xl leading-none rotate-180"
                  >"</span
                >
              </div>

              <div
                class="mt-8 inline-block bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white shadow-sm"
              >
                <p class="text-sm text-text-muted">
                  가장 지출이 큰 카테고리:
                  <strong class="cherry-text font-extrabold">{{
                    topCategory
                  }}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  </PageSectionLayout>

  <!-- float 버튼 -->
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
/* 🌸 벚꽃 테마 전용 디자인 토큰 (Style Guide 준수: HTML 내 하드코딩 지양) */
.cherry-bg {
  background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
}
.cherry-border {
  border-color: #fbcfe8;
}
.cherry-text {
  color: #db2777; /* 포인트 진한 핑크 */
}
.cherry-text-light {
  color: #f472b6; /* 보조 연한 핑크 */
}
.hover\:cherry-text:hover {
  color: #db2777;
}
.cherry-icon-bg:hover {
  background-color: rgba(255, 255, 255, 0.7);
}
.cherry-badge {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #fbcfe8;
  box-shadow: 0 2px 4px rgba(219, 39, 119, 0.05);
}
.cherry-quote {
  color: #fce7f3; /* 배경에 깔리는 연한 핑크색 따옴표 */
  font-family: Georgia, serif;
}
/* 🌸 [추가] 벚꽃 새로고침 버튼 빙글빙글 애니메이션 정의 */
@keyframes spin-cherry {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cherry-spin {
  display: inline-block; /* 회전 애니메이션이 잘 작동하도록 설정 */
  transform-origin: center center; /* 중앙을 기준으로 회전 */
}

/* 호버 시 애니메이션 실행 */
.cherry-spin:hover {
  animation: spin-cherry 1s linear infinite; /* 1초 동안 무한히 회전 */
}

/* 기존 스크롤바 스타일 유지 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--line);
  border-radius: 4px;
}
</style>
