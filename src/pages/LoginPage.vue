<script setup>
import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const login = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/users?email=${email.value}`
    );
    const user = response.data[0];

    if (!user) {
      errorMsg.value = '존재하지 않는 이메일입니다.';
      return;
    }
    if (user.password !== password.value) {
      errorMsg.value = '비밀번호가 일치하지 않습니다.';
      return;
    }
    authStore.login(user);
    router.push('/');
  } catch (error) {
    console.error(error);
    errorMsg.value = '로그인 중 오류가 발생했습니다. ';
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
      <input v-model="password" type="password" />
    </div>

    <button @click="login">로그인</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>

    <div>
      <RouterLink to="/signup">계정이 없으신가요? 회원가입</RouterLink>
    </div>
  </div>
</template>
<style scoped>
.login {
  width: 448px;
}
</style>
