<template>
  <div>
    <v-sheet elevation="6" :height="1200" color="primary" class="rounded-lg pa-3">
      This is a test vuetify sheet!
      <v-btn @click="docss"> test button</v-btn>
    </v-sheet>
    <!-- <div id="bottom-pinned">
      <v-pagination id="pagination-pinned" class="rounded-t-lg" density="comfortable"></v-pagination>
    </div> -->
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify/lib/framework.mjs';
definePageMeta({
  showPagination: true,
});
const vuetify = useTheme();

function docss() {
  let themeColors = {};
  const curColors = vuetify.current.value.colors;
  for (let key in curColors) {
    themeColors[`--v-theme-${key}`] = curColors[key];
  }
  console.log(themeColors);
}
</script>

<style scoped></style>
