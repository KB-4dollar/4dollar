<script setup>
import { cn } from '@/lib/utils';
import { TRANSACTION_TYPE, CATEGORY } from '@/api/constants/enumConstants';

defineProps({
  item: Object,
  format: Function,
});

const emit = defineEmits(['click', 'delete']);

const CATEGORY_ICON_MAP = {
  [CATEGORY.FOOD]: '🍽️',
  [CATEGORY.TRANSPORT]: '🚌',
  [CATEGORY.CULTURE]: '🎬',
  [CATEGORY.HOSPITAL]: '🏥',
  [CATEGORY.LIVING]: '🛒',
  [CATEGORY.EVENT]: '🎁',
  [CATEGORY.ETC]: '📌',
};
</script>

<template>
  <div
    class="flex items-center justify-between py-4 border-b last:border-0 hover:bg-accent/5 transition cursor-pointer"
    @click="$emit('click', item.id)"
  >
    <!-- 왼쪽 -->
    <div class="flex items-center gap-4">
      <!-- 아이콘 -->
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center bg-accent-ui text-white text-lg"
      >
        {{ CATEGORY_ICON_MAP[item.category] ?? '💳' }}
      </div>

      <!-- 텍스트 -->
      <div>
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <!-- 타입 -->
          <span
            :class="
              cn(
                'text-[10px] px-2 py-0.5 rounded-full font-medium',
                item.type === TRANSACTION_TYPE.INCOME
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-200 text-green-600'
              )
            "
          >
            {{ item.type }}
          </span>

          <!-- 카테고리 -->
          <span class="text-sm font-medium text-text-primary">
            {{ item.category }}
          </span>

          <!-- 태그 -->
          <span
            v-for="(tag, i) in item.tags"
            :key="i"
            class="text-xs text-muted-foreground"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 메모 -->
        <div class="text-xs text-muted-foreground">
          {{ item.memo }}
        </div>
      </div>
    </div>

    <!-- 오른쪽 -->
    <div class="text-right">
      <!-- 금액 -->
      <div
        :class="
          cn(
            'font-bold text-sm',
            item.type === TRANSACTION_TYPE.INCOME
              ? 'text-accent-ui'
              : 'text-text-primary'
          )
        "
      >
        {{ item.type === TRANSACTION_TYPE.INCOME ? '+' : '-' }}
        {{ format(item.amount) }}원
      </div>

      <!-- 날짜 -->
      <div class="text-[10px] text-muted-foreground">
        {{ item.date }}
      </div>

      <!-- 삭제 -->
      <button
        @click.stop="$emit('delete', item.id)"
        class="mt-1 text-[10px] text-muted-foreground hover:text-red-500"
      >
        삭제
      </button>
    </div>
  </div>
</template>
