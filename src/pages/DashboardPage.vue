<script setup>
// 1. import
import { onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';

// echarts 임포트 및 모듈 등록
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

// 2. store/router
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// 4. reactive state
// 현재 날짜 기준으로 월을 가져옴
const today = new Date();
const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

// 5. computed
const stats = computed(() => transactionStore.monthlyStats);
const isLoading = computed(() => transactionStore.loading);

const dashboardTitle = computed(() => {
  const userName = authStore.user?.name || '사용자';
  const currentMonth = today.getMonth() + 1;
  return `${userName}님의 ${currentMonth}월의 소비는`;
});

// 디자인 토큰 기반 차트 옵션 설정
const chartOption = computed(() => {
  const income = stats.value?.totals?.income || 0;
  const expense = stats.value?.totals?.expense || 0;

  return {
    tooltip: {
      trigger: 'item',
      // 문자열 대신 콜백 함수를 써서 formatCurrency를 적용
      formatter: (params) => {
        const formattedMoney = formatCurrency(params.value);
        return `${params.name}: <strong>${formattedMoney}원</strong> (${params.percent}%)`;
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemGap: 20,
      textStyle: { color: '#6b7280', fontSize: 13 } // --text-secondary
    },
    series: [
      {
        name: '재정 현황',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{d}%',
          color: '#111827' // --text-primary
        },
        labelLine: { show: true },
        data: [
          { value: income, name: '총 수입', itemStyle: { color: '#ee8567' } }, // --accent-ui
          { value: expense, name: '총 지출', itemStyle: { color: '#243047' } }  // --button-dark
        ]
      }
    ]
  };
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

      <!-- 추후 차트 부분은 별도의 컴포넌트로 분리 예정 -->
      <SectionCard>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-lg font-bold text-text-primary">{{ dashboardTitle }}</h2>
          <span class="text-xs text-text-muted">{{ currentYearMonth }} 기준</span>
        </div>
        
        <div class="h-[350px] w-full">
          <v-chart 
            v-if="stats?.totals?.income || stats?.totals?.expense"
            class="chart" 
            :option="chartOption" 
            autoresize 
          />
          <div v-else class="flex h-full flex-col items-center justify-center gap-2">
            <span class="text-4xl">📉</span>
            <span class="text-sm text-text-muted">표시할 거래 데이터가 없습니다.</span>
          </div>
        </div>
      </SectionCard>
    </template>
  </PageSectionLayout>
</template>

<style scoped>
</style>
