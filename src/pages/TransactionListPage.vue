<script setup>
// 1. import
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { cn } from '@/lib/utils';

// 2. store/router
import { useTransactionStore } from '@/stores/transaction';

// 3. constants
import { TRANSACTION_TYPE, CATEGORY, FILTER_PERIOD } from '@/api/constants/enumConstants';

// 4. props
const props = defineProps({
  // 더미 모드: API 없이 UI 개발/테스트용. router에서 props: true 또는 직접 :dummyMode="true"로 전달
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

// 무한스크롤
const sentinel = ref(null);         // 바닥 감지 sentinel 엘리먼트
const isFetchingMore = ref(false);  // 추가 로드 중 여부
let currentPage = 1;                // 실제 API용 내부 페이지 (반응형 불필요)

const CATEGORY_ICON_MAP = {
  [CATEGORY.FOOD]: '🍽️',
  [CATEGORY.TRANSPORT]: '🚌',
  [CATEGORY.CULTURE]: '🎬',
  [CATEGORY.HOSPITAL]: '🏥',
  [CATEGORY.LIVING]: '🛒',
  [CATEGORY.EVENT]: '🎁',
  [CATEGORY.ETC]: '📌',
};

// ── 더미 데이터 (dummyMode 전용) ──────────────────────────────────────
// 페이지네이션 테스트용으로 PAGE_LIMIT(10)을 초과하는 25개 데이터 포함
const DUMMY_TRANSACTIONS = [
  { id:  '1', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.FOOD,      memo: '강남역 점심 식사',    amount: 12500,   date: '2026-04-06' },
  { id:  '2', type: TRANSACTION_TYPE.INCOME,  category: CATEGORY.ETC,       memo: '4월 급여',           amount: 2500000, date: '2026-04-05' },
  { id:  '3', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.TRANSPORT, memo: '지하철 충전',         amount: 5500,    date: '2026-04-06' },
  { id:  '4', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.CULTURE,   memo: '영화 관람',           amount: 15000,   date: '2026-04-04' },
  { id:  '5', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.LIVING,    memo: '세제·휴지 구매',      amount: 32000,   date: '2026-04-04' },
  { id:  '6', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.EVENT,     memo: '친구 결혼 축의금',    amount: 100000,  date: '2026-04-03' },
  { id:  '7', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.HOSPITAL,  memo: '내과 진료비',         amount: 8000,    date: '2026-04-02' },
  { id:  '8', type: TRANSACTION_TYPE.INCOME,  category: CATEGORY.ETC,       memo: '프리랜서 원고료',      amount: 300000,  date: '2026-04-01' },
  { id:  '9', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.FOOD,      memo: '편의점 간식',         amount: 4800,    date: '2026-03-31' },
  { id: '10', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.TRANSPORT, memo: '택시비',              amount: 13200,   date: '2026-03-30' },
  { id: '11', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.LIVING,    memo: '마트 장보기',         amount: 58000,   date: '2026-03-29' },
  { id: '12', type: TRANSACTION_TYPE.INCOME,  category: CATEGORY.ETC,       memo: '중고거래 판매',        amount: 45000,   date: '2026-03-28' },
  { id: '13', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.CULTURE,   memo: '음악 스트리밍 구독',   amount: 8900,    date: '2026-03-27' },
  { id: '14', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.FOOD,      memo: '치킨 배달',           amount: 21000,   date: '2026-03-26' },
  { id: '15', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.HOSPITAL,  memo: '약국 약 구입',        amount: 6500,    date: '2026-03-25' },
  { id: '16', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.EVENT,     memo: '부모님 용돈',         amount: 200000,  date: '2026-03-24' },
  { id: '17', type: TRANSACTION_TYPE.INCOME,  category: CATEGORY.ETC,       memo: '3월 급여',           amount: 2500000, date: '2026-03-23' },
  { id: '18', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.TRANSPORT, memo: '주유비',              amount: 65000,   date: '2026-03-22' },
  { id: '19', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.FOOD,      memo: '카페 아메리카노',      amount: 4500,    date: '2026-03-21' },
  { id: '20', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.CULTURE,   memo: '콘서트 티켓',         amount: 77000,   date: '2026-03-20' },
  { id: '21', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.LIVING,    memo: '인터넷 요금',         amount: 27500,   date: '2026-03-19' },
  { id: '22', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.FOOD,      memo: '회식 저녁',           amount: 35000,   date: '2026-03-18' },
  { id: '23', type: TRANSACTION_TYPE.INCOME,  category: CATEGORY.ETC,       memo: '환급금',              amount: 12000,   date: '2026-03-17' },
  { id: '24', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.HOSPITAL,  memo: '치과 스케일링',       amount: 18000,   date: '2026-03-16' },
  { id: '25', type: TRANSACTION_TYPE.EXPENSE, category: CATEGORY.TRANSPORT, memo: '버스 정기권',         amount: 55000,   date: '2026-03-15' },
];

// 더미 모드일 때 사용하는 로컬 상태
const dummyLoading = ref(false);
const dummyFilteredList = ref([]);  // 필터 적용된 전체 목록
const dummyDisplayCount = ref(PAGE_LIMIT); // 현재 화면에 표시 중인 개수

// 현재 표시할 목록 (slice)
const dummyTransactions = computed(() =>
  dummyFilteredList.value.slice(0, dummyDisplayCount.value)
);
const dummyHasMore = computed(() =>
  dummyDisplayCount.value < dummyFilteredList.value.length
);

function applyDummyFilters() {
  dummyLoading.value = true;
  dummyDisplayCount.value = PAGE_LIMIT; // 필터 바뀌면 처음부터
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
  }, 300); // 로딩 UX 시뮬레이션
}

function loadMoreDummy() {
  dummyDisplayCount.value += PAGE_LIMIT;
}
// ─────────────────────────────────────────────────────────────────────

// 6. computed (실제/더미 통합)
const isLoading = computed(() =>
  props.dummyMode ? dummyLoading.value : transactionStore.loading
);
const displayTransactions = computed(() =>
  props.dummyMode ? dummyTransactions.value : transactionStore.transactions
);
const displayTotalCount = computed(() =>
  props.dummyMode ? dummyFilteredList.value.length : transactionStore.totalCount
);
const displayHasMore = computed(() =>
  props.dummyMode ? dummyHasMore.value : transactionStore.hasMore
);
const displayTotalIncome = computed(() => {
  if (props.dummyMode) {
    return dummyFilteredList.value
      .filter((t) => t.type === TRANSACTION_TYPE.INCOME)
      .reduce((s, t) => s + t.amount, 0);
  }
  return transactionStore.totalIncome;
});
const displayTotalExpense = computed(() => {
  if (props.dummyMode) {
    return dummyFilteredList.value
      .filter((t) => t.type === TRANSACTION_TYPE.EXPENSE)
      .reduce((s, t) => s + t.amount, 0);
  }
  return transactionStore.totalExpense;
});
const displayNetAmount = computed(() =>
  displayTotalIncome.value - displayTotalExpense.value
);

// 7. 기간 필터 → date_gte / date_lte 변환
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
  // CUSTOM
  return {
    ...(customStart.value ? { date_gte: customStart.value } : {}),
    ...(customEnd.value ? { date_lte: customEnd.value } : {}),
  };
}

async function fetchWithFilters() {
  if (props.dummyMode) {
    applyDummyFilters();
    return;
  }
  // 필터 변경 시 1페이지부터 다시 로드 (replace)
  currentPage = 1;
  // TODO: authStore.user?.id가 null일 수 있음 — checkAuth()는 user 객체를 복원하지 않음
  const params = {
    _page: currentPage,
    _per_page: PAGE_LIMIT, // json-server v1은 _limit 대신 _per_page 사용
    ...getDateRange(activePeriod.value),
    ...(activeType.value !== '전체' ? { type: activeType.value } : {}),
    ...(activeCategory.value !== '전체' ? { category: activeCategory.value } : {}),
  };
  await transactionStore.fetchTransactions(params, false);
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
  await transactionStore.fetchTransactions(params, true); // append
  isFetchingMore.value = false;
}

// 8. watch — 필터 변경 시 재조회
watch([activePeriod, activeType, activeCategory, customStart, customEnd], () => {
  fetchWithFilters();
});

// 9. lifecycle
let observer = null;

onMounted(() => {
  fetchWithFilters();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value && !isFetchingMore.value && displayHasMore.value) {
        if (props.dummyMode) {
          loadMoreDummy();
        } else {
          loadMore();
        }
      }
    },
    { threshold: 0.1 }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});

onUnmounted(() => {
  observer?.disconnect();
});

// 10. functions
const formatCurrency = (value) =>
  new Intl.NumberFormat('ko-KR').format(Math.abs(value));

function handleDelete(id) {
  // TODO: 삭제 확인 다이얼로그 후 transactionStore.deleteTransaction(id) 호출
  if (props.dummyMode) {
    dummyFilteredList.value = dummyFilteredList.value.filter((t) => t.id !== id);
  }
}

function handleEdit(item) {
  // TODO: detail 라우트 생성 후 router.push({ name: 'transaction-detail', params: { id: item.id } }) 로 교체
  // (feat-detail_page 브랜치에서 추가 예정)
  console.warn('[TODO] edit not implemented', item);
}
</script>

<template>
  <!-- TODO: 추후 상수화 예정 — sub color #FAF3F1 -->
  <div class="max-w-5xl mx-auto px-4 py-6 min-h-screen" style="background-color: #FAF3F1;">

    <!-- 더미 모드 배지 -->
    <div
      v-if="dummyMode"
      class="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/20 text-destructive text-xs font-semibold px-3 py-1"
    >
      🧪 DUMMY MODE — API 미연결 상태 (테스트용)
    </div>

    <h1 class="text-xl md:text-2xl font-bold mb-6 text-foreground">거래내역</h1>

    <!-- 필터 카드 -->
    <div class="bg-card rounded-lg p-4 md:p-8 mb-4 md:mb-6 border border-border shadow-sm">

      <!-- 기간 탭 -->
      <div class="text-sm text-muted-foreground mb-3">기간</div>
      <div class="flex gap-4 md:gap-6 border-b border-border pb-2 mb-6 overflow-x-auto whitespace-nowrap">
        <button
          v-for="period in [FILTER_PERIOD.DAILY, FILTER_PERIOD.WEEKLY, FILTER_PERIOD.MONTHLY, FILTER_PERIOD.CUSTOM]"
          :key="period"
          :class="cn(
            'pb-2 text-sm text-muted-foreground relative',
            activePeriod === period && 'text-primary font-medium after:content-[\'\'] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary'
          )"
          @click="activePeriod = period"
        >
          <span v-if="period === FILTER_PERIOD.CUSTOM" class="mr-1">📅</span>{{ period }}
        </button>
      </div>

      <!-- 사용자 지정 날짜 입력 -->
      <div
        v-if="activePeriod === FILTER_PERIOD.CUSTOM"
        class="flex flex-col sm:flex-row items-center gap-2 md:gap-3 bg-secondary/20 p-4 rounded-lg mb-8"
      >
        <input
          v-model="customStart"
          type="date"
          class="w-full sm:w-[150px] h-10 border border-border rounded-md px-3 bg-background text-sm text-foreground"
        />
        <span class="text-muted-foreground">~</span>
        <input
          v-model="customEnd"
          type="date"
          class="w-full sm:w-[150px] h-10 border border-border rounded-md px-3 bg-background text-sm text-foreground"
        />
      </div>

      <!-- 요약 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <div class="text-sm text-muted-foreground mb-1">총 수입</div>
          <div class="text-xl md:text-2xl font-bold text-foreground">
            {{ formatCurrency(displayTotalIncome) }}<span class="text-sm font-normal text-muted-foreground ml-1">원</span>
          </div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground mb-1">총 지출</div>
          <div class="text-xl md:text-2xl font-bold text-foreground">
            {{ formatCurrency(displayTotalExpense) }}<span class="text-sm font-normal text-muted-foreground ml-1">원</span>
          </div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground mb-1">합계</div>
          <div class="text-xl md:text-2xl font-bold text-foreground">
            {{ formatCurrency(displayNetAmount) }}<span class="text-sm font-normal text-muted-foreground ml-1">원</span>
          </div>
        </div>
      </div>

      <!-- 유형 필터 -->
      <div class="text-sm text-muted-foreground mb-3">유형</div>
      <div class="flex gap-2 mb-8">
        <!-- TODO: 추후 상수화 예정 — active bg: primary #E07A5F / inactive bg: black / text: white -->
        <button
          v-for="type in ['전체', TRANSACTION_TYPE.INCOME, TRANSACTION_TYPE.EXPENSE]"
          :key="type"
          class="px-4 py-1.5 rounded-full text-sm font-medium text-white transition-colors hover:opacity-80"
          :style="activeType === type ? { backgroundColor: '#E07A5F' } : { backgroundColor: '#000000' }"
          @click="activeType = type"
        >
          {{ type }}
        </button>
      </div>

      <!-- 카테고리 필터 -->
      <div class="text-sm text-muted-foreground mb-3">카테고리 (단일 선택)</div>
      <div class="flex gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
        <button
          class="flex flex-col md:flex-row items-center gap-2 group min-w-max"
          @click="activeCategory = '전체'"
        >
          <!-- TODO: 추후 상수화 예정 — active bg/text = primary #E07A5F, inactive = secondary -->
          <div
            :class="cn('w-10 h-10 rounded-full flex items-center justify-center text-xs transition-colors', activeCategory === '전체' ? 'text-white' : 'bg-secondary text-secondary-foreground group-hover:bg-secondary/80')"
            :style="activeCategory === '전체' ? { backgroundColor: '#E07A5F' } : {}"
          >전체</div>
          <span
            :class="cn('text-xs md:text-sm', activeCategory === '전체' ? 'font-medium' : 'text-foreground')"
            :style="activeCategory === '전체' ? { color: '#E07A5F' } : {}"
          >전체</span>
        </button>
        <button
          v-for="(cat, index) in [
            { name: CATEGORY.FOOD,      icon: CATEGORY_ICON_MAP[CATEGORY.FOOD] },
            { name: CATEGORY.TRANSPORT, icon: CATEGORY_ICON_MAP[CATEGORY.TRANSPORT] },
            { name: CATEGORY.CULTURE,   icon: CATEGORY_ICON_MAP[CATEGORY.CULTURE] },
            { name: CATEGORY.HOSPITAL,  icon: CATEGORY_ICON_MAP[CATEGORY.HOSPITAL] },
            { name: CATEGORY.LIVING,    icon: CATEGORY_ICON_MAP[CATEGORY.LIVING] },
            { name: CATEGORY.EVENT,     icon: CATEGORY_ICON_MAP[CATEGORY.EVENT] },
            { name: CATEGORY.ETC,       icon: CATEGORY_ICON_MAP[CATEGORY.ETC] },
          ]"
          :key="index"
          class="flex flex-col md:flex-row items-center gap-2 group min-w-max"
          @click="activeCategory = cat.name"
        >
          <!-- TODO: 추후 상수화 예정 — active bg/text = primary #E07A5F, inactive = secondary -->
          <div
            :class="cn('w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors', activeCategory === cat.name ? '' : 'bg-secondary text-secondary-foreground group-hover:bg-secondary/80')"
            :style="activeCategory === cat.name ? { backgroundColor: '#E07A5F' } : {}"
          >
            {{ cat.icon }}
          </div>
          <span
            :class="cn('text-xs md:text-sm', activeCategory === cat.name ? 'font-medium' : 'text-foreground')"
            :style="activeCategory === cat.name ? { color: '#E07A5F' } : {}"
          >{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- 거래 목록 -->
    <div class="bg-card rounded-lg border border-border shadow-sm p-4 md:p-6">
      <!-- 로딩 -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <span class="text-muted-foreground text-sm">불러오는 중...</span>
      </div>

      <!-- 데이터 없음 -->
      <div
        v-else-if="displayTransactions.length === 0"
        class="flex justify-center items-center py-12"
      >
        <span class="text-muted-foreground text-sm">해당 조건의 거래내역이 없습니다.</span>
      </div>

      <!-- 목록 -->
      <template v-else>
        <div
          v-for="item in displayTransactions"
          :key="item.id"
          class="flex items-center justify-between py-4 border-b border-border last:border-0"
        >
          <div class="flex items-center gap-4">
            <!-- TODO: 추후 상수화 예정 — 아이콘 배경 = primary #E07A5F -->
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
              style="background-color: #E07A5F;"
            >
              {{ CATEGORY_ICON_MAP[item.category] ?? '💳' }}
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-foreground text-sm md:text-base">{{ item.category }}</span>
                <!-- TODO: 추후 상수화 예정 — 수입 뱃지: bg #F5DDD8 / text primary #E07A5F -->
                <span
                  class="text-[10px] md:text-xs px-1.5 py-0.5 rounded"
                  :class="item.type !== TRANSACTION_TYPE.INCOME ? 'bg-secondary text-muted-foreground' : ''"
                  :style="item.type === TRANSACTION_TYPE.INCOME ? { backgroundColor: '#F5DDD8', color: '#E07A5F' } : {}"
                >
                  {{ item.type }}
                </span>
              </div>
              <div class="text-xs md:text-sm text-muted-foreground">{{ item.memo }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <!-- TODO: 추후 상수화 예정 — 수입: primary #E07A5F / 지출: black -->
              <div
                class="font-bold text-sm md:text-base mb-1"
                :style="item.type === TRANSACTION_TYPE.INCOME ? { color: '#E07A5F' } : { color: '#000000' }"
              >
                {{ item.type === TRANSACTION_TYPE.INCOME ? '+' : '-' }}{{ formatCurrency(item.amount) }}원
              </div>
              <div class="text-xs text-muted-foreground">{{ item.date }}</div>
            </div>

            <!-- 수정/삭제, 추후 넣을 경우 사용 -->
            <!-- <div class="flex flex-col gap-1 shrink-0">
              <button
                class="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
                @click="handleEdit(item)"
              >
                수정
              </button>
              <button
                class="text-xs text-destructive hover:text-destructive/80 transition-colors px-2 py-1 rounded hover:bg-secondary"
                @click="handleDelete(item.id)"
              >
                삭제
              </button>
            </div> -->
          </div>
        </div>
      </template>
    </div>

    <!-- 무한스크롤 sentinel & 상태 표시 -->
    <div ref="sentinel" class="h-10 flex justify-center items-center mt-4">
      <span v-if="isFetchingMore" class="text-muted-foreground text-sm">불러오는 중...</span>
      <span v-else-if="!displayHasMore && displayTotalCount > 0" class="text-muted-foreground text-xs">
        모두 불러왔습니다 (총 {{ displayTotalCount }}개)
      </span>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
