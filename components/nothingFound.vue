<template>
  <v-card variant="outlined" class="my-6">
    <v-card-title>Упс! Информации о {{ props.name }} не нашлось :(</v-card-title>
  </v-card>
</template>
<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>
