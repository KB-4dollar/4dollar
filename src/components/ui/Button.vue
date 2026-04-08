<script setup>
import { computed } from 'vue';

import { cn } from '@/lib/utils';

/**
 * Button props
 * @prop {string} variant 버튼 시각 스타일입니다. primary, danger, outline, ghost를 지원합니다.
 * @prop {string} size 버튼 크기입니다. sm, md, lg를 지원합니다.
 * @prop {string} type 네이티브 button type 속성입니다. 기본값은 button입니다.
 * @prop {boolean} disabled 비활성화 여부입니다.
 * @prop {boolean} fullWidth true면 버튼이 부모 너비를 가득 채웁니다.
 *
 * Notes
 * 이 컴포넌트는 $attrs를 button 요소에 그대로 전달하므로 class, id, aria-*,
 * click 이벤트 같은 일반 속성을 함께 사용할 수 있습니다.
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const baseClasses =
  'inline-flex items-center justify-center rounded-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variantClasses = {
  primary: 'bg-button-dark text-button-dark-foreground hover:opacity-90',
  danger: 'bg-accent-ui text-accent-ui-foreground hover:opacity-90',
  outline: 'border border-line bg-surface text-text-primary hover:bg-surface-muted',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary',
};

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-lg',
};

const buttonClasses = computed(() =>
  cn(
    baseClasses,
    variantClasses[props.variant] ?? variantClasses.primary,
    sizeClasses[props.size] ?? sizeClasses.md,
    props.fullWidth && 'w-full',
  ),
);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses" v-bind="$attrs">
    <slot />
  </button>
</template>
