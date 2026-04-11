<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const sectionEl = ref(null);
const router = useRouter();
const authStore = useAuthStore();

const goLogin = () => {
  if (authStore.isLogin) {
    router.push('/app');
  } else {
    router.push('/login');
  }
};

defineExpose({
  el: sectionEl,
});
</script>

<template>
  <section
    ref="sectionEl"
    class="w-full h-screen flex-shrink-0 snap-start flex flex-col justify-between bg-accent-ui text-accent-ui-foreground"
  >
    <div
      class="flex-1 bg-accent-ui flex flex-col items-center justify-center text-center px-6 md:px-20"
    >
      <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
        지금 바로 시작하세요
      </h2>

      <p class="text-sm md:text-base opacity-90 mb-6 md:mb-8">
        4dollar와 함께 재밌는 가계부 관리를 경험해보세요
      </p>

      <button
        @click="goLogin"
        class="bg-button-dark text-button-dark-foreground px-8 py-3 rounded-xl shadow-[0_8px_20px_var(--panel-shadow)] transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 mb-8 animate-logo-entry delay-300"
      >
        {{ authStore.isLogin ? '대시보드로 이동' : '바로가기' }}
      </button>

      <div class="flex gap-8 md:gap-10 mt-4 md:mt-6 text-center">
        <div>
          <p class="text-lg md:text-xl font-bold">8+</p>
          <p class="text-xs opacity-80">카테고리</p>
        </div>
        <div>
          <p class="text-lg md:text-xl font-bold">∞</p>
          <p class="text-xs opacity-80">거래 기록</p>
        </div>
        <div>
          <p class="text-lg md:text-xl font-bold">∞</p>
          <p class="text-xs opacity-80">팩폭 알림</p>
        </div>
      </div>
    </div>

    <footer
      class="hidden md:block w-full bg-slate-900 text-gray-300 py-6 px-6 text-sm"
    >
      <div
        class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3"
      >
        <div class="text-center md:text-left">
          <h3 class="font-bold text-lg">4DOLLAR</h3>
          <p class="opacity-80 text-xs mt-1">KB 스켈레톤 프로젝트</p>
        </div>

        <div class="flex flex-col gap-2 items-center md:items-start">
          <p class="font-semibold">팀원</p>
          <p class="opacity-80 text-xs">채수연 고현석 이승영 박신형</p>
        </div>

        <div class="text-center md:text-right">
          <p class="font-semibold">개발</p>
          <p class="opacity-80 text-xs mt-1 break-all">
            https://github.com/KB-4dollar
          </p>
        </div>
      </div>

      <div class="text-center text-xs opacity-70 mt-6 md:mt-8">
        © 2026 4dollar. All rights reserved.
      </div>
    </footer>
  </section>
</template>
