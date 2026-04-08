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
    class="h-screen snap-start flex items-center bg-gray-100"
  >
    <div class="grid grid-cols-2 gap-10 items-center px-20 w-full fade-up show">
      <div>
        <h2 class="text-2xl font-bold mb-4">한눈에 보는 거래 내역</h2>

        <ul class="text-gray-500 space-y-2">
          <li>월별, 주간별로 확인...</li>
          <li>✓ 월별/주별 확인</li>
          <li>✓ 카테고리 필터</li>
          <li>✓ 상세 조회</li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md">📊 통계</div>
    </div>
  </section>
</template>
