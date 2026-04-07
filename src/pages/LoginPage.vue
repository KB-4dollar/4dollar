<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/api/services/authService';
import { ref } from 'vue';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const login = async () => {
  try {
    if (!email.value || !password.value) {
      errorMsg.value = '이메일과 비밀번호를 입력해주세요.';
      return;
    }
    const user = await authService.login({
      email: email.value,
      password: password.value,
    });

    authStore.login(user);
    router.push('/');
  } catch (error) {
    errorMsg.value = error.message;
  }
};
</script>
<template>
  <div class="login">
    <h1 class="text-2xl font-bold">로그인</h1>

    <div class="form-group">
      <label>이메일</label>
      <input v-model="email" type="email" />
    </div>

    <div class="form-group">
      <label>비밀번호</label>
      <input v-model="password" type="password" @keyup.enter="login" />
    </div>

    <button @click="login">로그인</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>

    <div>
      <RouterLink to="/signup">계정이 없으신가요? 회원가입</RouterLink>
    </div>
  </div>
</template>
<style scoped></style>
