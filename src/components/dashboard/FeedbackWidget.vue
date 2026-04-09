<script setup>
defineProps({
  topCategory: { type: String, default: '지출 없음' },
  feedbackMessage: { type: String, default: '이번 달은 지출이 아주 깔끔하네요! 훌륭합니다. 👏' }
});

defineEmits(['refresh']);
</script>

<template>
  <div class="relative flex flex-col w-full h-full items-center justify-center bg-transparent text-center z-10">
    
    <button 
      type="button" 
      @click="$emit('refresh')" 
      class="cherry-spin cherry-text-light hover:cherry-text cherry-icon-bg absolute top-0 right-0 transition-all p-2 rounded-full text-xl leading-none"
      title="다른 팩폭 보기"
    >
      🌸
    </button>

    <span class="cherry-badge cherry-text inline-block px-4 py-1.5 mb-6 text-xs font-bold rounded-full">
      🌸 이번 달 팩폭 알림
    </span>
    
    <div class="relative px-6 w-full">
      <span class="cherry-quote absolute -top-4 left-0 text-5xl leading-none">"</span>
      <p class="text-lg md:text-xl font-bold text-text-primary leading-relaxed break-keep relative z-10">
        {{ feedbackMessage }}
      </p>
      <span class="cherry-quote absolute -bottom-8 right-0 text-5xl leading-none rotate-180">"</span>
    </div>
    
    <div class="mt-8 inline-block bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50 shadow-sm">
      <p class="text-sm text-text-muted">
        가장 지출이 큰 카테고리: <strong class="cherry-text font-extrabold">{{ topCategory }}</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.cherry-text { color: #db2777; }
.cherry-text-light { color: #f472b6; }
.hover\:cherry-text:hover { color: #db2777; }
.cherry-icon-bg:hover { background-color: rgba(255, 255, 255, 0.7); }
.cherry-badge {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #fbcfe8;
  box-shadow: 0 2px 4px rgba(219, 39, 119, 0.05);
}
.cherry-quote {
  color: #fce7f3;
  font-family: Georgia, serif;
}
@keyframes spin-cherry {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.cherry-spin:hover {
  animation: spin-cherry 1s linear infinite;
}
</style>