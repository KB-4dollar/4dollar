<script setup>
import SectionCard from '@/components/common/SectionCard.vue';
</script>

<template>
  <SectionCard class="flex-1 flex flex-col justify-center items-center border-dashed border-2 border-line bg-surface/50 group hover:border-[#db2777]/50 transition-colors cursor-pointer">
    <div class="text-center">
      <div class="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-3 group-hover:bg-[#db2777]/10 transition-colors">
        <span class="text-2xl text-text-muted group-hover:text-[#db2777]">🎯</span>
      </div>
      <h3 class="text-base font-bold text-text-primary mb-1">목표 소비 설정</h3>
      <p class="text-xs text-text-muted">이번 달 예산을 세우고<br/>지출을 관리해보세요</p>
    </div>
  </SectionCard>
</template>