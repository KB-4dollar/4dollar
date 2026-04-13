<script setup>
import { useRoute } from 'vue-router';


const route = useRoute();

const menus = [
  { name: '대시보드', path: '/app' },
  { name: '거래내역', path: '/list' },
];
</script>

<template>
  <aside
    class="hidden md:flex fixed top-16 left-0 w-60 h-[calc(100vh-4rem)] bg-surface p-5 flex-col shadow-[4px_0_20px_var(--panel-shadow)]"
  >
    <nav class="flex flex-col gap-3">
      <RouterLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="px-4 py-4 rounded-xl transition-all duration-200"
        :class="
          route.path === menu.path
            ? 'bg-button-dark text-button-dark-foreground shadow-md'
            : 'text-text-secondary hover:bg-surface-muted'
        "
      >
        {{ menu.name }}
      </RouterLink>
    </nav>
  </aside>

  <nav
    class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 h-16 flex justify-around items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
  >
    <RouterLink
      v-for="menu in menus"
      :key="menu.path"
      :to="menu.path"
      class="text-sm font-medium transition"
      :class="route.path === menu.path ? 'text-pink-400' : 'text-gray-500'"
    >
      {{ menu.name }}
    </RouterLink>
  </nav>
</template>
