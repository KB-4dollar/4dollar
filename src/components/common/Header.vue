<script setup>
import { computed } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const userName = computed(() => authStore.user?.name || '사용자');

// ✅ 클릭 시 설정페이지 이동
const goToSetting = () => {
  router.push('/setting');
};
</script>

<template>
  <header
    class="h-16 px-6 flex items-center justify-between bg-[#d97a5f] text-white"
  >
    <RouterLink to="/" class="text-xl font-bold">4DOLLAR</RouterLink>

    <!-- ✅ 클릭하면 설정페이지로 -->
    <button @click="goToSetting" class="flex items-center gap-2">
      <span class="text-sm">{{ userName }}</span>
      <div
        class="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
      >
        👤
      </div>
    </button>
  </header>
</template>
