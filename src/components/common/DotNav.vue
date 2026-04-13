<template>
  <div
    class="fixed z-50 flex gap-3 bottom-6 left-1/2 -translate-x-1/2 flex-row md:top-1/2 md:right-6 md:left-auto md:-translate-y-1/2 md:flex-col"
  >
    <div
      v-for="(sec, i) in sections"
      :key="i"
      @click="$emit('move', i)"
      class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300"
      :class="
        activeIndex === i
          ? 'bg-pink-400 scale-125 shadow-md'
          : 'bg-gray-300 opacity-60 hover:opacity-100'
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
