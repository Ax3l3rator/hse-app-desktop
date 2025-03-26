<template>
  <v-container>
    <teacher-card class="mt-4" :email="useRoute().params.email"></teacher-card>
    <schedule :email="useRoute().params.email"></schedule>
  </v-container>
</template>
<script setup>
import { usePageStore } from '~/store/page';
usePageStore().page_name = `Сотрудники / ${useRoute().params.email}`;
</script>
