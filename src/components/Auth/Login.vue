<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const login = () => {
  authStore.login();
  router.push('/');
};
</script>
<template>
  <h1>Login</h1>
  <button @click="login">[로그인]</button>
</template>
<style scoped></style>
