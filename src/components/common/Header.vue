<script setup>
import { computed } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { User } from 'lucide-vue-next';
import logo from '@/assets/headerLogo.svg';

const authStore = useAuthStore();

const userName = computed(() => authStore.user?.name || '사용자');

// 설정 페이지 이동
const goToSetting = () => {
  router.push('/setting');
};
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 hidden md:flex h-16 px-6 items-center justify-between border-b border-line shadow-sm"
  >
    <div class="absolute inset-0 bg-white"></div>
    <div class="absolute inset-0 bg-accent-ui/10"></div>
    <div class="relative w-full flex items-center justify-between">
      <RouterLink to="/" class="flex items-center">
        <img :src="logo" alt="4Dollar Logo" class="h-10 w-auto" />
      </RouterLink>
      <button
        @click="goToSetting"
        class="flex items-center gap-2 text-text-primary"
      >
        <span class="text-sm font-medium">{{ userName }}</span>

        <div
          class="w-8 h-8 rounded-full bg-accent-ui/20 flex items-center justify-center"
        >
          <User class="w-4 h-4 text-text-primary" />
        </div>
      </button>
    </div>
  </header>
</template>
