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
  <div class="min-h-screen flex items-center justify-center bg-page-bg px-4">
    <div
      class="w-full max-w-md bg-surface border border-line rounded-xl p-8 shadow-[0_8px_24px_var(--panel-shadow)]"
    >
      <h1
        class="text-xl md:text-2xl font-bold text-text-primary text-center mb-6"
      >
        로그인
      </h1>

      <div class="mb-4">
        <label class="block text-sm text-text-secondary mb-1">
          이메일 <span class="text-accent-ui">*</span>
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="이메일을 입력하세요"
          class="w-full px-4 py-3 rounded-md border border-line bg-surface-muted focus:ring-2 focus:ring-accent-ui outline-none"
        />
      </div>
      <div class="mb-6">
        <label class="block text-sm text-text-secondary mb-1">
          비밀번호 <span class="text-accent-ui">*</span>
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          @keyup.enter="login"
          class="w-full px-4 py-3 rounded-md border border-line bg-surface-muted focus:ring-2 focus:ring-accent-ui outline-none"
        />
      </div>
      <button
        @click="login"
        :disabled="!email || !password"
        class="w-full py-3 rounded-lg font-semibold transition bg-accent-ui text-accent-ui-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      >
        로그인
      </button>
      <p v-if="errorMsg" class="text-sm text-accent-ui mt-3 text-center">
        {{ errorMsg }}
      </p>
      <div class="text-center mt-6 text-sm text-text-secondary">
        계정이 없으신가요?
        <RouterLink
          to="/signup"
          class="text-text-primary font-medium ml-1 hover:underline"
        >
          회원가입
        </RouterLink>
      </div>
    </div>
  </div>
</template>
