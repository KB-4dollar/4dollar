<script setup>
// 1. import
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { cn } from '@/lib/utils';
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';

// 2. store/router
import { useTransactionStore } from '@/stores/transaction';
import { useRouter } from 'vue-router';
// 3. constants
import {
  TRANSACTION_TYPE,
  CATEGORY,
  FILTER_PERIOD,
} from '@/api/constants/enumConstants';

// 4. props
const props = defineProps({
  dummyMode: { type: Boolean, default: false },
});

// 5. reactive state
const transactionStore = useTransactionStore();
const router = useRouter();
const PAGE_LIMIT = 10;

const activePeriod = ref(FILTER_PERIOD.MONTHLY);
const activeType = ref('전체');
const activeCategory = ref('전체');
const customStart = ref('');
const customEnd = ref('');

// 무한스크롤 관련
const scrollContainer = ref(null); // 스크롤이 발생하는 컨테이너
const sentinel = ref(null); // 바닥 감지용
const isFetchingMore = ref(false);
let currentPage = 1;

const CATEGORY_ICON_MAP = {
  [CATEGORY.FOOD]: '🍽️',
  [CATEGORY.TRANSPORT]: '🚌',
  [CATEGORY.CULTURE]: '🎬',
  [CATEGORY.HOSPITAL]: '🏥',
  [CATEGORY.LIVING]: '🛒',
  [CATEGORY.EVENT]: '🎁',
  [CATEGORY.ETC]: '📌',
};

// ── 더미 데이터 ──────────────────────────────────────
const DUMMY_TRANSACTIONS = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  type: i % 5 === 0 ? TRANSACTION_TYPE.INCOME : TRANSACTION_TYPE.EXPENSE,
  category: Object.values(CATEGORY)[i % 7],
  memo: `테스트 항목 ${i + 1}`,
  amount: (i + 1) * 1000,
  date: '2026-04-06',
}));

const dummyLoading = ref(false);
const dummyFilteredList = ref([]);
const dummyDisplayCount = ref(PAGE_LIMIT);

const dummyTransactions = computed(() =>
  dummyFilteredList.value.slice(0, dummyDisplayCount.value),
);
const dummyHasMore = computed(
  () => dummyDisplayCount.value < dummyFilteredList.value.length,
);

function applyDummyFilters() {
  dummyLoading.value = true;
  dummyDisplayCount.value = PAGE_LIMIT;
  setTimeout(() => {
    let list = [...DUMMY_TRANSACTIONS];
    if (activeType.value !== '전체') {
      list = list.filter((t) => t.type === activeType.value);
    }
    if (activeCategory.value !== '전체') {
      list = list.filter((t) => t.category === activeCategory.value);
    }
    dummyFilteredList.value = list;
    dummyLoading.value = false;
    // 필터 변경 시 스크롤 상단 이동
    if (scrollContainer.value) scrollContainer.value.scrollTop = 0;
  }, 300);
}

function loadMoreDummy() {
  dummyDisplayCount.value += PAGE_LIMIT;
}
// ───────────────────────────────────────────────────

const isLoading = computed(() =>
  props.dummyMode ? dummyLoading.value : transactionStore.loading,
);
const displayTransactions = computed(() =>
  props.dummyMode ? dummyTransactions.value : transactionStore.transactions,
);
const displayTotalCount = computed(() =>
  props.dummyMode ? dummyFilteredList.value.length : transactionStore.totalCount,
);
const displayHasMore = computed(() =>
  props.dummyMode ? dummyHasMore.value : transactionStore.hasMore,
);
const displayTotalIncome = computed(() => {
  const list = props.dummyMode ? dummyFilteredList.value : transactionStore.transactions;
  return list.filter((t) => t.type === TRANSACTION_TYPE.INCOME).reduce((s, t) => s + t.amount, 0);
});
const displayTotalExpense = computed(() => {
  const list = props.dummyMode ? dummyFilteredList.value : transactionStore.transactions;
  return list.filter((t) => t.type === TRANSACTION_TYPE.EXPENSE).reduce((s, t) => s + t.amount, 0);
});
const displayNetAmount = computed(() => displayTotalIncome.value - displayTotalExpense.value);

function getDateRange(period) {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (period === FILTER_PERIOD.DAILY) {
    const d = fmt(today);
    return { date_gte: d, date_lte: d };
  }
  if (period === FILTER_PERIOD.WEEKLY) {
    const day = today.getDay();
    const mon = new Date(today);
    mon.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    return { date_gte: fmt(mon), date_lte: fmt(today) };
  }
  if (period === FILTER_PERIOD.MONTHLY) {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return { date_gte: fmt(first), date_lte: fmt(today) };
  }
  return {
    ...(customStart.value ? { date_gte: customStart.value } : {}),
    ...(customEnd.value ? { date_lte: customEnd.value } : {}),
  };
}
const goToDetail = (id) => {
  router.push({ 
    name: 'detail', 
    params: { id } 
  });
};
async function fetchWithFilters() {
  if (props.dummyMode) {
    applyDummyFilters();
    return;
  }
  currentPage = 1;
  const params = {
    _page: currentPage,
    _per_page: PAGE_LIMIT,
    ...getDateRange(activePeriod.value),
    ...(activeType.value !== '전체' ? { type: activeType.value } : {}),
    ...(activeCategory.value !== '전체' ? { category: activeCategory.value } : {}),
  };
  await transactionStore.fetchTransactions(params, false);
  if (scrollContainer.value) scrollContainer.value.scrollTop = 0;
}

async function loadMore() {
  if (isFetchingMore.value) return;
  isFetchingMore.value = true;
  currentPage += 1;
  const params = {
    _page: currentPage,
    _per_page: PAGE_LIMIT,
    ...getDateRange(activePeriod.value),
    ...(activeType.value !== '전체' ? { type: activeType.value } : {}),
    ...(activeCategory.value !== '전체' ? { category: activeCategory.value } : {}),
  };
  await transactionStore.fetchTransactions(params, true);
  isFetchingMore.value = false;
}
async function handleDelete(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  if (props.dummyMode) {
    // 더미 모드: 필터링된 리스트에서 즉시 제거
    dummyFilteredList.value = dummyFilteredList.value.filter((t) => t.id !== id);
  } else {
    // 실제 모드: Store 액션 호출
    await transactionStore.deleteTransaction(id);
  }
}

watch([activePeriod, activeType, activeCategory, customStart, customEnd], () => {
  fetchWithFilters();
});

let observer = null;

onMounted(() => {
  fetchWithFilters();

  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoading.value &&
        !isFetchingMore.value &&
        displayHasMore.value
      ) {
        props.dummyMode ? loadMoreDummy() : loadMore();
      }
    },
    { 
      root: scrollContainer.value, // 뷰포트가 아닌 내부 컨테이너 기준
      threshold: 0.1 
    }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});

onUnmounted(() => {
  observer?.disconnect();
});

const formatCurrency = (value) => new Intl.NumberFormat('ko-KR').format(Math.abs(value));
</script>

<template>
  <PageSectionLayout title="거래내역">
    <div class="grid gap-5">
      <SectionCard>
        <div class="text-sm text-muted-foreground mb-3">기간</div>
        <div class="flex gap-4 border-b border-border pb-2 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            v-for="period in [FILTER_PERIOD.DAILY, FILTER_PERIOD.WEEKLY, FILTER_PERIOD.MONTHLY, FILTER_PERIOD.CUSTOM]"
            :key="period"
            :class="cn('pb-2 text-sm text-muted-foreground relative', activePeriod === period && 'text-primary font-medium after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary')"
            @click="activePeriod = period"
          >
            {{ period }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div>
            <div class="text-sm text-muted-foreground mb-1">총 수입</div>
            <div class="text-xl font-bold">{{ formatCurrency(displayTotalIncome) }}원</div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground mb-1">총 지출</div>
            <div class="text-xl font-bold">{{ formatCurrency(displayTotalExpense) }}원</div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground mb-1">합계</div>
            <div class="text-xl font-bold">{{ formatCurrency(displayNetAmount) }}원</div>
          </div>
        </div>

        <div class="text-sm text-muted-foreground mb-3">유형</div>
        <div class="flex gap-2 mb-8">
          <button
            v-for="type in ['전체', TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE]"
            :key="type"
            :class="cn('px-4 py-1.5 rounded-full text-sm font-medium', activeType === type ? 'bg-accent-ui text-accent-ui-foreground' : 'bg-button-dark text-button-dark-foreground')"
            @click="activeType = type"
          >
            {{ type }}
          </button>
        </div>
      </SectionCard>

      <SectionCard>
        <div 
          ref="scrollContainer" 
          class="overflow-y-auto max-h-[500px] pr-2 custom-scroll"
        >
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <span class="text-muted-foreground text-sm">불러오는 중...</span>
          </div>

          <div v-else-if="displayTransactions.length === 0" class="flex justify-center items-center py-12">
            <span class="text-muted-foreground text-sm">내역이 없습니다.</span>
          </div>

          <template v-else>
            <div
              v-for="item in displayTransactions"
              :key="item.id"
              @click="goToDetail(item.id)"
              class="flex items-center justify-between py-4 border-b border-border last:border-0"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-accent-ui text-accent-ui-foreground text-lg">
                  {{ CATEGORY_ICON_MAP[item.category] ?? '💳' }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm">{{ item.category }}</span>
                    <span :class="cn('text-[10px] px-1.5 py-0.5 rounded', item.type === TRANSACTION_TYPE.INCOME ? 'bg-accent-ui/20 text-accent-ui' : 'bg-chip-muted text-chip-muted-foreground')">
                      {{ item.type }}
                    </span>
                  </div>
                  <div class="text-xs text-muted-foreground">{{ item.memo }}</div>
                </div>
              </div>
              <div class="text-right">
                <div :class="cn('font-bold text-sm', item.type === TRANSACTION_TYPE.INCOME ? 'text-accent-ui' : 'text-text-primary')">
                  {{ item.type === TRANSACTION_TYPE.INCOME ? '+' : '-' }}{{ formatCurrency(item.amount) }}원
                </div>
                <div class="text-[10px] text-muted-foreground">{{ item.date }}</div>
                <button 
                  @click.stop="handleDelete(item.id)"
                  class="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="삭제"
                >
                  <p class="text-xs">삭제</p>
                </button>
              </div>
            </div>
            
          </template>

          <div ref="sentinel" class="h-12 flex justify-center items-center mt-2">
            <span v-if="isFetchingMore" class="text-muted-foreground text-xs italic">데이터를 더 가져오고 있어요...</span>
            <span v-else-if="!displayHasMore && displayTotalCount > 0" class="text-muted-foreground text-[10px]">
              모든 내역을 확인했습니다 (총 {{ displayTotalCount }}개)
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  </PageSectionLayout>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* 내부 스크롤바 커스텀 */
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
</style>