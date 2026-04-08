<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import TransactionForm from '@/components/transaction/TransactionForm.vue';
import TransactionDetail from '@/components/transaction/TransactionDetail.vue';
import { useRoute } from 'vue-router';
import { transactionService } from '@/api/services/transactionService';
import { useTransactionStore } from '@/stores/transaction';

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();
const transaction = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
const isEditMode = ref(false);

const loadTransaction = async (id) => {
  if (!id || id === 'new') {
    transaction.value = null;
    errorMessage.value = '';
    isEditMode.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    transaction.value = await transactionService.getTransactionById(id);
    isEditMode.value = false;
  } catch (error) {
    transaction.value = null;
    errorMessage.value =
      error.message || '거래 내역을 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTransaction(route.params.id);
});

watch(
  () => route.params.id,
  (id) => {
    loadTransaction(id);
  },
);

const openEditMode = () => {
  isEditMode.value = true;
};

const handleUpdated = (updatedTransaction) => {
  transaction.value = updatedTransaction;
  isEditMode.value = false;
};

const handleDelete = async () => {
  if (!transaction.value?.id) {
    return;
  }

  const confirmed = window.confirm('이 거래 내역을 삭제하시겠습니까?');

  if (!confirmed) {
    return;
  }

  try {
    await transactionStore.deleteTransaction(transaction.value.id);
    await router.push({ name: 'transactionList' });
  } catch (error) {
    errorMessage.value = error.message || '거래 내역을 삭제하지 못했습니다.';
  }
};
</script>
<template>
  <TransactionForm
    v-if="route.params.id === 'new' || !route.params.id"
  />
  <TransactionForm
    v-else-if="isEditMode && transaction"
    :initial-transaction="transaction"
    @saved="handleUpdated"
  />
  <div
    v-else-if="isLoading"
    class="min-h-[40vh] flex items-center justify-center text-text-secondary"
  >
    거래 내역을 불러오는 중입니다.
  </div>
  <div
    v-else-if="errorMessage"
    class="min-h-[40vh] flex items-center justify-center text-accent-ui"
  >
    {{ errorMessage }}
  </div>
  <TransactionDetail
    v-else-if="transaction"
    :transaction="transaction"
    @edit="openEditMode"
    @delete="handleDelete"
  />
</template>
