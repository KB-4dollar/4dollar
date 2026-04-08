<script setup>
import { onBeforeUnmount, watch } from 'vue';

/**
 * BaseModal props
 * @prop {boolean} open 모달 표시 여부. true일 때 렌더링되며 ESC 닫기와 body scroll lock이 활성화됩니다.
 * @prop {string} title 모달 상단 제목. 비어 있으면 제목 텍스트는 렌더링되지 않습니다.
 * @prop {string} maxWidthClass 모달 패널 최대 너비를 제어하는 Tailwind 클래스입니다.
 * @prop {string} bodyClass 모달 패널 내부 여백과 레이아웃을 제어하는 Tailwind 클래스입니다.
 * @prop {boolean} showCloseButton 우측 상단 닫기 버튼 표시 여부입니다.
 *
 * Emits
 * @emits close 바깥 클릭, ESC 입력, 닫기 버튼 클릭 시 발생합니다.
 */
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidthClass: {
    type: String,
    default: 'max-w-[430px]',
  },
  bodyClass: {
    type: String,
    default: 'px-6 pb-6 pt-7',
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const originalBodyOverflow = typeof document !== 'undefined'
  ? document.body.style.overflow
  : '';

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.open) {
    closeModal();
  }
};

const syncBodyScrollLock = (isOpen) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.style.overflow = isOpen ? 'hidden' : originalBodyOverflow;
};

watch(
  () => props.open,
  (isOpen) => {
    if (typeof window === 'undefined') {
      return;
    }

    syncBodyScrollLock(isOpen);

    if (isOpen) {
      window.addEventListener('keydown', handleKeydown);
      return;
    }

    window.removeEventListener('keydown', handleKeydown);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
  }

  syncBodyScrollLock(false);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 md:items-center"
      @click.self="closeModal"
    >
      <section
        :class="[
          'w-full rounded-t-[28px] bg-surface md:rounded-[28px]',
          maxWidthClass,
          bodyClass,
        ]"
        role="dialog"
        aria-modal="true"
        :aria-label="title || '모달'"
      >
        <header
          v-if="title || showCloseButton"
          class="mb-6 flex items-center justify-between gap-4"
        >
          <h2
            v-if="title"
            class="text-[1.75rem] font-extrabold leading-none text-text-primary"
          >
            {{ title }}
          </h2>
          <button
            v-if="showCloseButton"
            type="button"
            class="text-3xl leading-none text-text-secondary transition-colors hover:text-text-primary"
            aria-label="닫기"
            @click="closeModal"
          >
            ×
          </button>
        </header>

        <slot />
      </section>
    </div>
  </Teleport>
</template>
