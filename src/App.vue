<script setup>
import axios from 'axios';
import Header from './components/Common/Header.vue';
const requestAPI = () => {
  // const url = "http://localhost:3000/users 와 같음";
  const url = '/api/users';
  axios.get(url).then((response) => {
    console.log('# 응답객체 : ', response);
  });
};
requestAPI();
</script>

<template><RouterView /></template>

<style scoped></style>
