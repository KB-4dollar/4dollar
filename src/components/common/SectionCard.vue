<script setup>
defineProps({
  title: String,
  description: String,
});
</script>

<template>
  <section
    class="bg-surface border border-line p-[18px] /* 모바일 */ rounded-none shadow-none border-b /* 웹 */ md:rounded-[14px] md:shadow-[0_8px_24px_var(--panel-shadow)] md:border md:p-6"
  >
    <header v-if="title || description" class="mb-5">
      <h2 class="text-lg font-bold text-text-primary md:text-xl">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-1 text-sm text-text-secondary">
        {{ description }}
      </p>
    </header>

    <slot />
  </section>
</template>
