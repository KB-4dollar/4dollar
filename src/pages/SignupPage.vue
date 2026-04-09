<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { authService } from '@/api/services/authService';
import router from '@/router';
import { validateSignup } from '@/utils/validation';
import Button from '@/components/ui/Button.vue';
import { MessageCode } from '@/api/constants/messageCode.js';
import ToastMessage from '@/components/ui/ToastMessage.vue';
import FormInput from '@/components/ui/FormInput.vue';
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMsg = ref('');

const signup = async () => {
  try {
    errorMsg.value = '';

    validateSignup({
      name: name.value,
      email: email.value,
      password: password.value,
      confirm: passwordConfirm.value,
    });

    await authService.register({
      email: email.value,
      password: password.value,
      username: name.value,
      name: name.value,
    });
    showToast(MessageCode.SIGNUP_SUCCESS.msg);

    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (error) {
    errorMsg.value = error.message;
  }
};

// 🔥 toast 템플릿 (복붙용)
const toastMessage = ref('');
const isToastOpen = ref(false);

let toastTimerId = null;

const showToast = (message) => {
  toastMessage.value = message;
  isToastOpen.value = true;

  if (toastTimerId) clearTimeout(toastTimerId);

  toastTimerId = setTimeout(() => {
    isToastOpen.value = false;
    toastMessage.value = '';
  }, 2500);
};

onBeforeUnmount(() => {
  if (toastTimerId) clearTimeout(toastTimerId);
});
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-page-bg px-4">
    <div
      class="w-full max-w-md bg-surface border border-line rounded-xl p-8 shadow-[0_8px_24px_var(--panel-shadow)]"
    >
      <h1
        class="text-xl md:text-2xl font-bold text-text-primary text-center mb-6"
      >
        회원가입
      </h1>

      <!-- 이름 -->
      <div class="mb-4">
        <label class="block text-sm text-text-secondary mb-1">
          이름 <span class="text-accent-ui">*</span>
        </label>
        <FormInput v-model="name" placeholder="이름을 입력하세요" />
      </div>

      <!-- 이메일 -->
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

      <!-- 비밀번호 -->
      <div class="mb-4">
        <label class="block text-sm text-text-secondary mb-1">
          비밀번호 <span class="text-accent-ui">*</span>
        </label>
        <FormInput
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div class="mb-6">
        <label class="block text-sm text-text-secondary mb-1">
          비밀번호 확인 <span class="text-accent-ui">*</span>
        </label>
        <FormInput
          v-model="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </div>

      <Button
        @click="signup"
        variant="danger"
        size="md"
        fullWidth
        :disabled="!name || !email || !password || !passwordConfirm"
        class="mt-2"
      >
        회원가입
      </Button>

      <p v-if="errorMsg" class="text-sm text-accent-ui mt-3 text-center">
        {{ errorMsg }}
      </p>

      <div class="text-center mt-6 text-sm text-text-secondary">
        이미 계정이 있으신가요?
        <RouterLink
          to="/login"
          class="text-text-primary font-medium ml-1 hover:underline"
        >
          로그인
        </RouterLink>
      </div>
    </div>
  </div>

  <ToastMessage :open="isToastOpen" :message="toastMessage" />
</template>
