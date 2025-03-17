<template>
  <teacher-card class="mt-4" :email="useRoute().params.email"></teacher-card>
  <schedule :email="useRoute().params.email"></schedule>
</template>
<script setup>
definePageMeta({
  title: 'Учителя',
});

const route = useRoute().params;
</script>
