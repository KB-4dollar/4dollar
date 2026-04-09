<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useTransactionStore } from '@/stores/transaction';

import BaseModal from '@/components/ui/BaseModal.vue';
import ToastMessage from '@/components/ui/ToastMessage.vue';
import SectionStack from '@/components/common/SectionStack.vue';
import Button from '../ui/Button.vue';
import { parseHashTags, sanitizeTagInput } from '@/utils/tagParser';
import { validateTransactionForm } from '@/utils/validation';
import CategorySelectModal from './CategoryModal.vue';

const CATEGORY_OPTIONS = [
  '식비',
  '교통',
  '문화생활',
  '병원',
  '생활용품',
  '경조사비',
  '편의점/마트',
  '기타',
];

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  initialTransaction: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const MAX_AMOUNT = 999999999;
const MAX_MEMO_LENGTH = 100;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

const today = new Date().toISOString().slice(0, 10);
const transactionStore = useTransactionStore();
const isEditMode = computed(() => Boolean(props.initialTransaction?.id));

const form = ref({
  type: 'expense',
  amount: '',
  date: today,
  category: '',
  tags: [],
  memo: '',
  photo: null,
});

const applyTransactionToForm = (transaction) => {
  if (!transaction) {
    return;
  }

  form.value = {
    type: transaction.type === '수입' ? 'income' : 'expense',
    amount: String(transaction.amount ?? ''),
    date: transaction.date ?? today,
    category: transaction.category ?? '',
    tags: Array.isArray(transaction.tags) ? [...transaction.tags] : [],
    memo: transaction.memo ?? '',
    photo: transaction.photo ?? null,
  };
  tagInput.value = Array.isArray(transaction.tags)
    ? transaction.tags.map((tag) => `#${tag}`).join(' ')
    : '';
};

const isCategoryModalOpen = ref(false);
const tagInput = ref('');
const submitError = ref('');
const toastMessage = ref('');
const isToastOpen = ref(false);
const submitAttempted = ref(false);
const touchedFields = ref({
  type: false,
  amount: false,
  date: false,
  category: false,
});

let toastTimerId = null;

const showToast = (message) => {
  toastMessage.value = message;
  isToastOpen.value = true;
  if (toastTimerId) window.clearTimeout(toastTimerId);
  toastTimerId = window.setTimeout(() => {
    isToastOpen.value = false;
    toastMessage.value = '';
  }, 2500);
};

const validationResult = computed(() => validateTransactionForm(form.value));
const fieldErrors = computed(() => validationResult.value.errors);
const isRequiredValid = computed(() => validationResult.value.isValid);
const amountNumber = computed(() => Number(form.value.amount));

const memoLength = computed(() => form.value.memo.length);

const setFieldTouched = (field) => {
  touchedFields.value[field] = true;
};

const shouldShowError = (field) =>
  Boolean(fieldErrors.value[field]) &&
  (submitAttempted.value || touchedFields.value[field]);

const selectType = (type) => {
  form.value.type = type;
  setFieldTouched('type');

  if (type === 'income') {
    form.value.category = '';
    closeCategoryModal();
    return;
  }

  form.value.tags = [];
  tagInput.value = '';
};

const openCategoryModal = () => {
  isCategoryModalOpen.value = true;
};

const closeCategoryModal = () => {
  isCategoryModalOpen.value = false;
};

const selectCategory = (category) => {
  form.value.category = category;
  setFieldTouched('category');
  closeCategoryModal();
};

const handleAmountInput = (event) => {
  const digitsOnly = event.target.value.replace(/\D/g, '');
  const sliced = digitsOnly.slice(0, 9);
  const num = Number(sliced);
  form.value.amount = num > MAX_AMOUNT ? String(MAX_AMOUNT) : sliced;
  event.target.value = form.value.amount;
  setFieldTouched('amount');
};

const handleMemoInput = (event) => {
  form.value.memo = event.target.value.slice(0, MAX_MEMO_LENGTH);
};

const handleTagInput = (event) => {
  const sanitizedValue = sanitizeTagInput(event.target.value);
  tagInput.value = sanitizedValue;
  form.value.tags = parseHashTags(sanitizedValue);
};

const clearPhoto = () => {
  form.value.photo = null;

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const formattedAmountHint = computed(() => {
  if (shouldShowError('amount')) {
    return fieldErrors.value.amount;
  }

  if (
    form.value.amount === '' ||
    !Number.isInteger(amountNumber.value) ||
    amountNumber.value < 1 ||
    amountNumber.value > MAX_AMOUNT
  ) {
    return '최소 1원 ~ 최대 10억원 미만';
  }

  return `${amountNumber.value.toLocaleString('ko-KR')}원`;
});

const resetForm = () => {
  form.value = {
    type: 'expense',
    amount: '',
    date: today,
    category: '',
    tags: [],
    memo: '',
    photo: null,
  };
  tagInput.value = '';
  isCategoryModalOpen.value = false;
  submitAttempted.value = false;
  touchedFields.value = {
    type: false,
    amount: false,
    date: false,
    category: false,
  };
};

onBeforeUnmount(() => {
  if (toastTimerId) {
    window.clearTimeout(toastTimerId);
  }
});

watch(
  () => props.initialTransaction,
  (transaction) => {
    if (transaction) {
      applyTransactionToForm(transaction);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const submitTransaction = async () => {
  submitError.value = '';
  submitAttempted.value = true;

  if (!isRequiredValid.value) {
    return;
  }

  try {
    const payload = {
      ...form.value,
      tags: [...form.value.tags],
    };

    if (isEditMode.value) {
      const updatedTransaction = await transactionStore.updateTransaction(
        props.initialTransaction.id,
        payload
      );

      showToast('내역이 수정되었습니다.');
      emit('saved', updatedTransaction);
      return;
    }

    const savedTransaction = await transactionStore.addTransaction(payload);
    showToast('내역이 추가되었습니다.');
    resetForm();
    emit('saved', savedTransaction);
  } catch (error) {
    submitError.value = error.message || '거래 저장에 실패했습니다.';
  }
};
</script>
<template>
  <BaseModal
    :open="props.open"
    title="거래 정보 입력"
    description="필수 항목을 모두 입력해야 추가 버튼이 활성화됩니다."
    :max-width-class="'md:max-w-lg'"
    :body-class="'px-5 pt-4 pb-6 md:px-6 md:pt-6 md:pb-6'"
    :show-close-button="true"
    @close="emit('close')"
  >
    <!-- ❌ SectionCard 제거 -->
    <!-- ✅ SectionStack 적용 -->
    <SectionStack gap="lg">
      <!-- 날짜 -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-semibold">날짜</label>
          <span class="text-xs text-accent-ui">필수</span>
        </div>

        <input
          v-model="form.date"
          type="date"
          class="h-12 w-full rounded-[14px] border border-line px-4 text-sm"
          @blur="setFieldTouched('date')"
        />

        <p v-if="shouldShowError('date')" class="text-xs text-accent-ui">
          {{ fieldErrors.date }}
        </p>
      </div>

      <!-- 구분 -->
      <div class="space-y-3">
        <div class="flex justify-between">
          <label class="text-sm font-semibold">구분</label>
          <span class="text-xs text-accent-ui">필수</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="rounded-[14px] border px-4 py-3 text-sm font-semibold"
            :class="
              form.type === 'income'
                ? 'bg-button-dark text-white'
                : 'border-line'
            "
            @click="selectType('income')"
          >
            수입
          </button>

          <button
            type="button"
            class="rounded-[14px] border px-4 py-3 text-sm font-semibold"
            :class="
              form.type === 'expense'
                ? 'bg-button-dark text-white'
                : 'border-line'
            "
            @click="selectType('expense')"
          >
            지출
          </button>
        </div>
      </div>

      <!-- 금액 -->
      <div class="space-y-3">
        <div class="flex justify-between">
          <label class="text-sm font-semibold">금액</label>
          <span class="text-xs text-accent-ui">필수</span>
        </div>

        <input
          :value="form.amount"
          type="text"
          class="h-12 w-full rounded-[14px] border px-4"
          @input="handleAmountInput"
        />

        <p class="text-xs">
          {{ formattedAmountHint }}
        </p>
      </div>
      <!-- 태그 입력 (수입일 때만) -->
      <div v-if="form.type === 'income'" class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-semibold">태그</label>
          <span class="text-xs text-text-secondary">선택</span>
        </div>

        <input
          :value="tagInput"
          type="text"
          placeholder="#월급 #용돈"
          class="h-12 w-full rounded-[14px] border border-line px-4 text-sm"
          @input="handleTagInput"
        />
      </div>

      <!-- 카테고리 -->
      <div v-if="form.type !== 'income'" class="space-y-3">
        <div class="flex justify-between">
          <label class="text-sm font-semibold">카테고리</label>
          <span class="text-xs text-accent-ui">필수</span>
        </div>

        <button
          class="h-12 w-full border rounded-[14px] px-4"
          @click="openCategoryModal"
        >
          {{ form.category || '카테고리 선택' }}
        </button>
      </div>

      <!-- 메모 -->
      <div class="space-y-3">
        <div class="flex justify-between">
          <label class="text-sm font-semibold">메모</label>
          <span class="text-xs">{{ memoLength }}/100</span>
        </div>

        <textarea
          :value="form.memo"
          rows="5"
          class="w-full border rounded-[14px] px-4 py-3"
          @input="handleMemoInput"
        />

        <Button
          variant="danger"
          size="lg"
          :disabled="!isRequiredValid"
          @click="submitTransaction"
        >
          {{ isEditMode ? '수정' : '추가' }}
        </Button>
      </div>
    </SectionStack>
  </BaseModal>

  <CategorySelectModal
    :open="isCategoryModalOpen"
    :categories="CATEGORY_OPTIONS"
    :selected-category="form.category"
    @close="closeCategoryModal"
    @select="selectCategory"
  />

  <ToastMessage :open="isToastOpen" :message="toastMessage" />
</template>
