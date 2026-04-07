<script setup>
import { computed } from 'vue';

import { cn } from '@/lib/utils';

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
