<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isOpen = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (e) => {
  const dropdown = document.getElementById('profile-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header
    class="h-16 px-6 flex items-center justify-between bg-[#d97a5f] text-white"
  >
    <!-- 로고 -->
    <RouterLink to="/" class="text-xl font-bold"> 4DOLLAR </RouterLink>

    <!-- 프로필: 아직 스타일만 적용 -->
    <div id="profile-dropdown" class="relative">
      <button @click.stop="toggleDropdown" class="flex items-center gap-2">
        <span class="text-sm">박신형</span>
        <div
          class="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
        >
          👤
        </div>
      </button>

      <!-- 드롭다운 -->
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 bg-white text-black rounded-xl shadow-lg p-2"
      >
        <button
          @click="logout"
          class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
        >
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>
