<script setup>
const categories = [
  { name: '식비', icon: '🍜' },
  { name: '교통', icon: '🚗' },
  { name: '문화', icon: '💵' },
  { name: '병원', icon: '🪑' },
  { name: '생활', icon: '👕' },
  { name: '경조사', icon: '🎁' },
];
</script>

<template>
  <div class="grid grid-cols-3 gap-3 w-full max-w-sm">
    <div
      v-for="(cat, i) in categories"
      :key="cat.name"
      class="flex flex-col items-center justify-center rounded-xl p-3 border transition-all duration-300"
      :class="
        i === 0 || i === 2
          ? 'bg-accent-ui/10 border-accent-ui scale-105 shadow-md'
          : 'bg-white border-line'
      "
    >
      <div class="text-xl mb-1">{{ cat.icon }}</div>
      <span class="text-xs font-medium text-text-primary">
        {{ cat.name }}
      </span>
    </div>
  </div>
</template>
