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
  <div class="min-h-screen flex items-center justify-center bg-[#f5f2ef]">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <!-- 제목 -->
      <h1 class="text-2xl font-bold text-center mb-6">회원가입</h1>

      <!-- 이름 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">
          이름 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="name"
          type="text"
          placeholder="이름을 입력하세요 (2~10자)"
          class="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- 이메일 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">
          이메일 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="이메일을 입력하세요"
          class="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- 비밀번호 -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">
          비밀번호 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요 (8자 이상)"
          class="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">
          비밀번호 확인 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          class="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- 버튼 -->
      <button
        @click="signup"
        :disabled="!name || !email || !password || !passwordConfirm"
        class="w-full py-3 rounded-lg bg-gray-300 text-white font-semibold disabled:opacity-50"
      >
        회원가입
      </button>

      <!-- 에러 메시지 -->
      <p v-if="errorMsg" class="text-red-500 text-sm mt-3 text-center">
        {{ errorMsg }}
      </p>

      <!-- 로그인 이동 -->
      <div class="text-center mt-6 text-sm text-gray-500">
        이미 계정이 있으신가요?
        <RouterLink to="/login" class="text-gray-700 font-medium ml-1">
          로그인
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
