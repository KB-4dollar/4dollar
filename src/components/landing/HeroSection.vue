<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const sectionEl = ref(null);
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
    class="h-screen snap-start flex items-center justify-center relative text-text-primary"
    style="
      background: linear-gradient(
        135deg,
        #fdf6f8 0%,
        #fce7f3 35%,
        #fbcfe8 70%,
        #f9a8d4 100%
      );
    "
  >
    <div
      class="relative z-10 flex flex-col items-center text-center fade-up show"
    >
      <div
        class="mb-6 px-4 py-1 rounded-full bg-accent-ui text-accent-ui-foreground text-sm font-medium shadow-sm"
      >
        스마트한 가계부 관리
      </div>

      <h1 class="text-5xl font-bold text-accent-ui mb-4 tracking-tight">
        4DOLLAR
      </h1>

      <p class="text-text-secondary mb-8 max-w-md leading-relaxed">
        경조사비부터 일상 지출까지,<br />
        모든 거래를 한눈에 관리하세요
      </p>

      <button
        @click="goLogin"
        class="relative z-20 bg-button-dark text-button-dark-foreground px-8 py-3 rounded-xl shadow-[0_8px_20px_var(--panel-shadow)] transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_28px_var(--panel-shadow)] hover:scale-105 active:scale-95"
      >
        {{ authStore.isLogin ? '대시보드로 이동' : '바로가기' }}
      </button>
    </div>

    <div
      class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-text-muted text-sm pointer-events-none"
    >
      <p class="mb-2">아래로 스크롤하여 더 알아보기</p>
      <div class="animate-bounce text-lg">↓</div>
    </div>
  </section>
</template>
