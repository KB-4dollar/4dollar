<script setup>
import PageSectionLayout from '../common/PageSectionLayout.vue';
import SectionCard from '../common/SectionCard.vue';
</script>
<template>
  <PageSectionLayout title="입출금 입력">
    <div class="grid gap-5 md:grid-cols-3">
      <SectionCard
        title="섹션 1"
        description="기본 카드도 그리드 안에서 바로 조합할 수 있습니다."
      >
      </SectionCard>

      <SectionCard
        title="섹션 2"
        description="옆 카드와 나란히 배치되는 일반 섹션입니다."
      >
      </SectionCard>
      <SectionCard
        title="섹션 3"
        description="옆 카드와 나란히 배치되는 일반 섹션입니다."
      >
      </SectionCard>
    </div>
    <div class="grid gap-5 md:grid-cols-1">
      <SectionCard
        title="섹션 1"
        description="기본 카드도 그리드 안에서 바로 조합할 수 있습니다."
      >
      </SectionCard>

      <SectionCard
        title="섹션 2"
        description="기본 카드도 그리드 안에서 바로 조합할 수 있습니다."
      >
      </SectionCard>
    </div>
  </PageSectionLayout>
</template>
