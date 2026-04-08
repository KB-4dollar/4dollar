<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const parseDateString = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const selectedDate = computed(() => parseDateString(props.modelValue));
const visibleMonth = ref(
  new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1),
);

watch(
  () => props.modelValue,
  (value) => {
    const nextDate = parseDateString(value);
    visibleMonth.value = new Date(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      1,
    );
  },
);

const calendarTitle = computed(
  () =>
    `${visibleMonth.value.getFullYear()}년 ${visibleMonth.value.getMonth() + 1}월`,
);

const calendarDays = computed(() => {
  const year = visibleMonth.value.getFullYear();
  const month = visibleMonth.value.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let index = 0; index < firstDay; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    days.push({
      day,
      value: formatDateString(date),
    });
  }

  return days;
});

const moveMonth = (offset) => {
  visibleMonth.value = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + offset,
    1,
  );
};

const selectDate = (dateValue) => {
  emit('update:modelValue', dateValue);
};

const formattedSelectedDate = computed(() => {
  const date = selectedDate.value;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`;
});
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex items-center justify-between gap-2 sm:gap-4">
      <button
        type="button"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-3xl leading-none text-text-primary transition-colors hover:bg-surface-muted sm:h-11 sm:w-11 sm:text-4xl"
        @click="moveMonth(-1)"
      >
        ‹
      </button>
      <h3
        class="text-center text-[1.7rem] font-extrabold leading-none text-text-primary sm:text-[1.95rem]"
      >
        {{ calendarTitle }}
      </h3>
      <button
        type="button"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-3xl leading-none text-text-primary transition-colors hover:bg-surface-muted sm:h-11 sm:w-11 sm:text-4xl"
        @click="moveMonth(1)"
      >
        ›
      </button>
    </div>
    <div class="grid grid-cols-7 gap-x-2 gap-y-3 sm:gap-x-4 sm:gap-y-5">
      <span
        v-for="weekday in WEEK_DAYS"
        :key="weekday"
        class="text-center text-sm font-semibold text-text-secondary sm:text-[1.05rem]"
      >
        {{ weekday }}
      </span>

      <template
        v-for="(dateItem, index) in calendarDays"
        :key="dateItem?.value ?? `empty-${index}`"
      >
        <div v-if="!dateItem" class="aspect-square min-h-10.5 sm:min-h-12.5" />
        <button
          v-else
          type="button"
          class="flex aspect-square min-h-10.5 items-center justify-center rounded-[12px] border text-lg font-medium transition-colors sm:min-h-12.5 sm:rounded-2xl sm:text-[1.2rem]"
          :class="
            modelValue === dateItem.value
              ? 'border-black bg-black text-white hover:bg-black'
              : 'border-line bg-surface text-text-primary hover:bg-surface-muted'
          "
          @click="selectDate(dateItem.value)"
        >
          {{ dateItem.day }}
        </button>
      </template>
    </div>

    <p class="text-right text-xs font-medium text-text-secondary sm:text-sm">
      선택한 날짜: {{ formattedSelectedDate }}
    </p>
  </div>
</template>
