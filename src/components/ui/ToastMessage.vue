<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="open && message"
      class="fixed right-4 top-4 z-[60] rounded-2xl bg-button-dark px-4 py-3 text-sm font-semibold text-button-dark-foreground shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
      role="status"
      aria-live="polite"
    >
      {{ message }}
    </div>
  </Transition>
</template>
