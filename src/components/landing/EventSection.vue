<script setup>
import { ref } from 'vue';
import DemoPet from '@/components/landing/demo/DemoPet.vue';
const sectionEl = ref(null);

defineExpose({
  el: sectionEl,
});
</script>

<template>
  <section
    ref="sectionEl"
    class="min-h-screen snap-start flex items-center bg-page-bg px-5 md:px-20 py-16 md:py-0"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center w-full max-w-6xl mx-auto"
    >
      <div
        class="w-full h-[220px] sm:h-[280px] md:h-[420px] rounded-2xl flex items-center justify-center"
      >
        <DemoPet />
      </div>
      <div class="flex flex-col gap-5 md:gap-6">
        <div>
          <p class="text-xs md:text-sm text-accent-ui font-semibold mb-2">
            SMART INSIGHT ALERT
          </p>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-snug"
          >
            팩폭 캐릭터와 함께 <br />
            소비 습관을 바꾸세요
          </h2>
        </div>
        <p
          class="text-sm md:text-base text-text-secondary leading-relaxed max-w-md"
        >
          내 소비 데이터를 분석해 자동으로 알림을 제공합니다. 불필요한 지출을
          줄이고 더 나은 소비 습관을 만들어보세요.
        </p>
        <ul
          class="space-y-2 md:space-y-3 text-sm md:text-base text-text-secondary"
        >
          <li class="flex items-center gap-2">
            <span class="text-accent-ui">✔</span>
            소비 패턴 분석
          </li>
          <li class="flex items-center gap-2">
            <span class="text-accent-ui">✔</span>
            실시간 팩폭 알림 무제한 제공
          </li>
          <li class="flex items-center gap-2">
            <span class="text-accent-ui">✔</span>
            절약을 위한 맞춤 제안
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
