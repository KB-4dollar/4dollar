<script setup>
import { ref, onMounted } from 'vue';

// --- [공통 데이터] ---
const days = ['일', '월', '화', '수', '목', '금', '토'];
const currentYear = 2026;
const currentMonth = 4;
const today = 19; // 오늘 날짜 가정

// --- [상태 관리] ---
// 'MONTH' (V1 그리드) 또는 'DAY' (V2 가로스크롤 상세)
const viewMode = ref('MONTH'); 
const selectedDayData = ref(null);

// --- [더미 데이터] ---
const dummyMonthData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  let spendingLevel = 0; 
  let hasTransactions = false;
  let transactions = [];

  // 특정 날짜 데이터 주입 (5일, 10일, 19일 등)
  if ([5, 10, 15, 19, 25].includes(day)) {
    hasTransactions = true; 
    spendingLevel = day === 5 || day === 25 ? 3 : 2;
    transactions = [
      { type: '지출', category: '🍽️ 식비', amount: 8500, description: '점심 식사' },
      { type: '지출', category: '☕ 카페', amount: 4500, description: '아메리카노' }
    ];
  }
  return { day, spendingLevel, hasTransactions, transactions };
});

const emptySlots = Array(3).fill(null);
const calendarGrid = [...emptySlots, ...dummyMonthData];

// --- [함수 로직] ---

// 1. 날짜 클릭 시 (V1 -> V2 전환)
const selectDay = (dayData) => {
  if (!dayData) return;
  selectedDayData.value = dayData;
  viewMode.value = 'DAY'; // V2 모드로 전환
};

// 2. 닫기 클릭 시 (V2 -> V1 복귀)
const goBackToMonth = () => {
  viewMode.value = 'MONTH';
};

// 3. 유틸리티
const getHeatmapClass = (level) => {
  switch (level) {
    case 1: return 'bg-[#db2777]/10'; 
    case 2: return 'bg-[#db2777]/30'; 
    case 3: return 'bg-[#db2777]/60'; 
    default: return 'bg-surface'; 
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}

// 초기 로딩 시 오늘 날짜 세팅 (기획대로)
onMounted(() => {
  const todayData = dummyMonthData.find(d => d.day === today);
  selectedDayData.value = todayData;
});
</script>

<template>
  <div class="relative flex flex-col bg-surface rounded-2xl border border-line p-5 shadow-sm h-[620px] overflow-hidden transition-all duration-300">
    
    <div class="flex items-center justify-between mb-6 pb-2 border-b border-line shrink-0">
      <h2 class="text-xl font-bold text-text-primary flex items-center gap-2.5">
        <span class="text-3xl">🌸</span> {{ currentYear }}년 {{ currentMonth }}월
      </h2>
      <button 
        v-if="viewMode === 'DAY'"
        @click="goBackToMonth"
        class="px-4 py-1.5 rounded-lg bg-surface-muted border border-line text-sm font-bold text-text-secondary hover:bg-line transition-colors"
      >
        달력 보기
      </button>
    </div>

    <div v-if="viewMode === 'MONTH'" class="flex flex-col flex-1 animate-fade-in">
      <div class="grid grid-cols-7 mb-3">
        <div v-for="(day, index) in days" :key="day" class="text-center text-sm font-bold py-2" :class="index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-text-muted'">
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-2 flex-1">
        <template v-for="(dayData, index) in calendarGrid" :key="dayData ? 'day-'+dayData.day : 'empty-'+index">
          <div 
            v-if="dayData"
            @click="selectDay(dayData)"
            class="min-h-[70px] aspect-[1/1] p-1.5 rounded-xl border border-line relative flex flex-col justify-between transition-all cursor-pointer select-none hover:border-[#db2777]"
            :class="[getHeatmapClass(dayData.spendingLevel), dayData.day === today ? 'ring-2 ring-line shadow-sm' : '']"
          >
            <span class="text-base font-semibold ml-1.5 mt-1" :class="dayData.day === today ? 'text-[#db2777]' : 'text-text-secondary'">{{ dayData.day }}</span>
            
            </div>
          <div v-else class="min-h-[70px] aspect-[1/1]"></div>
        </template>
      </div>
    </div>

    <div v-else class="flex flex-col flex-1 animate-slide-up overflow-hidden">
      
      <div class="flex overflow-x-auto gap-4 pt-2 pb-6 px-2 custom-scrollbar no-scrollbar scroll-smooth shrink-0 border-b border-line/70">
        <div 
          v-for="dayData in dummyMonthData" 
          :key="'scroll-'+dayData.day"
          @click="selectedDayData = dayData"
          class="flex flex-col items-center justify-center min-w-[65px] h-[65px] rounded-2xl border transition-all cursor-pointer select-none shrink-0"
          :class="[
            selectedDayData?.day === dayData.day 
              ? 'bg-[#db2777] border-[#db2777] text-white shadow-lg scale-110' 
              : 'bg-surface border-line text-text-muted hover:border-[#db2777]'
          ]"
        >
          <span class="text-xs mb-1 opacity-70">{{ days[(dayData.day + 2) % 7] }}</span>
          <span class="text-lg font-bold">{{ dayData.day }}</span>
          
          <div v-if="dayData.hasTransactions" class="mt-1">
            <span class="w-1 h-1 rounded-full" :class="selectedDayData?.day === dayData.day ? 'bg-white' : 'bg-[#db2777]'"></span>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar bg-surface-muted/30 rounded-2xl border border-line p-6 shadow-inner mt-4">
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-line">
          <h3 class="text-lg font-bold text-text-primary">
            📅 {{ currentMonth }}월 {{ selectedDayData?.day }}일 내역
          </h3>
          <span class="text-sm font-medium text-text-muted">총 {{ selectedDayData?.transactions.length || 0 }}건</span>
        </div>

        <div v-if="selectedDayData?.hasTransactions" class="flex flex-col gap-3 pb-4">
          <div v-for="(tx, i) in selectedDayData.transactions" :key="i" class="flex items-center justify-between bg-surface p-4 rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col gap-1">
              <span class="text-sm font-bold text-text-primary">{{ tx.description }}</span>
              <span class="text-xs text-text-muted">{{ tx.category }}</span>
            </div>
            <div class="flex items-center gap-3 font-bold text-text-primary">
              -{{ formatCurrency(tx.amount) }}원
              <div class="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center border border-line text-xs">💳</div>
            </div>
          </div>
        </div>

        <div v-else class="h-full flex flex-col items-center justify-center py-10 text-text-muted opacity-60">
          <span class="text-4xl mb-3">🍃</span>
          <p class="text-sm">이날은 기록된 내역이 없어요.</p>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
/* 가로 스크롤바 숨기기 (더 깔끔한 UI를 위해) */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* 애니메이션 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
</style>