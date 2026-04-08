<script setup>
import { computed, ref } from 'vue';

import Button from '../ui/Button.vue';
import PageSectionLayout from '../common/PageSectionLayout.vue';
import SectionCard from '../common/SectionCard.vue';
import CategorySelectModal from './CategoryModal.vue';
import DateCalendar from './DateCalendar.vue';

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

const MAX_AMOUNT = 999999999;
const MAX_MEMO_LENGTH = 100;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'];

const today = new Date().toISOString().slice(0, 10);

const form = ref({
  type: 'expense',
  amount: '',
  date: today,
  category: '',
  memo: '',
  photo: null,
});

const photoError = ref('');
const fileInputRef = ref(null);
const isCategoryModalOpen = ref(false);

const amountNumber = computed(() => Number(form.value.amount));
const isAmountValid = computed(
  () =>
    form.value.amount !== '' &&
    Number.isInteger(amountNumber.value) &&
    amountNumber.value >= 1 &&
    amountNumber.value <= MAX_AMOUNT,
);

const isRequiredValid = computed(
  () =>
    Boolean(form.value.type) &&
    isAmountValid.value &&
    Boolean(form.value.date) &&
    Boolean(form.value.category),
);

const memoLength = computed(() => form.value.memo.length);
const photoName = computed(() => form.value.photo?.name ?? '첨부된 파일 없음');

const selectType = (type) => {
  form.value.type = type;
};

const openCategoryModal = () => {
  isCategoryModalOpen.value = true;
};

const closeCategoryModal = () => {
  isCategoryModalOpen.value = false;
};

const selectCategory = (category) => {
  form.value.category = category;
  closeCategoryModal();
};

const handleAmountInput = (event) => {
  const digitsOnly = event.target.value.replace(/\D/g, '');
  form.value.amount = digitsOnly.slice(0, 9);
};

const handleMemoInput = (event) => {
  form.value.memo = event.target.value.slice(0, MAX_MEMO_LENGTH);
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
  if (!isAmountValid.value) {
    return '최소 1원 ~ 최대 10억원 미만';
  }

  return `${amountNumber.value.toLocaleString('ko-KR')}원`;
});
</script>

<template>
  <PageSectionLayout title="입출금 입력">
    <div class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard title="날짜 선택">
        <DateCalendar v-model="form.date" />
      </SectionCard>
      <SectionCard
        title="거래 정보 입력"
        description="필수 항목을 모두 입력해야 추가 버튼이 활성화됩니다."
      >
        <div class="space-y-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-text-primary"
                >구분</label
              >
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
              :class="isAmountValid ? 'text-text-secondary' : 'text-accent-ui'"
            >
              {{ formattedAmountHint }}
            </p>
          </div>

          <div class="space-y-3">
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
            >
              <span class="flex items-center justify-between">
                <span>{{ form.category || '카테고리 선택' }}</span>
                <span class="text-lg text-text-secondary">›</span>
              </span>
            </button>
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
            <Button
              type="button"
              variant="danger"
              full-width="true"
              size="lg"
              :disabled="!isRequiredValid"
            >
              추가
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
    <!--  사진 첨부 기능 보류
    <SectionCard
      title="영수증 첨부"
      description="이미지는 1장만 첨부할 수 있습니다."
    >
      <div class="space-y-5">
        <label
          for="transaction-photo"
          class="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-line bg-surface-muted px-6 py-8 text-center"
        >
          <span class="text-sm font-semibold text-text-primary">사진 선택</span>
          <span class="mt-2 text-sm text-text-secondary">
            JPG, PNG / 5MB 이하 / 영수증 이미지 1장
          </span>
        </label>
        <input
          id="transaction-photo"
          ref="fileInputRef"
          type="file"
          accept=".jpg,.jpeg,.png"
          class="sr-only"
          @change="handlePhotoChange"
        />

        <div
          class="rounded-[14px] bg-surface-muted px-4 py-3 text-sm text-text-secondary"
        >
          {{ photoName }}
        </div>

        <p v-if="photoError" class="text-sm text-accent-ui">
          {{ photoError }}
        </p>

        <div class="space-y-2 text-xs leading-5 text-text-secondary">
          <p>• 필수 입력: 구분, 금액, 날짜, 카테고리</p>
          <p>• 금액은 최소 1원 이상, 최대 10억원 미만입니다.</p>
          <p>• 사진은 JPG, PNG만 가능하며 5MB를 초과할 수 없습니다.</p>
        </div>

        <Button
          type="button"
          variant="danger"
          full-width="true"
          size="lg"
          :disabled="isRequiredValid"
        >
          추가
        </Button>
      </div>
    </SectionCard> -->
  </PageSectionLayout>

  <CategorySelectModal
    :open="isCategoryModalOpen"
    :categories="CATEGORY_OPTIONS"
    :selected-category="form.category"
    @close="closeCategoryModal"
    @select="selectCategory"
  />
</template>
