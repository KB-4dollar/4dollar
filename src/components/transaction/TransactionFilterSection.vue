<script setup>
import SectionCard from '@/components/common/SectionCard.vue';
import TransactionSummary from './TransactionSummary.vue';
import TransactionTypeFilter from './TransactionTypeFilter.vue';
import { FILTER_PERIOD } from '@/api/constants/enumConstants';

defineProps({
  activePeriod: String,
  activeType: String,
  income: Number,
  expense: Number,
  net: Number,
  format: Function,
  customStart: String, // ⭐ 추가
  customEnd: String, // ⭐ 추가
});

const emit = defineEmits([
  'update:period',
  'update:type',
  'update:start', // ⭐ 추가
  'update:end', // ⭐ 추가
]);

const periods = [
  FILTER_PERIOD.DAILY,
  FILTER_PERIOD.WEEKLY,
  FILTER_PERIOD.MONTHLY,
  FILTER_PERIOD.CUSTOM,
];
</script>

<template>
  <SectionCard variant="flat">
    <!-- 기간 필터 -->
    <div class="flex gap-4 border-b pb-2 mb-4 overflow-x-auto">
      <button
        v-for="period in periods"
        :key="period"
        @click="$emit('update:period', period)"
        :class="[
          'pb-2 text-sm',
          activePeriod === period
            ? 'text-primary font-bold border-b-2 border-primary'
            : 'text-muted-foreground',
        ]"
      >
        {{ period }}
      </button>
    </div>

    <!-- ⭐ 사용자 지정 날짜 -->
    <div v-if="activePeriod === FILTER_PERIOD.CUSTOM" class="flex gap-2 mb-6">
      <input
        type="date"
        :value="customStart"
        @input="$emit('update:start', $event.target.value)"
        class="border rounded px-3 py-2 text-sm"
      />
      <span class="self-center text-sm">~</span>
      <input
        type="date"
        :value="customEnd"
        @input="$emit('update:end', $event.target.value)"
        class="border rounded px-3 py-2 text-sm"
      />
    </div>

    <!-- 요약 -->
    <TransactionSummary
      :income="income"
      :expense="expense"
      :net="net"
      :format="format"
    />

    <!-- 타입 필터 -->
    <div class="mt-6">
      <TransactionTypeFilter
        :activeType="activeType"
        @update:type="$emit('update:type', $event)"
      />
    </div>
  </SectionCard>
</template>
