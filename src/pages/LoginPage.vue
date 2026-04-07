<script setup>
import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const login = () => {
  authStore.login();
  router.push('/');
};
</script>
<template>
  <div class="login">
    <h1 class="text-2xl font-bold">로그인</h1>

    <div class="form-group">
      <label>이메일</label>
      <input type="email" />
    </div>

    <div class="form-group">
      <label>비밀번호</label>
      <input type="password" />
    </div>

    <button @onClink="login">로그인</button>

    <div class="signup-link">
      <RouterLink to="/signup">회원가입</RouterLink>
    </div>
  </div>
</template>
<style scoped>
.login {
  width: 448px;
}
</style>
