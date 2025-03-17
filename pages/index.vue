<template>
  <schedule v-if="userStore.email" :email="userStore.email"> </schedule>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/pinia';
definePageMeta({
  title: 'Расписание',
});

const userStore = useUserStore();
</script>

<style scoped></style>
