<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { authService } from '@/api/services/authService';
import { MessageCode } from '@/api/constants/messageCode';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const name = ref(user.value?.name || '');

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const nameMsg = ref('');
const passwordMsg = ref('');

const updateName = async () => {
  try {
    if (!name.value.trim()) {
      nameMsg.value = MessageCode.NAME_REQUIRED.msg;
      return;
    }

    const updatedUser = await authService.updateUser(user.value.id, {
      name: name.value,
    });

    authStore.login(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    nameMsg.value = MessageCode.NAME_UPDATE_SUCCESS.msg;
  } catch (error) {
    nameMsg.value = error.message;
  }
};

// 비밀번호 변경
const changePassword = async () => {
  try {
    passwordMsg.value = '';

    if (!newPassword.value || !confirmPassword.value) {
      passwordMsg.value = MessageCode.PASSWORD_REQUIRED.msg;
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      passwordMsg.value = MessageCode.PASSWORD_MISMATCH.msg;
      return;
    }

    const updatedUser = await authService.updateUser(user.value.id, {
      password: newPassword.value,
    });

    authStore.login(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    passwordMsg.value = MessageCode.PASSWORD_UPDATE_SUCCESS.msg;

    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    passwordMsg.value = error.message;
  }
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="bg-page-bg min-h-screen px-6 py-10">
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-xl md:text-2xl font-bold text-text-primary">설정</h1>
      <section
        class="bg-surface border border-line rounded-xl p-6 shadow-[0_8px_24px_var(--panel-shadow)] space-y-4"
      >
        <h2 class="text-text-primary font-semibold">프로필 정보</h2>
        <div>
          <label class="text-sm text-text-secondary">이메일</label>
          <input
            :value="user?.email"
            disabled
            class="w-full mt-1 px-3 py-2 rounded-md bg-surface-muted text-text-muted border border-line"
          />
        </div>
        <div>
          <label class="text-sm text-text-secondary">이름</label>
          <input
            v-model="name"
            class="w-full mt-1 px-3 py-2 rounded-md border border-line bg-surface focus:ring-2 focus:ring-accent-ui"
          />
        </div>
        <button
          @click="updateName"
          class="bg-accent-ui text-accent-ui-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          이름 변경
        </button>

        <p v-if="nameMsg" class="text-sm text-accent-ui">
          {{ nameMsg }}
        </p>
      </section>
      <section
        class="bg-surface border border-line rounded-xl p-6 shadow-[0_8px_24px_var(--panel-shadow)] space-y-4"
      >
        <h2 class="text-text-primary font-semibold">비밀번호 변경</h2>

        <input
          v-model="currentPassword"
          placeholder="현재 비밀번호"
          type="password"
          class="w-full px-3 py-2 rounded-md border border-line bg-surface focus:ring-2 focus:ring-accent-ui"
        />

        <input
          v-model="newPassword"
          placeholder="새 비밀번호"
          type="password"
          class="w-full px-3 py-2 rounded-md border border-line bg-surface focus:ring-2 focus:ring-accent-ui"
        />

        <input
          v-model="confirmPassword"
          placeholder="새 비밀번호 확인"
          type="password"
          class="w-full px-3 py-2 rounded-md border border-line bg-surface focus:ring-2 focus:ring-accent-ui"
        />

        <button
          @click="changePassword"
          class="bg-accent-ui text-accent-ui-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          비밀번호 변경
        </button>

        <p v-if="passwordMsg" class="text-sm text-accent-ui">
          {{ passwordMsg }}
        </p>
      </section>
      <section
        class="bg-surface border border-line rounded-xl p-6 shadow-[0_8px_24px_var(--panel-shadow)]"
      >
        <button
          @click="logout"
          class="w-full border border-line text-text-primary px-4 py-2 rounded-lg hover:bg-surface-muted transition"
        >
          로그아웃
        </button>
      </section>
    </div>
  </div>
</template>
