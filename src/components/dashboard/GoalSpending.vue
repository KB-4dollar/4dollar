<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import SectionCard from '@/components/common/SectionCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction'; 
import { storeToRefs } from 'pinia';

// --- [스토어 연동] ---
const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const { user } = storeToRefs(authStore);
// ✨ [수정] 스토어의 실제 Getter 이름인 totalExpense를 가져옵니다.
const { totalExpense } = storeToRefs(transactionStore);

// --- [데이터 설정] ---
// 목표 금액 (authStore)
const goalAmount = computed(() => user.value?.goalAmount || 0); 

// ✨ [수정] 현재 지출 (transactionStore의 totalExpense 게터와 연결)
const currentExpense = computed(() => totalExpense.value || 0);

// 🌟 [팝오버 상태 관리]
const isModalOpen = ref(false); 
const editAmount = ref(0); 

// 소비 퍼센트 계산
const percent = computed(() => {
  if (!goalAmount.value || goalAmount.value <= 0) return 0;
  return Math.min(Math.round((currentExpense.value / goalAmount.value) * 100), 100);
});

// 남은 예산 계산
const remainingAmount = computed(() => goalAmount.value - currentExpense.value);

// --- [ECharts 로직: 콤팩트 디자인] ---
const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  
  const option = {
    series: [{
      type: 'gauge',
      center: ['50%', '50%'],
      startAngle: 210,
      endAngle: -150,
      radius: '100%',
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#fbcfe8' },
            { offset: 1, color: '#db2777' }
          ])
        }
      },
      axisLine: { lineStyle: { width: 12, color: [[1, '#f3f4f6']] } }, 
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      data: [{ value: percent.value }],
      detail: {
        offsetCenter: [0, '10%'],
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 24,
        fontWeight: '800',
        color: '#db2777'
      }
    }]
  };
  chartInstance.setOption(option);
};

const handleResize = () => chartInstance?.resize();


onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

// 퍼센트 변화 감시 및 차트 업데이트
watch(percent, (newVal) => {
  chartInstance?.setOption({ series: [{ data: [{ value: newVal }] }] });
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

// --- [팝오버 로직] ---
const openModal = () => {
  editAmount.value = goalAmount.value;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveGoal = () => {
  const amount = Number(editAmount.value);
  if (!isNaN(amount) && amount >= 0) {
    authStore.updateGoalAmount(amount);
  }
  closeModal();
};
</script>

<template>
  <SectionCard class="h-[320px] p-8 flex flex-col relative overflow-visible shadow-sm">
    <div class="flex justify-between items-start mb-6 border-b border-line/30 pb-4 shrink-0">
      <div class="flex flex-col items-start gap-1">
        <span class="text-xs font-bold text-text-muted uppercase tracking-wider">이번 달 목표 지출</span>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-extrabold text-text-primary">{{ formatCurrency(goalAmount) }}</span>
          <span class="text-base font-bold text-text-primary">원</span>
        </div>
      </div>
      <div class="pt-1">
        <button @click="openModal" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors border border-pink-100 shadow-sm">
          <span class="text-xs cherry-text font-bold">수정</span>
        </button>
      </div>
    </div>

    <div class="flex flex-1 items-center gap-6"> 
      <div class="flex-[1.2] h-full flex justify-center items-center relative">
        <div ref="chartRef" class="w-full h-full"></div>
      </div>
      <div class="flex-1 flex flex-col justify-center gap-6 pl-6"> 
        <div class="flex flex-col items-start gap-1">
          <span class="text-[11px] font-bold text-text-muted">현재 지출</span>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-extrabold text-text-primary">{{ formatCurrency(currentExpense) }}</span>
            <span class="text-sm font-bold text-text-primary">원</span>
          </div>
        </div>
        <div class="flex flex-col items-start gap-1">
          <span class="text-[11px] font-bold text-text-muted">남은 예산</span>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-extrabold" :class="remainingAmount < 0 ? 'text-red-500' : 'cherry-text'">
              {{ formatCurrency(remainingAmount) }}
            </span>
            <span class="text-sm font-bold" :class="remainingAmount < 0 ? 'text-red-500' : 'cherry-text'">원</span>
          </div>
        </div>
      </div>
    </div>

    <transition name="pop">
      <div v-if="isModalOpen" class="absolute top-[20px] right-[20px] z-[50] w-[280px] bg-white rounded-2xl shadow-2xl border border-pink-100 p-5">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-sm font-bold text-text-primary">🎯 목표 수정</h4>
          <button @click="closeModal" class="text-lg leading-none text-text-muted hover:text-pink-500">&times;</button>
        </div>
        <div class="flex flex-col gap-2 mb-5">
          <div class="relative">
            <input type="number" v-model="editAmount" @keyup.enter="saveGoal" class="w-full bg-surface-muted px-3 py-2.5 rounded-xl border border-line focus:border-[#db2777] outline-none text-right font-bold text-lg pr-8" />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">원</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="closeModal" class="flex-1 py-2 text-xs font-bold bg-surface-muted rounded-lg hover:bg-line transition-colors text-text-secondary">취소</button>
          <button @click="saveGoal" class="flex-1 py-2 text-xs font-bold bg-[#db2777] text-white rounded-lg shadow-md hover:bg-[#c2185b] transition-all">저장</button>
        </div>
      </div>
    </transition>
  </SectionCard>
</template>

<style scoped>
/* 이전과 동일한 스타일 유지 */
.cherry-text { color: #db2777; }
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
.pop-enter-active { animation: pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { animation: pop-in 0.15s reverse ease-in; }
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.9) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
:deep(.section-card) { overflow: visible !important; }
</style>