<script setup>
import SectionCard from '@/components/common/SectionCard.vue';
import TransactionItem from './TransactionItem.vue';
import TransactionEmpty from './TransactionEmpty.vue';

defineProps({
  items: Array,
  isLoading: Boolean,
  isEmpty: Boolean,
  format: Function,
});

const emit = defineEmits(['click', 'delete']);
</script>

<template>
  <SectionCard variant="flat">
    <div class="max-h-[500px] overflow-y-auto">
      <div v-if="isLoading" class="py-10 text-center">로딩중...</div>

      <TransactionEmpty v-else-if="isEmpty" />

      <div v-else>
        <TransactionItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          :format="format"
          @click="$emit('click', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </SectionCard>
</template>
