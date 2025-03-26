<template>
  <v-app>
    <slot style="height: 100dvh !important" />
  </v-app>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'unauthorized',
});
</script>
