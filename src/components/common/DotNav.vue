<template>
  <div
    class="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
  >
    <div
      v-for="(sec, i) in sections"
      :key="i"
      @click="$emit('move', i)"
      class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300"
      :class="
        activeIndex === i
          ? 'bg-[#e26d5c] scale-125'
          : 'bg-gray-300 hover:bg-gray-400'
      "
    />
  </div>
</template>

<script setup>
defineProps({
  sections: Array,
  activeIndex: Number,
});
</script>
