<script setup>
import axios from 'axios';
const requestAPI = () => {
  // const url = "http://localhost:3000/users 와 같음";
  const url = '/api/users';
  axios.get(url).then((response) => {
    console.log('# 응답객체 : ', response);
  });
};
requestAPI();
</script>

<template><h1 class="text-3xl font-bold underline">Hello world!</h1></template>

<style scoped></style>
