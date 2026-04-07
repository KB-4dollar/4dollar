<script setup>
defineProps({
  title: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-page-bg px-4 py-6 md:px-5 md:py-10">
    <div class="mx-auto max-w-[960px]">
      <h1
        class="mb-5 text-[1.75rem] font-extrabold leading-tight text-text-primary md:mb-6 md:text-[2rem]"
      >
        {{ title }}
      </h1>

      <div class="space-y-5 md:space-y-6">
        <slot />
      </div>
    </div>
  </div>
</template>
