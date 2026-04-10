<script setup>
import { cn } from '@/lib/utils';
import { TRANSACTION_TYPE } from '@/api/constants/enumConstants';

const props = defineProps({
  activeType: String,
});

const emit = defineEmits(['update:type']);
</script>

<template>
  <div>
    <div class="text-sm text-muted-foreground mb-3">유형</div>

    <div class="flex gap-2">
      <button
        v-for="type in [
          '전체',
          TRANSACTION_TYPE.INCOME,
          TRANSACTION_TYPE.EXPENSE,
        ]"
        :key="type"
        :class="
          cn(
            'px-4 py-1.5 rounded-full text-sm font-medium',
            props.activeType === type
              ? 'bg-accent-ui text-white'
              : 'bg-button-dark text-white/70'
          )
        "
        @click="$emit('update:type', type)"
      >
        {{ type }}
      </button>
    </div>
  </div>
</template>
