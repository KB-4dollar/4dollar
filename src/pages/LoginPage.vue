<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/api/services/authService';
import { ErrorCode } from '@/api/constants/errorCode';
import { ref, onBeforeUnmount } from 'vue';
import Button from '@/components/ui/Button.vue';
import { MessageCode } from '@/api/constants/messageCode.js';
import ToastMessage from '@/components/ui/ToastMessage.vue';
import FormInput from '@/components/ui/FormInput.vue';
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const toastMessage = ref('');
const isToastOpen = ref(false);

let timer = null;

const showToast = (msg) => {
  toastMessage.value = msg;
  isToastOpen.value = true;

  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    isToastOpen.value = false;
    toastMessage.value = '';
  }, 2000);
};

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

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
    showToast(MessageCode.LOGIN_SUCCESS.msg);

    setTimeout(() => {
      router.push('/app');
    }, 1000);
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
        <FormInput
          v-model="email"
          type="email"
          placeholder="이메일을 입력하세요"
        />
      </div>
      <div class="mb-6">
        <label class="block text-sm text-text-secondary mb-1">
          비밀번호 <span class="text-accent-ui">*</span>
        </label>
        <FormInput
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          @keyup.enter="login"
        />
      </div>
      <Button
        @click="login"
        variant="danger"
        size="md"
        fullWidth
        :disabled="!email || !password"
      >
        로그인
      </Button>
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
  <ToastMessage :open="isToastOpen" :message="toastMessage" />
</template>
