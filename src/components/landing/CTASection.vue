<script setup>
import { ref } from 'vue';

const sectionEl = ref(null);

defineExpose({
  el: sectionEl,
});
</script>

<template>
  <section
    ref="sectionEl"
    class="min-h-screen snap-start flex flex-col bg-accent-ui text-accent-ui-foreground"
  >
    <div
      class="flex-1 flex flex-col items-center justify-center text-center px-5 md:px-20"
    >
      <h2 class="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>

      <p class="text-sm md:text-base opacity-90 mb-6">
        4dollar와 함께 스마트한 가계부 관리를 경험해보세요
      </p>

      <button
        class="bg-surface text-accent-ui px-6 py-3 rounded-xl font-semibold shadow-[0_8px_20px_var(--panel-shadow)] hover:opacity-90 transition"
      >
        시작하기 →
      </button>

      <div class="flex gap-10 mt-10 text-center">
        <div>
          <p class="text-xl font-bold">8+</p>
          <p class="text-xs opacity-80">카테고리</p>
        </div>
        <div>
          <p class="text-xl font-bold">∞</p>
          <p class="text-xs opacity-80">거래 기록</p>
        </div>
        <div>
          <p class="text-xl font-bold">∞</p>
          <p class="text-xs opacity-80">팩폭 알림</p>
        </div>
      </div>
    </div>

    <footer class="w-full bg-slate-900 text-gray-300 py-6 px-6 text-sm">
      <div
        class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3"
      >
        <div>
          <h3 class="font-bold text-lg">4dollars</h3>
          <p class="opacity-80 text-xs mt-1">스마트한 가계부 관리의 시작</p>
        </div>
        <div class="flex flex-col gap-2">
          <p class="font-semibold">정보</p>
          <p class="opacity-80 text-xs">서비스 소개</p>
          <p class="opacity-80 text-xs">이용약관</p>
          <p class="opacity-80 text-xs">개인정보처리방침</p>
        </div>

        <div>
          <p class="font-semibold">개발</p>
          <p class="opacity-80 text-xs mt-1">https://github.com/KB-4dollar</p>
        </div>
      </div>

      <div class="text-center text-xs opacity-70 mt-8">
        © 2026 4dollar. All rights reserved.
      </div>
    </footer>
  </section>
</template>
