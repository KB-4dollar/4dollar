<script setup>
defineProps({
  gap: {
    type: String,
    default: 'md',
  },
});
</script>

<template>
  <div :class="stackClass">
    <slot />
  </div>
</template>

<script>
export default {
  computed: {
    stackClass() {
      const gapMap = {
        sm: 'gap-3 md:gap-4',
        md: 'gap-4 md:gap-6',
        lg: 'gap-6 md:gap-8',
      };

      return `flex flex-col ${gapMap[this.gap]}`;
    },
  },
};
</script>
