<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { authService } from '@/api/services/authService';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// ======================
// 상태값
// ======================
const name = ref(user.value?.name || '');

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const nameMsg = ref('');
const passwordMsg = ref('');

// ======================
// 이름 변경
// ======================
const updateName = async () => {
  try {
    if (!name.value.trim()) {
      nameMsg.value = '이름을 입력해주세요.';
      return;
    }

    const updatedUser = await authService.updateUser(user.value.id, {
      name: name.value,
    });

    // store 업데이트
    authStore.login(updatedUser);

    // localStorage 업데이트
    localStorage.setItem('user', JSON.stringify(updatedUser));

    nameMsg.value = '이름이 변경되었습니다.';
  } catch (error) {
    nameMsg.value = error.message;
  }
};

// ======================
// 비밀번호 변경
// ======================
const changePassword = async () => {
  try {
    passwordMsg.value = '';

    if (!newPassword.value || !confirmPassword.value) {
      passwordMsg.value = '비밀번호를 입력해주세요.';
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      passwordMsg.value = '비밀번호가 일치하지 않습니다.';
      return;
    }

    // ⚠️ json-server-auth는 현재 비밀번호 검증 없음 (mock)
    const updatedUser = await authService.updateUser(user.value.id, {
      password: newPassword.value,
    });

    // 상태 업데이트
    authStore.login(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    passwordMsg.value = '비밀번호가 변경되었습니다.';

    // 입력 초기화
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    passwordMsg.value = error.message;
  }
};

// ======================
// 로그아웃
// ======================
const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="p-10 max-w-xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">설정</h1>

    <!-- ================= 프로필 ================= -->
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="font-semibold mb-4">프로필 정보</h2>

      <!-- 이메일 (수정 불가) -->
      <label class="text-sm">이메일</label>
      <input
        type="text"
        :value="user?.email"
        disabled
        class="w-full mt-1 mb-4 p-2 border rounded bg-gray-100"
      />

      <!-- 이름 -->
      <label class="text-sm">이름</label>
      <input v-model="name" class="w-full mt-1 p-2 border rounded" />

      <button
        @click="updateName"
        class="mt-3 bg-[#d97a5f] text-white px-4 py-2 rounded"
      >
        이름 변경
      </button>

      <p v-if="nameMsg" class="text-sm mt-2 text-green-600">
        {{ nameMsg }}
      </p>
    </div>

    <!-- ================= 비밀번호 ================= -->
    <div class="bg-white p-6 rounded-xl shadow">
      <h2 class="font-semibold mb-4">비밀번호 변경</h2>

      <input
        v-model="currentPassword"
        placeholder="현재 비밀번호"
        type="password"
        class="w-full mb-2 p-2 border rounded"
      />

      <input
        v-model="newPassword"
        placeholder="새 비밀번호"
        type="password"
        class="w-full mb-2 p-2 border rounded"
      />

      <input
        v-model="confirmPassword"
        placeholder="새 비밀번호 확인"
        type="password"
        class="w-full mb-2 p-2 border rounded"
      />

      <button
        @click="changePassword"
        class="bg-[#d97a5f] text-white px-4 py-2 rounded"
      >
        비밀번호 변경
      </button>

      <p v-if="passwordMsg" class="text-sm mt-2 text-green-600">
        {{ passwordMsg }}
      </p>
    </div>

    <!-- ================= 로그아웃 ================= -->
    <div class="bg-white p-6 rounded-xl shadow">
      <button
        @click="logout"
        class="border px-4 py-2 rounded hover:bg-gray-100"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>
