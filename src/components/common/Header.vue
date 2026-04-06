<!-- src/components/common/Header.vue -->
<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
<template>
  <header
    class="h-15 p-4 flex flex-row justify-between items-center border-2 border-pink-500"
  >
    <div>
      <a href="#"><RouterLink to="/">4$DOLLAR</RouterLink></a>
    </div>
    <nav class="flex gap-3">
      <div>
        <a href="#"><RouterLink to="/">대시보드</RouterLink></a>
      </div>
      <div>
        <a href="#"><RouterLink to="/list">거래내역</RouterLink></a>
      </div>
    </nav>
    <div>
      <button @click="logout">로그아웃</button>
    </div>
  </header>
</template>
