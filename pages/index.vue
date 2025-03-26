<template>
  <v-container>
    <schedule v-if="userStore.email" :email="userStore.email"> </schedule>
  </v-container>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user';
import { usePageStore } from '~/store/page';

usePageStore().page_name = 'Расписание';

const userStore = useUserStore();
</script>

<style scoped></style>
