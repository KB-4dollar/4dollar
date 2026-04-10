<script setup>
// 1. import
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { cn } from '@/lib/utils';

import TransactionFormModal from '@/components/transaction/TransactionFormModal.vue';
import ToastMessage from '@/components/ui/ToastMessage.vue';

// layout
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SectionStack from '@/components/common/SectionStack.vue';
import SectionGrid from '@/components/common/SectionGrid.vue';

// 2. store/router
import { useTransactionStore } from '@/stores/transaction';

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
const PAGE_LIMIT = 10;

const activePeriod = ref(FILTER_PERIOD.MONTHLY);
const activeType = ref('전체');
const activeCategory = ref('전체');
const customStart = ref('');
const customEnd = ref('');

// 무한스크롤 관련
const scrollContainer = ref(null);
const sentinel = ref(null);
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

// ── 데이터 관리 핵심 로직 (Dummy vs API) ─────────────────────────

// dummyMode일 때만 실행될 데이터 생성 함수
const generateDummyData = () => {
  return Array.from({ length: 25 }, (_, i) => ({
    id: `dummy-${i + 1}`,
    type: i % 5 === 0 ? TRANSACTION_TYPE.INCOME : TRANSACTION_TYPE.EXPENSE,
    category: Object.values(CATEGORY)[i % 7],
    memo: `테스트 항목 ${i + 1}`,
    amount: (i + 1) * 1000,
    date: '2026-04-06',
    tags: i % 3 === 0 ? ['필수', '식비'] : [],
  }));
};

const dummyFilteredList = ref([]);
const dummyDisplayCount = ref(PAGE_LIMIT);
const dummyLoading = ref(false);

// [Computed] 현재 로딩 상태
const isLoading = computed(() =>
  props.dummyMode ? dummyLoading.value : transactionStore.loading
);

// [Computed] 화면에 표시할 리스트
const displayTransactions = computed(() =>
  props.dummyMode
    ? dummyFilteredList.value.slice(0, dummyDisplayCount.value)
    : transactionStore.transactions
);

// [Computed] 더 불러올 데이터 존재 여부
const displayHasMore = computed(() =>
  props.dummyMode
    ? dummyDisplayCount.value < dummyFilteredList.value.length
    : transactionStore.hasMore
);

// [Computed] 데이터가 완전히 비어있는지 확인
const isListEmpty = computed(
  () => !isLoading.value && displayTransactions.value.length === 0
);

// [Computed] 통계 데이터
const displayTotalIncome = computed(() => {
  const list = props.dummyMode
    ? dummyFilteredList.value
    : transactionStore.transactions;
  return list
    .filter((t) => t.type === TRANSACTION_TYPE.INCOME)
    .reduce((s, t) => s + t.amount, 0);
});
const displayTotalExpense = computed(() => {
  const list = props.dummyMode
    ? dummyFilteredList.value
    : transactionStore.transactions;
  return list
    .filter((t) => t.type === TRANSACTION_TYPE.EXPENSE)
    .reduce((s, t) => s + t.amount, 0);
});
const displayNetAmount = computed(
  () => displayTotalIncome.value - displayTotalExpense.value
);

// ── 필터 및 데이터 요청 ──────────────────────────────────────

function getDateRange(period) {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

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

async function fetchWithFilters() {
  if (props.dummyMode) {
    // 1. Dummy Mode 로직
    dummyLoading.value = true;
    dummyDisplayCount.value = PAGE_LIMIT;

    // API 지연 시뮬레이션
    setTimeout(() => {
      let list = generateDummyData();
      if (activeType.value !== '전체') {
        list = list.filter((t) => t.type === activeType.value);
      }
      if (activeCategory.value !== '전체') {
        list = list.filter((t) => t.category === activeCategory.value);
      }
      dummyFilteredList.value = list;
      dummyLoading.value = false;
      if (scrollContainer.value) scrollContainer.value.scrollTop = 0;
    }, 300);
  } else {
    // 2. Real API Mode 로직
    currentPage = 1;
    const params = {
      _page: currentPage,
      _per_page: PAGE_LIMIT,
      ...getDateRange(activePeriod.value),
      ...(activeType.value !== '전체' ? { type: activeType.value } : {}),
      ...(activeCategory.value !== '전체'
        ? { category: activeCategory.value }
        : {}),
    };
    await transactionStore.fetchTransactions(params, false);
    if (scrollContainer.value) scrollContainer.value.scrollTop = 0;
  }
}

async function loadMore() {
  if (props.dummyMode) {
    if (displayHasMore.value) dummyDisplayCount.value += PAGE_LIMIT;
  } else {
    if (isFetchingMore.value || !displayHasMore.value) return;
    isFetchingMore.value = true;
    currentPage += 1;
    const params = {
      _page: currentPage,
      _per_page: PAGE_LIMIT,
      ...getDateRange(activePeriod.value),
      ...(activeType.value !== '전체' ? { type: activeType.value } : {}),
      ...(activeCategory.value !== '전체'
        ? { category: activeCategory.value }
        : {}),
    };
    await transactionStore.fetchTransactions(params, true);
    isFetchingMore.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  if (props.dummyMode) {
    dummyFilteredList.value = dummyFilteredList.value.filter(
      (t) => t.id !== id
    );
  } else {
    await transactionStore.deleteTransaction(id);
  }
  showToast('삭제되었습니다.');
}

const selectedTransaction = ref(null);
const isFormModalOpen = ref(false);
const toastMessage = ref('');
const isToastOpen = ref(false);
let toastTimerId = null;

const showToast = (message) => {
  toastMessage.value = message;
  isToastOpen.value = true;
  if (toastTimerId) window.clearTimeout(toastTimerId);
  toastTimerId = window.setTimeout(() => {
    isToastOpen.value = false;
    toastMessage.value = '';
  }, 2500);
};

const goToDetail = (id) => {
  const transaction = transactionStore.transactions.find((t) => t.id === id);
  selectedTransaction.value = transaction ?? null;
  isFormModalOpen.value = true;
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
  selectedTransaction.value = null;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('ko-KR').format(Math.abs(value));

// Watchers
watch(
  [activePeriod, activeType, activeCategory, customStart, customEnd],
  () => {
    fetchWithFilters();
  }
);

// Lifecycle
let observer = null;
onMounted(() => {
  fetchWithFilters();
  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoading.value &&
        displayHasMore.value
      ) {
        loadMore();
      }
    },
    { root: scrollContainer.value, threshold: 0.1 }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
<template>
  <PageSectionLayout title="거래내역">
    <SectionStack>
      <!-- 필터 영역 -->
      <SectionCard variant="flat">
        <!-- 기간 탭 -->
        <div
          class="flex gap-4 border-b border-border pb-2 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          <button
            v-for="period in [
              FILTER_PERIOD.DAILY,
              FILTER_PERIOD.WEEKLY,
              FILTER_PERIOD.MONTHLY,
              FILTER_PERIOD.CUSTOM,
            ]"
            :key="period"
            :class="
              cn(
                'pb-2 text-sm text-muted-foreground relative',
                activePeriod === period &&
                  'text-primary font-medium after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary'
              )
            "
            @click="activePeriod = period"
          >
            {{ period }}
          </button>
        </div>

        <!-- 요약 -->
        <SectionGrid :cols="3" gap="sm">
          <div>
            <div class="text-sm text-muted-foreground mb-1">총 수입</div>
            <div class="text-xl font-bold">
              {{ formatCurrency(displayTotalIncome) }}원
            </div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground mb-1">총 지출</div>
            <div class="text-xl font-bold">
              {{ formatCurrency(displayTotalExpense) }}원
            </div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground mb-1">합계</div>
            <div class="text-xl font-bold">
              {{ formatCurrency(displayNetAmount) }}원
            </div>
          </div>
        </SectionGrid>

        <!-- 타입 필터 -->
        <div class="mt-6">
          <div class="text-sm text-muted-foreground mb-3">유형</div>
          <div class="flex gap-2">
            <button
              v-for="type in [
                '전체',
                TRANSACTION_TYPE.INCOME,
                TRANSACTION_TYPE.EXPENSE,
              ]"
              :key="type"
              :class="
                cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  activeType === type
                    ? 'bg-accent-ui text-accent-ui-foreground'
                    : 'bg-button-dark text-button-dark-foreground'
                )
              "
              @click="activeType = type"
            >
              {{ type }}
            </button>
          </div>
        </div>
      </SectionCard>

      <!-- 리스트 영역 -->
      <SectionCard variant="flat">
        <div ref="scrollContainer" class="overflow-y-auto max-h-[500px]">
          <!-- 로딩 -->
          <div
            v-if="isLoading && displayTransactions.length === 0"
            class="flex justify-center items-center py-12"
          >
            <span class="text-muted-foreground text-sm">
              데이터를 불러오는 중...
            </span>
          </div>

          <!-- 빈 상태 -->
          <div
            v-else-if="isListEmpty"
            class="flex flex-col justify-center items-center py-16"
          >
            <div class="text-4xl mb-3">📁</div>
            <span class="text-muted-foreground text-sm">
              내역이 없습니다.
            </span>
          </div>

          <!-- 리스트 -->
          <template v-else>
            <div
              v-for="item in displayTransactions"
              :key="item.id"
              class="flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-accent/5 transition-colors cursor-pointer group"
              @click="goToDetail(item.id)"
            >
              <!-- 왼쪽 -->
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center bg-accent-ui text-accent-ui-foreground text-lg"
                >
                  {{ CATEGORY_ICON_MAP[item.category] ?? '💳' }}
                </div>

                <div>
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <!-- 타입 (수입 / 지출만 강조) -->
                    <span
                      :class="
                        cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-medium',
                          item.type === TRANSACTION_TYPE.INCOME
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-green-200 text-green-600'
                        )
                      "
                    >
                      {{ item.type }}
                    </span>

                    <!-- 카테고리 (텍스트 유지) -->
                    <span class="text-sm font-medium text-text-primary">
                      {{ item.category }}
                    </span>

                    <!-- 태그 (텍스트 유지) -->
                    <span
                      v-for="(tag, index) in item.tags"
                      :key="index"
                      class="text-sm font-medium text-text-primary"
                      >{{ tag }}
                    </span>
                  </div>

                  <div class="text-xs text-muted-foreground">
                    {{ item.memo }}
                  </div>
                </div>
              </div>

              <!-- 오른쪽 -->
              <div class="text-right">
                <div
                  :class="
                    cn(
                      'font-bold text-sm',
                      item.type === TRANSACTION_TYPE.INCOME
                        ? 'text-accent-ui'
                        : 'text-text-primary'
                    )
                  "
                >
                  {{ item.type === TRANSACTION_TYPE.INCOME ? '+' : '-' }}
                  {{ formatCurrency(item.amount) }}원
                </div>

                <div class="text-[10px] text-muted-foreground">
                  {{ item.date }}
                </div>

                <button
                  @click.stop="handleDelete(item.id)"
                  class="mt-1 text-[10px] text-muted-foreground hover:text-destructive"
                >
                  삭제
                </button>
              </div>
            </div>
          </template>

          <!-- 무한스크롤 -->
          <div ref="sentinel" class="h-12 flex justify-center items-center">
            <span
              v-if="isFetchingMore"
              class="text-muted-foreground text-xs italic"
            >
              데이터 더 불러오는 중...
            </span>
            <span
              v-else-if="!displayHasMore && !isListEmpty"
              class="text-muted-foreground text-[10px]"
            >
              모든 내역을 확인했습니다
            </span>
          </div>
        </div>
      </SectionCard>
    </SectionStack>
  </PageSectionLayout>

  <!-- FAB -->
  <button
    class="fixed bottom-20 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-button-dark text-button-dark-foreground shadow-lg hover:scale-105 active:scale-95"
    @click="isFormModalOpen = true"
  >
    <span class="text-2xl">+</span>
  </button>

  <TransactionFormModal
    :open="isFormModalOpen"
    :initial-transaction="selectedTransaction"
    @close="closeFormModal"
    @saved="closeFormModal"
  />

  <ToastMessage :open="isToastOpen" :message="toastMessage" />
</template>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
