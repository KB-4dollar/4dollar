<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import Button from '../ui/Button.vue';
import PageSectionLayout from '../common/PageSectionLayout.vue';
import SectionCard from '../common/SectionCard.vue';

const router = useRouter();
const emit = defineEmits(['edit']);

const props = defineProps({
  transaction: {
    type: Object,
  },
});

const formattedAmount = computed(() =>
  Number(props.transaction.amount || 0).toLocaleString('ko-KR'),
);

const hasTags = computed(
  () =>
    Array.isArray(props.transaction.tags) && props.transaction.tags.length > 0,
);

const typeBadgeClass = computed(() =>
  props.transaction.type === '수입'
    ? 'border-button-dark bg-button-dark text-button-dark-foreground'
    : 'border-line bg-surface text-text-primary',
);

const detailRows = computed(() => [
  { label: '날짜', value: props.transaction.date || '-' },
  { label: '금액', value: `${formattedAmount.value}원` },
  {
    label: props.transaction.type === '수입' ? '태그' : '카테고리',
    value:
      props.transaction.type === '수입'
        ? hasTags.value
          ? props.transaction.tags.map((tag) => `#${tag}`).join(' ')
          : '-'
        : props.transaction.category || '-',
  },
  { label: '메모', value: props.transaction.memo || '-' },
]);

const moveToList = () => {
  router.push({ name: 'transactionList' });
};

const moveToEdit = () => {
  emit('edit');
};
</script>

<template>
  <PageSectionLayout title="거래 상세">
    <div class="grid gap-5 lg:grid-cols-1">
      <div class="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
          @click="moveToList"
        >
          <span class="text-lg leading-none">‹</span>
          <span>목록으로</span>
        </button>
        <Button type="button" variant="danger" size="sm" @click="moveToEdit"
          >수정</Button
        >
      </div>

      <SectionCard>
        <div class="space-y-5">
          <div
            class="rounded-[18px] border border-line bg-surface-muted px-5 py-6"
          >
            <div class="flex items-start gap-4">
              <span
                class="inline-flex rounded-full border px-4 py-2 text-sm font-semibold"
                :class="typeBadgeClass"
              >
                {{ props.transaction.type }}
              </span>
              <span
                v-for="tag in props.transaction.tags"
                :key="tag"
                class="rounded-full bg-surface-muted px-3 py-1.5 text-sm font-semibold text-text-primary"
              >
                #{{ tag }}
              </span>
            </div>

            <div class="mt-8">
              <p class="text-sm font-semibold text-text-secondary">금액</p>
              <p
                class="mt-2 text-[2rem] font-extrabold leading-none text-text-primary"
              >
                {{ formattedAmount }}원
              </p>
            </div>
          </div>
        </div>
        <div class="space-y-4 mt-5">
          <div
            v-for="row in detailRows"
            :key="row.label"
            class="space-y-2 rounded-[16px] border border-line bg-surface px-4 py-4"
          >
            <p class="text-sm font-semibold text-text-secondary">
              {{ row.label }}
            </p>
            <p class="text-base font-semibold text-text-primary">
              {{ row.value }}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  </PageSectionLayout>
</template>
