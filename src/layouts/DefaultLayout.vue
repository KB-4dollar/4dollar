<script setup>
import Header from '@/components/common/Header.vue';
import Sidebar from '@/components/common/Sidebar.vue';
import BottomNav from '@/components/common/BottomNav.vue';
import GlobarPet from '@/components/common/GlobarPet.vue';
</script>

<template>
  <div>
    <Header class="fixed top-0 left-0 w-full z-50" />

    <div class="md:pt-16 flex">
      <Sidebar />

      <main class="flex-1 bg-page-bg pb-20 md:pb-0 overflow-auto">
        <RouterView />
      </main>
    </div>

    <BottomNav />

   <GlobarPet/>
  </div>
</template>
