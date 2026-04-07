<script setup>
import TransactionForm from '@/components/transaction/TransactionForm.vue';
import TransactionDetail from '@/components/transaction/TransactionDetail.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
  <TransactionForm v-if="route.params.id === 'new' || !route.params.id" />
  <TransactionDetail v-else />
</template>
