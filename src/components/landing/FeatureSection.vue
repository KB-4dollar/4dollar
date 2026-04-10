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
    class="min-h-screen snap-start flex items-center bg-surface-muted px-5 md:px-20 py-16 md:py-0"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center w-full max-w-6xl mx-auto"
    >
      <div class="flex flex-col gap-5 md:gap-6">
        <div>
          <p class="text-xs md:text-sm text-accent-ui font-semibold mb-2">
            SMART MONEY TRACKING
          </p>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-snug"
          >
            한눈에 보는 <br />
            나의 소비 패턴
          </h2>
        </div>
        <p
          class="text-sm md:text-base text-text-secondary leading-relaxed max-w-md"
        >
          월별 수입과 지출을 직관적으로 확인하고, 다양한 시각화 대시보드를 통해
          소비 흐름을 쉽게 분석해보세요.
        </p>
        <ul
          class="space-y-2 md:space-y-3 text-sm md:text-base text-text-secondary"
        >
          <li class="flex items-center gap-2">
            <span class="text-accent-ui text-sm">✔</span>
            카테고리별 소비 분석
          </li>
          <li class="flex items-center gap-2">
            <span class="text-accent-ui text-sm">✔</span>
            월별 수입·지출 한눈에 확인
          </li>
          <li class="flex items-center gap-2">
            <span class="text-accent-ui text-sm">✔</span>
            직관적인 대시보드 시각화
          </li>
        </ul>
      </div>
      <div
        class="w-full h-[220px] sm:h-[280px] md:h-[420px] bg-surface rounded-2xl border border-line shadow-[0_10px_30px_var(--panel-shadow)] flex items-center justify-center"
      >
        <span class="text-text-muted text-sm md:text-base">
          📊 Dashboard Image
        </span>
      </div>
    </div>
  </section>
</template>
