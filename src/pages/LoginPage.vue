<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/api/services/authService';
import { ErrorCode } from '@/api/constants/errorCode';
import { ref } from 'vue';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const login = async () => {
  try {
    errorMsg.value = '';

    if (!email.value || !password.value) {
      errorMsg.value = ErrorCode.REQUIRED.msg;
      return;
    }

    const user = await authService.login({
      email: email.value,
      password: password.value,
    });

    authStore.login(user);
    router.push('/app');
  } catch (error) {
    errorMsg.value = error.message;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f5f2ef]">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-center mb-6">로그인</h1>

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
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">
          비밀번호 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요 (8자 이상)"
          @keyup.enter="login"
          class="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- 버튼 -->
      <button
        @click="login"
        :disabled="!email || !password"
        class="w-full py-3 rounded-lg bg-gray-300 text-white font-semibold disabled:opacity-50 enabled:bg-black"
      >
        로그인
      </button>

      <!-- 에러 -->
      <p v-if="errorMsg" class="text-red-500 text-sm mt-3 text-center">
        {{ errorMsg }}
      </p>

      <!-- 회원가입 -->
      <div class="text-center mt-6 text-sm text-gray-500">
        계정이 없으신가요?
        <RouterLink to="/signup" class="text-gray-700 font-medium ml-1">
          회원가입
        </RouterLink>
      </div>
    </div>
  </div>
</template>
