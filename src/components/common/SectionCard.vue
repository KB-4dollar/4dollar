<script setup>
defineProps({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <section
    class="rounded-[14px] border border-line bg-surface p-[18px] shadow-[0_8px_24px_var(--panel-shadow)] md:p-6"
  >
    <header v-if="title || description" class="mb-5">
      <h2 v-if="title" class="text-lg font-bold text-text-primary md:text-xl">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-1 text-sm leading-6 text-text-secondary">
        {{ description }}
      </p>
    </header>

    <slot />
  </section>
</template>
