<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- [이미지 임포트] ---
import run1 from '@/assets/runcurbe1.svg';
import run2 from '@/assets/runcurbe2.svg';

const runFrames = [run1, run2];
const currentFrameIndex = ref(0);
let frameInterval = null;

// 로딩 멘트
const loadingMessage = ref("데이터 분석 중...");

onMounted(() => {
  // 🏃‍♂️ 달리기 프레임 교체 (150ms)
  frameInterval = setInterval(() => {
    currentFrameIndex.value = (currentFrameIndex.value + 1) % runFrames.length;
  }, 150);
});

onUnmounted(() => {
  if (frameInterval) clearInterval(frameInterval);
});
</script>

<template>
  <div class="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center select-none pointer-events-auto min-h-[400px]">
    
    <div class="flex flex-col items-center gap-8">
      
      <div class="w-32 h-32 md:w-44 md:h-44 drop-shadow-xl flex justify-center items-center">
        <img 
          :src="runFrames[currentFrameIndex]" 
          alt="loading curbe" 
          class="w-full h-full object-contain"
        />
      </div>

      <div class="flex flex-col items-center gap-2">
        <div class="bg-white border-2 cherry-border rounded-full px-8 py-2 shadow-sm">
          <p class="text-sm md:text-base font-extrabold cherry-text animate-pulse tracking-tight text-center break-keep">
            {{ loadingMessage }}
          </p>
        </div>
        <p class="text-[10px] text-text-muted opacity-60">잠시만 기다려 주세요</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 멘트 깜빡임 효과 */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 벚꽃 테마 컬러 변수 (Global 스타일과 맞춤) */
.cherry-border { border-color: #fbcfe8; }
.cherry-text { color: #db2777; }
</style>
