<script setup>
import { onBeforeUnmount, watch } from 'vue';
import { X, ArrowLeft } from 'lucide-vue-next';
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
  description: {
    type: String,
    required: false,
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

const originalBodyOverflow =
  typeof document !== 'undefined' ? document.body.style.overflow : '';

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
  { immediate: true }
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
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/35 md:p-4 md:items-center"
      @click.self="closeModal"
    >
      <section
        class="w-full h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-surface md:h-auto md:max-h-[90vh] md:w-[70%] md:max-w-xl md:rounded-[28px]"
        role="dialog"
        aria-modal="true"
        :aria-label="title || '모달'"
      >
        <header
          v-if="title || showCloseButton"
          class="px-5 md:px-6 pt-4 md:pt-5 pb-3 md:pb-4 flex items-center gap-3 border-b border-line"
        >
          <!-- 모바일 뒤로가기 -->
          <button
            type="button"
            class="md:hidden flex items-center justify-center w-8 h-8"
            @click="closeModal"
          >
            <ArrowLeft class="w-5 h-5 text-text-primary" />
          </button>

          <!-- 타이틀 -->
          <div class="flex-1 min-w-0">
            <h2 class="text-[1.5rem] md:text-[1.75rem] font-extrabold truncate">
              {{ title }}
            </h2>

            <p
              v-if="description"
              class="mt-1 text-sm text-text-secondary truncate"
            >
              {{ description }}
            </p>
          </div>

          <!-- 웹 닫기 버튼 -->
          <button
            v-if="showCloseButton"
            class="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-muted transition"
            @click="closeModal"
          >
            <X class="w-5 h-5" />
          </button>
        </header>
        <div class="flex-1 overflow-y-auto px-5 md:px-6 pt-4 md:pt-6 pb-6">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
