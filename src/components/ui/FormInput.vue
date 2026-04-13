<script setup>
defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    class="w-full h-12 px-4 rounded-[14px] border-2 border-line bg-surface text-sm focus:border-accent-ui focus:ring-2 focus:ring-accent-ui/20 outline-none disabled:bg-surface-muted disabled:text-text-muted"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
