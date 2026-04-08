<script setup>
import { ref } from 'vue';

const sectionEl = ref(null);

defineExpose({
  el: sectionEl,
});
</script>
<template>
  <section
    ref="sectionEl"
    class="h-screen snap-start flex items-center bg-[#f6e9e4]"
  >
    <div class="grid grid-cols-2 gap-10 items-center px-20 w-full fade-up show">
      <div class="bg-white p-6 rounded-xl shadow-md">📋 리스트</div>

      <div>
        <h2 class="text-2xl font-bold mb-4">경조사비 특화 관리</h2>

        <ul class="text-gray-500 space-y-2">
          <li>결혼, 장례 등 관리 설명...</li>
          <li>✓ 결혼/장례 관리</li>
          <li>✓ 대상자별 기록</li>
          <li>✓ 금액 추천</li>
        </ul>
      </div>
    </div>
  </section>
</template>
