<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useTransactionStore } from '@/stores/transaction';

import BaseModal from '@/components/ui/BaseModal.vue';
import SectionCard from '../common/SectionCard.vue';
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
const submitAttempted = ref(false);
const touchedFields = ref({
  type: false,
  amount: false,
  date: false,
  category: false,
});

let toastTimerId = null;

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
  form.value.amount = digitsOnly.slice(0, 9);
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

const handlePhotoChange = (event) => {
  const [file] = event.target.files ?? [];

  if (!file) {
    clearPhoto();
    photoError.value = '';
    return;
  }

  const isValidType = ACCEPTED_FILE_TYPES.includes(file.type);
  const isValidSize = file.size <= MAX_FILE_SIZE;

  if (!isValidType) {
    photoError.value = 'JPG 또는 PNG 파일만 첨부할 수 있습니다.';
    clearPhoto();
    return;
  }

  if (!isValidSize) {
    photoError.value = '사진 용량은 5MB 이하만 가능합니다.';
    clearPhoto();
    return;
  }

  form.value.photo = file;
  photoError.value = '';
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
  { immediate: true },
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
        payload,
      );

      emit('saved', updatedTransaction);
      return;
    }

    const savedTransaction = await transactionStore.addTransaction(payload);
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
    :max-width-class="'max-w-lg'"
    :body-class="'p-0'"
    :show-close-button="false"
    @close="emit('close')"
  >
    <SectionCard
      title="거래 정보 입력"
      description="필수 항목을 모두 입력해야 추가 버튼이 활성화됩니다."
    >
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label
              for="transaction-date"
              class="text-sm font-semibold text-text-primary"
            >
              날짜
            </label>
            <span class="text-xs text-accent-ui">필수</span>
          </div>
          <input
            id="transaction-date"
            v-model="form.date"
            type="date"
            class="h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-sm text-text-primary focus:border-accent-ui focus:outline-none"
            @blur="setFieldTouched('date')"
          />
          <p v-if="shouldShowError('date')" class="text-xs text-accent-ui">
            {{ fieldErrors.date }}
          </p>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-text-primary">구분</label>
            <span class="text-xs text-accent-ui">필수</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-[14px] border px-4 py-3 text-sm font-semibold transition-colors"
              :class="
                form.type === 'income'
                  ? 'border-button-dark bg-button-dark text-button-dark-foreground'
                  : 'border-line bg-surface text-text-primary hover:bg-surface-muted'
              "
              @click="selectType('income')"
            >
              수입
            </button>
            <button
              type="button"
              class="rounded-[14px] border px-4 py-3 text-sm font-semibold transition-colors"
              :class="
                form.type === 'expense'
                  ? 'border-button-dark bg-button-dark text-button-dark-foreground'
                  : 'border-line bg-surface text-text-primary hover:bg-surface-muted'
              "
              @click="selectType('expense')"
            >
              지출
            </button>
          </div>
          <p v-if="shouldShowError('type')" class="text-xs text-accent-ui">
            {{ fieldErrors.type }}
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label
              for="transaction-amount"
              class="text-sm font-semibold text-text-primary"
            >
              금액
            </label>
            <span class="text-xs text-accent-ui">필수</span>
          </div>
          <input
            id="transaction-amount"
            :value="form.amount"
            type="text"
            inputmode="numeric"
            placeholder="금액을 입력하세요"
            class="h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-ui focus:outline-none"
            @input="handleAmountInput"
          />
          <p
            class="text-xs"
            :class="
              shouldShowError('amount')
                ? 'text-accent-ui'
                : 'text-text-secondary'
            "
          >
            {{ formattedAmountHint }}
          </p>
        </div>

        <div v-if="form.type === 'income'" class="space-y-3">
          <div class="flex items-center justify-between">
            <label
              for="transaction-tags"
              class="text-sm font-semibold text-text-primary"
            >
              태그
            </label>
            <span class="text-xs text-text-secondary">선택</span>
          </div>
          <input
            id="transaction-tags"
            :value="tagInput"
            type="text"
            placeholder="#월급 #용돈"
            class="h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-ui focus:outline-none"
            @input="handleTagInput"
          />
        </div>

        <div v-else class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-text-primary">
              카테고리
            </label>
            <span class="text-xs text-accent-ui">필수</span>
          </div>
          <button
            type="button"
            class="h-12 w-full rounded-[14px] border border-line bg-surface px-4 text-sm text-text-primary focus:border-accent-ui focus:outline-none"
            :class="form.category ? 'text-text-primary' : 'text-text-muted'"
            @click="openCategoryModal"
            @blur="setFieldTouched('category')"
          >
            <span class="flex items-center justify-between">
              <span>{{ form.category || '카테고리 선택' }}</span>
              <span class="text-lg text-text-secondary">›</span>
            </span>
          </button>
          <p v-if="shouldShowError('category')" class="text-xs text-accent-ui">
            {{ fieldErrors.category }}
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label
              for="transaction-memo"
              class="text-sm font-semibold text-text-primary"
            >
              메모
            </label>
            <span class="text-xs text-text-secondary"
              >{{ memoLength }}/100</span
            >
          </div>
          <textarea
            id="transaction-memo"
            :value="form.memo"
            rows="5"
            placeholder="메모를 입력하세요"
            class="w-full rounded-[14px] border border-line bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-ui focus:outline-none"
            @input="handleMemoInput"
          />
          <p v-if="submitError" class="text-sm text-accent-ui">
            {{ submitError }}
          </p>
          <Button
            type="button"
            variant="danger"
            full-width="true"
            size="lg"
            :disabled="!isRequiredValid || transactionStore.loading"
            @click="submitTransaction"
          >
            {{
              transactionStore.loading
                ? '저장 중...'
                : isEditMode
                  ? '수정'
                  : '추가'
            }}
          </Button>
        </div>
      </div>
    </SectionCard>
  </BaseModal>
  <CategorySelectModal
    :open="isCategoryModalOpen"
    :categories="CATEGORY_OPTIONS"
    :selected-category="form.category"
    @close="closeCategoryModal"
    @select="selectCategory"
  />
</template>
