<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();

// --- [공통 데이터 및 날짜 설정] ---
const days = ['일', '월', '화', '수', '목', '금', '토'];
const viewMode = ref('MONTH'); 
const selectedDayData = ref(null);
const scrollContainer = ref(null);

const today = new Date();
const currentYear = 2026;
const currentMonth = 4;

// --- [핵심 로직: 데이터 가공 및 타입 체크] ---

// ✨ 수입 여부를 판단하는 공통 함수 (대소문자 및 한글 대응)
const isIncome = (type) => {
  const t = String(type).toLowerCase();
  return t === 'income' || t === '수입';
};

const dailyMap = computed(() => {
  const map = {};
  const list = transactionStore.transactions || [];
  
  list.forEach(tx => {
    const dateKey = tx.date ? String(tx.date).split('T')[0] : '';
    if (!dateKey) return;
    
    if (!map[dateKey]) {
      map[dateKey] = { expense: 0, transactions: [] };
    }
    
    // 지출일 때만 히트맵 합산에 포함
    const t = String(tx.type).toLowerCase();
    if (t === 'expense' || t === '지출') {
      map[dateKey].expense += Number(tx.amount || 0);
    }
    map[dateKey].transactions.push(tx);
  });
  return map;
});

const calendarGrid = computed(() => {
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const grid = Array(firstDayOfWeek).fill(null);

  for (let i = 1; i <= lastDay; i++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayData = dailyMap.value[dateStr] || { expense: 0, transactions: [] };
    
    grid.push({
      day: i,
      date: dateStr,
      hasTransactions: dayData.transactions.length > 0,
      spendingLevel: calculateLevel(dayData.expense),
      transactions: dayData.transactions
    });
  }
  return grid;
});

function calculateLevel(amount) {
  if (amount <= 0) return 0;
  if (amount < 20000) return 1;
  if (amount < 70000) return 2;
  return 3;
}

// --- [인터랙션 로직] ---
const scrollToActiveDate = async () => {
  await nextTick();
  if (scrollContainer.value && selectedDayData.value) {
    const activeItem = scrollContainer.value.querySelector('.active-date');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
};

const selectDay = (dayData) => {
  if (!dayData) return;
  selectedDayData.value = dayData;
  viewMode.value = 'DAY';
};

const goBackToMonth = () => { viewMode.value = 'MONTH'; };

const getHeatmapClass = (level) => {
  switch (level) {
    case 1: return 'bg-[#db2777]/20'; 
    case 2: return 'bg-[#db2777]/40'; 
    case 3: return 'bg-[#db2777]/70'; 
    default: return 'bg-surface'; 
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(value || 0));
}

watch(viewMode, (newMode) => { if (newMode === 'DAY') scrollToActiveDate(); });

watch(calendarGrid, (newGrid) => {
  if (newGrid.length > 0 && !selectedDayData.value) {
    const todayStr = `${currentYear}-04-${String(today.getDate()).padStart(2, '0')}`;
    const found = newGrid.find(d => d?.date === todayStr);
    if (found) selectedDayData.value = found;
  }
}, { immediate: true });
</script>

<template>
  <div class="relative flex flex-col bg-surface rounded-2xl border border-line p-5 shadow-sm h-[620px] overflow-hidden">
    
    <div class="flex items-center justify-between mb-6 pb-2 border-b border-line shrink-0">
      <h2 class="text-xl font-bold text-text-primary flex items-center gap-2.5">
        <span class="text-3xl">🌸</span> {{ currentYear }}년 {{ currentMonth }}월
      </h2>
      <button v-if="viewMode === 'DAY'" @click="goBackToMonth"
        class="px-4 py-1.5 rounded-lg bg-surface-muted border border-line text-sm font-bold text-text-secondary hover:bg-line transition-colors">
        달력 보기
      </button>
    </div>

    <div v-if="viewMode === 'MONTH'" class="flex flex-col flex-1 animate-fade-in">
      <div class="grid grid-cols-7 mb-3">
        <div v-for="(day, index) in days" :key="day" class="text-center text-sm font-bold py-2 text-text-muted">
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2 flex-1">
        <template v-for="(dayData, index) in calendarGrid" :key="index">
          <div v-if="dayData" @click="selectDay(dayData)"
            class="min-h-[70px] aspect-square p-1.5 rounded-xl border border-line relative flex flex-col items-start transition-all cursor-pointer hover:border-[#db2777]"
            :class="[getHeatmapClass(dayData.spendingLevel), dayData.day === today.getDate() ? 'ring-2 ring-line shadow-sm' : '']">
            <span class="text-base font-semibold ml-1.5 mt-1" :class="dayData.hasTransactions ? 'text-[#db2777]' : 'text-text-secondary'">{{ dayData.day }}</span>
          </div>
          <div v-else class="min-h-[70px] aspect-square"></div>
        </template>
      </div>
    </div>

    <div v-else class="flex flex-col flex-1 animate-slide-up overflow-hidden">
      <div ref="scrollContainer" class="flex overflow-x-auto gap-3 pt-2 pb-5 px-2 no-scrollbar shrink-0 border-b border-line/70">
        <template v-for="dayData in calendarGrid.filter(d => d !== null)" :key="dayData.date">
          <div @click="selectedDayData = dayData"
            class="flex flex-col items-center justify-center min-w-[62px] h-[65px] rounded-xl border transition-all cursor-pointer shrink-0 py-2"
            :class="[selectedDayData?.date === dayData.date ? 'active-date bg-[#db2777] border-[#db2777] text-white shadow-lg scale-105' : 'bg-surface border-line text-text-muted']">
            <span class="text-[10px] font-medium mb-0.5 opacity-80 uppercase leading-none">{{ days[new Date(dayData.date).getDay()] }}</span>
            <span class="text-base font-bold leading-none">{{ dayData.day }}</span>
            <div class="h-1.5 flex items-center justify-center mt-0.5">
              <span v-if="dayData.hasTransactions" class="inline-block w-1 h-1 rounded-full" :class="selectedDayData?.date === dayData.date ? 'bg-white' : 'bg-[#db2777]'"></span>
            </div>
          </div>
        </template>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar bg-surface-muted/30 rounded-2xl border border-line p-6 shadow-inner mt-4">
        <div class="flex items-center justify-between mb-6 pb-2 border-b border-line">
          <h3 class="text-lg font-bold text-text-primary">📅 {{ currentMonth }}월 {{ selectedDayData?.day }}일 내역</h3>
          <span class="text-sm font-medium text-text-muted">총 {{ selectedDayData?.transactions?.length || 0 }}건</span>
        </div>

        <div v-if="selectedDayData?.hasTransactions" class="flex flex-col gap-3 pb-4">
          <div v-for="(tx, i) in selectedDayData.transactions" :key="i" class="flex items-center justify-between bg-surface p-4 rounded-xl border border-line shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col gap-0.5 text-left">
              <span class="text-sm font-bold text-text-primary">
                {{ tx.category || (isIncome(tx.type) ? '수입' : '기타') }}
              </span>
              <span v-if="tx.memo" class="text-[11px] text-text-muted leading-tight">
                {{ tx.memo }}
              </span>
            </div>
            
            <div class="flex items-center gap-3 font-bold" 
                 :class="isIncome(tx.type) ? 'cherry-text' : 'text-text-primary'">
              {{ isIncome(tx.type) ? '+' : '-' }}{{ formatCurrency(tx.amount) }}원
            </div>
          </div>
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center py-10 text-text-muted opacity-60">
          <p class="text-sm italic">이날은 기록된 내역이 없어요. 🍃</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cherry-text { color: #db2777; } /* 분홍색 클래스 확인 */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 4px; }
</style>