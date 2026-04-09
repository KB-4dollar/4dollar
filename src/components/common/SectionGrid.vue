<script setup>
import { computed } from 'vue';

const props = defineProps({
  cols: {
    type: Number,
    default: 2, // 기본 2열
  },
  gap: {
    type: String,
    default: 'md', // sm | md | lg
  },
});
</script>

<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    cols: {
      type: Number,
      default: 2,
    },
    gap: {
      type: String,
      default: 'md',
    },
  },
  computed: {
    gridClass() {
      const gapMap = {
        sm: 'gap-3 md:gap-4',
        md: 'gap-4 md:gap-6',
        lg: 'gap-6 md:gap-8',
      };

      return `
        grid
        grid-cols-1
        md:grid-cols-${this.cols}
        ${gapMap[this.gap]}
      `;
    },
  },
};
</script>
