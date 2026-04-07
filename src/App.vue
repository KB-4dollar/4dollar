<script setup>
import axios from 'axios';
// const requestAPI = () => {
//   // const url = "http://localhost:3000/users 와 같음";
//   const url = '/api/users';
//   axios.get(url).then((response) => {
//     console.log('# 응답객체 : ', response);
//   });
// };
// requestAPI();

const API_URL = import.meta.env.VITE_API_URL;

const requestAPI = () => {
  axios.get(`${API_URL}/users`).then((response) => {
    console.log('# 응답객체 : ', response);
  });
};
requestAPI();
</script>

<template><RouterView /></template>

<style scoped></style>
