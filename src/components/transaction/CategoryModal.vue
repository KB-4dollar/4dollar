<script setup>
import BaseModal from '../ui/BaseModal.vue';
import Button from '../ui/Button.vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  selectedCategory: {
    type: String,
    default: '',
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'select']);

const CATEGORY_ICONS = {
  식비: '🍜',
  교통: '🚗',
  문화생활: '💵',
  병원: '🪑',
  생활용품: '👕',
  경조사비: '🎁',
  '편의점/마트': '🏪',
  기타: '🔍',
};

const closeModal = () => {
  emit('close');
};

const selectCategory = (category) => {
  emit('select', category);
};
</script>

<template>
  <BaseModal
    :open="open"
    title="카테고리 선택"
    max-width-class="max-w-[430px]"
    @close="closeModal"
  >
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="flex min-h-[108px] flex-col items-center justify-center rounded-[16px] border bg-surface px-4 py-5 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-colors"
        :class="
          selectedCategory === category
            ? 'border-accent-ui bg-[#fff4f1]'
            : 'border-line hover:bg-surface-muted'
        "
        @click="selectCategory(category)"
      >
        <span class="text-[2rem] leading-none">
          {{ CATEGORY_ICONS[category] ?? '•' }}
        </span>
        <span class="mt-3 text-[1.05rem] font-semibold text-text-primary">
          {{ category }}
        </span>
      </button>
    </div>

    <div class="mt-24">
      <Button
        type="button"
        size="lg"
        fullWidth
        :disabled="!selectedCategory"
        @click="closeModal"
      >
        추가
      </Button>
    </div>
  </BaseModal>
</template>
