<script setup>
import { ref } from 'vue';
import { authService } from '@/api/services/authService';
import router from '@/router';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMsg = ref('');

const signup = async () => {
  try {
    if (!email.value || !password.value) {
      errorMsg.value = '이메일과 비밀번호를 입력하세요';
      return;
    }
    if (password.value !== passwordConfirm.value) {
      errorMsg.value = '비밀번호가 일치하지 않습니다.';
      return;
    }

    await authService.register({
      email: email.value,
      password: password.value,
      username: name.value, // 내부용
      name: name.value, // UI용
    });

    router.push('/login');
  } catch (error) {
    console.log(error.response?.data);
    errorMsg.value = error.message;
  }
};
</script>

<template>
  <div class="signup">
    <h1 class="text-2xl font-bold">회원가입</h1>

    <div class="form-group">
      <label>이름</label>
      <input v-model="name" type="text" />
    </div>

    <div class="form-group">
      <label>이메일</label>
      <input v-model="email" type="email" />
    </div>

    <div class="form-group">
      <label>비밀번호</label>
      <input v-model="password" type="password" />
    </div>

    <div class="form-group">
      <label>비밀번호 확인</label>
      <input v-model="passwordConfirm" type="password" />
    </div>

    <button @click="signup">회원가입</button>

    <p v-if="errorMsg">{{ errorMsg }}</p>
    <div>
      <RouterLink to="/login">이미 계정이 있으신가요? 로그인</RouterLink>
    </div>
  </div>
</template>
<style scoped></style>
