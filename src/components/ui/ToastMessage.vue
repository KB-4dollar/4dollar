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
      class="fixed bottom-20 left-1/2 z-60 -translate-x-1/2 flex items-center gap-2.5 rounded-2xl border border-accent-ui bg-page px-5 py-3 text-sm font-semibold text-text-primary shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
      role="status"
      aria-live="polite"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-accent-ui shrink-0"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {{ message }}
    </div>
  </Transition>
</template>
