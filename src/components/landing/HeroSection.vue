<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const sectionEl = ref(null);

const goLogin = () => {
  router.push('/login');
  alert('클릭됨');
};

defineExpose({
  el: sectionEl,
});
</script>

<template>
  <section
    ref="sectionEl"
    class="h-screen snap-start flex items-center justify-center relative text-white"
    style="
      background: linear-gradient(
        135deg,
        #fef9d7 0%,
        #fdf6d9 7%,
        #fbf4dc 14%,
        #faf1de 21%,
        #f9eee0 29%,
        #f3c1bb 90%
      );
    "
  >
    <div
      class="relative z-10 flex flex-col items-center text-center fade-up show"
    >
      <div
        class="mb-6 px-4 py-1 rounded-full bg-[#e26d5c] text-white text-sm font-medium shadow-sm"
      >
        스마트한 가계부 관리
      </div>
      <h1 class="text-5xl font-bold text-[#e26d5c] mb-4">4dollars</h1>
      <p class="text-gray-600 mb-8">
        경조사비부터 일상 지출까지, 모든 거래를 한눈에
      </p>
      <button
        @click="goLogin"
        class="relative z-20 bg-[#e26d5c] text-white px-8 py-3 rounded-xl shadow-md transition-all duration-300 hover:bg-[#d85745] hover:shadow-lg hover:scale-105 active:scale-95"
      >
        바로가기
      </button>
    </div>
    <div
      class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 text-sm pointer-events-none"
    >
      <p class="mb-2">아래로 스크롤하여 더 알아보기</p>
      <div class="animate-bounce text-lg">↓</div>
    </div>
  </section>
</template>
