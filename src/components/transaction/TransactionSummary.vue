<script setup>
defineProps({
  income: Number,
  expense: Number,
  net: Number,
  format: Function,
});
</script>

<template>
  <!-- 핵심: grid-cols-1 → md:grid-cols-3 -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <div>
      <div class="text-sm text-muted-foreground mb-1">총 수입</div>
      <div class="text-xl font-bold">{{ format(income) }}원</div>
    </div>

    <div>
      <div class="text-sm text-muted-foreground mb-1">총 지출</div>
      <div class="text-xl font-bold">{{ format(expense) }}원</div>
    </div>

    <div>
      <div class="text-sm text-muted-foreground mb-1">합계</div>
      <div class="text-xl font-bold">{{ format(net) }}원</div>
    </div>
  </div>
</template>
