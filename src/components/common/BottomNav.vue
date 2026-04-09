<script setup>
import { useRoute } from 'vue-router';
import { Home, BarChart3, FileText, Plus, User } from 'lucide-vue-next';

const route = useRoute();

const menus = [
  { path: '/', icon: Home },
  { path: '/app', icon: BarChart3 },
  // { path: '/transaction/new', icon: Plus, isMain: true },
  { path: '/list', icon: FileText },
  { path: '/setting', icon: User },
];
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 w-full h-16 bg-surface border-t border-line flex justify-around items-center md:hidden z-50"
  >
    <RouterLink
      v-for="menu in menus"
      :key="menu.path"
      :to="menu.path"
      class="flex flex-col items-center justify-center"
    >
      <component
        :is="menu.icon"
        :size="menu.isMain ? 32 : 30"
        :class="
          menu.isMain
            ? 'bg-accent-ui text-white rounded-full w-14 h-14 flex items-center justify-center -mt-8 shadow-xl border-4 border-surface'
            : route.path === menu.path
              ? 'text-accent-ui'
              : 'text-text-muted'
        "
      />
    </RouterLink>
  </nav>
</template>
