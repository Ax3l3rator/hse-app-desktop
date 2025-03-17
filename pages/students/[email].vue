<template>
  <student-card class="mt-4" :email="useRoute().params.email"></student-card>
  <schedule :email="useRoute().params.email"></schedule>
</template>
<script setup>
definePageMeta({
  title: 'Студенты',
});

const route = useRoute().params;
</script>
