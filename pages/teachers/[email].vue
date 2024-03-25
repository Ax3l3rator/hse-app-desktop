<template>
  <teacher-card :email="useRoute().params.email"></teacher-card>
  <schedule :email="useRoute().params.email"></schedule>
</template>
<script setup>
const route = useRoute().params;
</script>
