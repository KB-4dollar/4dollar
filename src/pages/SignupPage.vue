<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfrim = ref('');
const errorMsg = ref('');

const signup = async () => {
  try {
    //1. 비밀번호를 확인한다.
    if (password.value !== passwordConfrim.value) {
      errorMsg.value = '비밀번호가 일치하지 않습니다. ';
      return;
    }
    //2.이메일 중복을 체크한다.
    const response = await axios.get(
      `http://localhost:3000/users?email=${email.value}`
    );
    if (response.data.length > 0) {
      errorMsg.value = '이미 존재하는 이메일입니다.';
      return;
    }
    //3. 회원을 생성한다.
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    await axios.post('http://localhost:3000/users', newUser);
    router.push('/login');
  } catch (error) {
    console.error(error);
    errorMsg.value = '회원가입 중 오류가 발생했습니다. ';
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
