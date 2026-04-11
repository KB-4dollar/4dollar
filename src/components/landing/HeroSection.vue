<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import headerLogo from '@/assets/headerLogo.svg';

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
    class="w-full h-screen flex-shrink-0 snap-start flex items-center justify-center px-6 md:px-0"
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
      class="relative z-10 flex flex-col items-center text-center w-full max-w-md"
    >
      <!-- 배지 -->
      <div
        class="mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-1 rounded-full bg-accent-ui text-accent-ui-foreground text-xs md:text-sm font-medium shadow-sm"
      >
        소비 관리의 새로운 방식
      </div>

      <div class="relative mb-4 md:mb-6 flex items-center justify-center">
        <img
          :src="headerLogo"
          class="w-[220px] sm:w-[260px] md:w-[320px] animate-logo-entry md:hover:scale-105 transition"
        />
      </div>

      <!-- 설명 -->
      <p
        class="text-sm md:text-base text-text-secondary mb-6 md:mb-8 leading-relaxed"
      >
        지출에 둔감한 당신을 위해,<br />
        간편한 소비 기록과 다양한 카테고리로<br />
        재밌고 직관적인 소비 분석을 제공합니다
      </p>

      <!-- 버튼 (데스크탑만) -->
      <button
        @click="goLogin"
        class="hidden md:inline-flex relative z-20 bg-button-dark text-button-dark-foreground px-8 py-3 rounded-xl shadow-[0_8px_20px_var(--panel-shadow)] transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_28px_var(--panel-shadow)] hover:scale-105 active:scale-95"
      >
        {{ authStore.isLogin ? '대시보드로 이동' : '바로가기' }}
      </button>
    </div>

    <!-- 스크롤 힌트 (데스크탑만) -->
    <div
      class="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center text-text-muted text-xs md:text-sm pointer-events-none"
    >
      <p class="mb-2">아래로 스크롤하여 더 알아보기</p>
      <div class="animate-bounce text-lg">↓</div>
    </div>
  </section>
</template>
