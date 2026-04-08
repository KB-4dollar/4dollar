<script setup>
import { ref } from 'vue';

const sectionEl = ref(null);

defineExpose({
  el: sectionEl,
});
</script>
<template>
  <section ref="sectionEl" class="section bg-[#e26d5c] text-white">
    <div class="content-center fade-u show">
      <h2 class="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
      <p class="mb-6">스마트한 가계부 관리</p>
      <button class="bg-white text-[#e26d5c] px-6 py-3 rounded-xl">
        시작하기 →
      </button>
    </div>
  </section>
</template>
