<script setup>
import { ref } from 'vue';
import DemoCategory from '@/components/landing/demo/DemoCategory.vue';

const sectionEl = ref(null);

defineExpose({
  el: sectionEl,
});
</script>

<template>
  <section
    ref="sectionEl"
    class="min-h-screen snap-start flex items-center bg-surface-muted px-5 md:px-20 py-16 md:py-0"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center w-full max-w-6xl mx-auto"
    >
      <div
        class="w-full h-[220px] sm:h-[280px] md:h-[420px] flex items-center justify-center"
      >
        <DemoCategory />
      </div>
      <div class="flex flex-col gap-5 md:gap-6">
        <div>
          <p class="text-xs md:text-sm text-accent-ui font-semibold mb-2">
            SIMPLE MONEY MANAGEMENT
          </p>

          <h2
            class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-snug"
          >
            간편한 수입·지출 관리
          </h2>
        </div>

        <p
          class="text-sm md:text-base text-text-secondary leading-relaxed max-w-md"
        >
          카테고리별로 지출을 분류하고, 수입은 태그로 자유롭게 관리해보세요.
        </p>

        <ul
          class="space-y-2 md:space-y-3 text-sm md:text-base text-text-secondary"
        >
          <li class="flex items-center gap-2">
            <span class="text-accent-ui">✔</span>
            카테고리별 지출 관리
          </li>
          <li class="flex items-center gap-2">
            <span class="text-accent-ui">✔</span>
            태그 기반 수입 관리
          </li>
          <li class="flex items-center gap-2">
            <span class="text-accent-ui">✔</span>
            직관적인 거래 기록
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
