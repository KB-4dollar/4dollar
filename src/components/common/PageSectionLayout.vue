<script setup>
defineProps({
  title: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div
    class="min-h-[calc(100vh-64px)] bg-white md:bg-page-bg px-0 md:px-5 py-0 md:py-10"
  >
    <div class="mx-auto max-w-[960px]">
      <!-- 모바일 헤더 -->
      <div
        class="md:hidden fixed top-0 left-0 w-full flex items-center px-4 py-3 border-b bg-white z-50"
      >
        <span class="font-semibold text-base">
          {{ title }}
        </span>
      </div>
      <!-- 웹에서 헤더를 할것인지.. -->

      <!-- 콘텐츠 영역 -->
      <div class="pt-[50px] md:pt-0">
        <slot />
      </div>
    </div>
  </div>
</template>
