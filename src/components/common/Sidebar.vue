<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const menus = [
  { name: '대시보드', path: '/' },
  { name: '거래내역', path: '/list' },
  { name: '입출금', path: '/transaction/new' },
];
</script>

<template>
  <aside class="w-60 bg-white p-5 flex flex-col">
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
</template>
