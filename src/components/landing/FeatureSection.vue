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
        <h2 class="text-2xl font-bold mb-4">간편한 수입·지출 관리</h2>

        <ul class="text-gray-500 space-y-2">
          <li>카테고리별로 지출을 분류하고...</li>
          <li>✓ 카테고리별 분류</li>
          <li>✓ 태그 기반 관리</li>
          <li>✓ 캘린더 기반 선택</li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md">💳 UI</div>
    </div>
  </section>
</template>
