<script setup>
// 1. vue
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// 2. layout
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionStack from '@/components/common/SectionStack.vue';

// 3. components
import TransactionFilterSection from '@/components/transaction/TransactionFilterSection.vue';
import TransactionListSection from '@/components/transaction/TransactionListSection.vue';
import TransactionFormModal from '@/components/transaction/TransactionFormModal.vue';

// 4. store
import { useTransactionStore } from '@/stores/transaction';

// 5. constants
import { TRANSACTION_TYPE, FILTER_PERIOD } from '@/api/constants/enumConstants';

// -------------------------
// 📌 state
// -------------------------
const transactionStore = useTransactionStore();

const PAGE_LIMIT = 10;

const activePeriod = ref(FILTER_PERIOD.MONTHLY);
const activeType = ref('전체');
const activeCategory = ref('전체');
const customStart = ref('');
const customEnd = ref('');

// ⭐ 모달 상태
const selectedTransaction = ref(null);
const isFormModalOpen = ref(false);

// 무한스크롤
const sentinel = ref(null);
const isFetchingMore = ref(false);
let currentPage = 1;

// -------------------------
// 📌 computed
// -------------------------
const isLoading = computed(() => transactionStore.loading);

const displayTransactions = computed(() => transactionStore.transactions);

const displayHasMore = computed(() => transactionStore.hasMore);

const isListEmpty = computed(
  () => !isLoading.value && displayTransactions.value.length === 0
);

// 총 수입
const displayTotalIncome = computed(() =>
  transactionStore.transactions
    .filter((t) => t.type === TRANSACTION_TYPE.INCOME)
    .reduce((sum, t) => sum + t.amount, 0)
);

// 총 지출
const displayTotalExpense = computed(() =>
  transactionStore.transactions
    .filter((t) => t.type === TRANSACTION_TYPE.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0)
);

// 합계
const displayNetAmount = computed(
  () => displayTotalIncome.value - displayTotalExpense.value
);

// -------------------------
// 📌 utils
// -------------------------
const formatCurrency = (value) =>
  new Intl.NumberFormat('ko-KR').format(Math.abs(value));

// -------------------------
// 📌 filter logic
// -------------------------
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

// -------------------------
// 📌 API
// -------------------------
async function fetchWithFilters() {
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
}

async function loadMore() {
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

// -------------------------
// 📌 actions
// -------------------------

// ⭐ 삭제
async function handleDelete(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  await transactionStore.deleteTransaction(id);
}

// ⭐ 수정 모달 열기
function goToDetail(id) {
  const transaction = transactionStore.transactions.find((t) => t.id === id);

  selectedTransaction.value = transaction ?? null;
  isFormModalOpen.value = true;
}

// ⭐ 추가 모달 열기 (핵심)
function openCreateModal() {
  selectedTransaction.value = null;
  isFormModalOpen.value = true;
}

// -------------------------
// 📌 watchers
// -------------------------
watch(
  [activePeriod, activeType, activeCategory, customStart, customEnd],
  () => {
    fetchWithFilters();
  }
);

// -------------------------
// 📌 lifecycle
// -------------------------
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
    { root: null, threshold: 0.1 }
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
      <TransactionFilterSection
        :activeType="activeType"
        :activePeriod="activePeriod"
        :customStart="customStart"
        :customEnd="customEnd"
        :income="displayTotalIncome"
        :expense="displayTotalExpense"
        :net="displayNetAmount"
        :format="formatCurrency"
        @update:type="activeType = $event"
        @update:period="activePeriod = $event"
        @update:start="customStart = $event"
        @update:end="customEnd = $event"
      />
      <TransactionListSection
        :items="displayTransactions"
        :isLoading="isLoading"
        :isEmpty="isListEmpty"
        :format="formatCurrency"
        @click="goToDetail"
        @delete="handleDelete"
      />
    </SectionStack>
  </PageSectionLayout>

  <button
    class="fixed bottom-20 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-button-dark text-white shadow-lg"
    @click="openCreateModal"
  >
    <span class="text-2xl">+</span>
  </button>

  <TransactionFormModal
    :open="isFormModalOpen"
    :initial-transaction="selectedTransaction"
    @close="isFormModalOpen = false"
    @saved="isFormModalOpen = false"
  />

  <div ref="sentinel" class="h-10"></div>
</template>
