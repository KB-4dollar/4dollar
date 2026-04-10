<script setup>
import SectionCard from '@/components/common/SectionCard.vue';
import TransactionSummary from './TransactionSummary.vue';
import TransactionTypeFilter from './TransactionTypeFilter.vue';

defineProps({
  activePeriod: String,
  activeType: String,
  income: Number,
  expense: Number,
  net: Number,
  format: Function,
});

const emit = defineEmits(['update:period', 'update:type']);
</script>

<template>
  <SectionCard variant="flat">
    <!-- 기간 필터 -->
    <div class="flex gap-4 border-b pb-2 mb-6 overflow-x-auto">
      <button
        v-for="period in ['일간', '주간', '월간', '직접설정']"
        :key="period"
        @click="$emit('update:period', period)"
      >
        {{ period }}
      </button>
    </div>

    <!-- ⭐ 요약 -->
    <TransactionSummary
      :income="income"
      :expense="expense"
      :net="net"
      :format="format"
    />

    <!-- ⭐ 타입 필터 -->
    <div class="mt-6">
      <TransactionTypeFilter
        :activeType="activeType"
        @update:type="$emit('update:type', $event)"
      />
    </div>
  </SectionCard>
</template>
