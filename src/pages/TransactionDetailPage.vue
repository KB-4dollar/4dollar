<script setup>
import TransactionDetailForm from '@/components/transaction/TransactionDetailForm.vue';
import TransactionDetail from '@/components/transaction/TransactionDetail.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
  <TransactionDetailForm v-if="route.params.id === 'new' || !route.params.id" />
  <TransactionDetail v-else />
</template>
