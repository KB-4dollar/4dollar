<script setup>
import { cn } from '@/lib/utils';
import { TRANSACTION_TYPE } from '@/api/constants/enumConstants';

defineProps({
  item: Object,
  format: Function,
});

const emit = defineEmits(['click', 'delete']);
</script>

<template>
  <div
    class="flex justify-between py-4 border-b cursor-pointer hover:bg-accent/5"
    @click="$emit('click', item.id)"
  >
    <div>
      <div class="text-sm font-medium">{{ item.category }}</div>
      <div class="text-xs text-muted-foreground">{{ item.memo }}</div>
    </div>

    <div class="text-right">
      <div
        :class="
          cn(
            'font-bold',
            item.type === TRANSACTION_TYPE.INCOME ? 'text-accent-ui' : ''
          )
        "
      >
        {{ item.type === TRANSACTION_TYPE.INCOME ? '+' : '-' }}
        {{ format(item.amount) }}원
      </div>

      <button
        class="text-xs text-muted-foreground"
        @click.stop="$emit('delete', item.id)"
      >
        삭제
      </button>
    </div>
  </div>
</template>
