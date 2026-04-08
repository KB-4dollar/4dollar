<script setup>
import PageSectionLayout from '../common/PageSectionLayout.vue';
import SectionCard from '../common/SectionCard.vue';
</script>
<template>
  <PageSectionLayout title="거래 상세">
    <div class="grid gap-5 md:grid-cols-1">
      <!-- 목록으로   삭제 버튼 -->
      <SectionCard
        title="섹션 1"
        description="기본 카드도 그리드 안에서 바로 조합할 수 있습니다."
      >
      </SectionCard>
    </div>
  </PageSectionLayout>
</template>
