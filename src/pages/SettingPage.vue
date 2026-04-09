<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { authService } from '@/api/services/authService';
import { MessageCode } from '@/api/constants/messageCode';
import PageSectionLayout from '@/components/common/PageSectionLayout.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SectionStack from '@/components/common/SectionStack.vue';
import Button from '@/components/ui/Button.vue';
import ToastMessage from '@/components/ui/ToastMessage.vue';
import FormInput from '@/components/ui/FormInput.vue';
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const name = ref(user.value?.name || '');

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const nameMsg = ref('');
const passwordMsg = ref('');

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

const updateName = async () => {
  if (!name.value.trim()) {
    nameMsg.value = MessageCode.NAME_REQUIRED.msg;
    return;
  }

  const updatedUser = await authService.updateUser(user.value.id, {
    name: name.value,
  });

  authStore.login(updatedUser);
  showToast(MessageCode.NAME_UPDATE_SUCCESS.msg);
};

const changePassword = async () => {
  passwordMsg.value = '';

  if (!currentPassword.value) {
    passwordMsg.value = MessageCode.PASSWORD_REQUIRED.msg;
    return;
  }

  if (!newPassword.value || !confirmPassword.value) {
    passwordMsg.value = MessageCode.PASSWORD_REQUIRED.msg;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordMsg.value = MessageCode.PASSWORD_MISMATCH.msg;
    return;
  }

  try {
    await authService.login({
      email: user.value.email,
      password: currentPassword.value,
    });
  } catch {
    passwordMsg.value = MessageCode.PASSWORD_INCORRECT.msg;
    return;
  }

  const updatedUser = await authService.updateUser(user.value.id, {
    password: newPassword.value,
  });

  authStore.login(updatedUser);
  passwordMsg.value = '';
  showToast(MessageCode.PASSWORD_UPDATE_SUCCESS.msg);
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
<template>
  <PageSectionLayout title="설정">
    <SectionStack>
      <!-- 프로필 -->
      <SectionCard title="프로필 정보">
        <div class="flex flex-col gap-3">
          <FormInput :model-value="user?.email" disabled />

          <FormInput v-model="name" />
        </div>

        <Button @click="updateName" variant="danger" size="md" class="mt-4">
          이름 변경
        </Button>

        <p v-if="nameMsg" class="text-sm text-accent-ui mt-2">
          {{ nameMsg }}
        </p>
      </SectionCard>

      <!-- 비밀번호 -->
      <SectionCard title="비밀번호 변경">
        <div class="flex flex-col gap-3">
          <FormInput v-model="currentPassword" type="password" />

          <FormInput v-model="newPassword" type="password" />
          <FormInput v-model="confirmPassword" type="password" />
        </div>

        <Button @click="changePassword" variant="danger" size="md" class="mt-4">
          비밀번호 변경
        </Button>

        <p v-if="passwordMsg" class="text-sm text-accent-ui mt-2">
          {{ passwordMsg }}
        </p>
      </SectionCard>

      <!-- 로그아웃 -->
      <SectionCard>
        <Button @click="logout" variant="primary" size="md" fullWidth>
          로그아웃
        </Button>
      </SectionCard>
    </SectionStack>
  </PageSectionLayout>

  <ToastMessage :open="isToastOpen" :message="toastMessage" />
</template>
