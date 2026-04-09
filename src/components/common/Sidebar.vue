<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const menus = [
  { name: '대시보드', path: '/app' },
  { name: '거래내역', path: '/list' },
];
</script>
<template>
  <!-- ✅ PC용 사이드바 -->
  <aside class="hidden md:flex w-60 bg-white p-5 flex-col">
    <nav class="flex flex-col gap-3">
      <RouterLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="px-4 py-4 rounded-xl transition"
        :class="
          route.path === menu.path
            ? 'bg-[#d97a5f] text-white'
            : 'text-gray-700 hover:bg-gray-200'
        "
      >
        {{ menu.name }}
      </RouterLink>
    </nav>
  </aside>

  <!-- ✅ 모바일 하단 네비 (밖으로 빼기) -->
  <nav
    class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 h-16 flex justify-around items-center md:hidden"
  >
    <RouterLink
      v-for="menu in menus"
      :key="menu.path"
      :to="menu.path"
      class="text-sm"
      :class="route.path === menu.path ? 'text-[#d97a5f]' : 'text-gray-500'"
    >
      {{ menu.name }}
    </RouterLink>
  </nav>
</template>
