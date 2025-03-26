<template>
  <v-container>
    <student-card class="mt-4" :email="useRoute().params.email"></student-card>
    <schedule :email="useRoute().params.email"></schedule>
  </v-container>
</template>
<script setup>
import { usePageStore } from '~/store/page';
usePageStore().page_name = `Студенты / ${useRoute().params.email}`;
</script>
