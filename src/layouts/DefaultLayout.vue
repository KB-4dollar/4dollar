<script setup>
import Header from '@/components/common/Header.vue';
import Sidebar from '@/components/common/Sidebar.vue';
</script>

<template>
  <div>
    <!-- Header -->
    <Header class="fixed top-0 left-0 w-full z-50" />

    <!-- 본문 -->
    <div class="pt-16 flex">
      <Sidebar />

      <main class="flex-1 bg-gray-50 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
