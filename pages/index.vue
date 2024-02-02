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
function docss() {
  var themeColors = {};
  Object.keys(this.$vuetify.theme.themes.dark).forEach((color) => {
    themeColors[`--v-${color}`] = this.$vuetify.theme.themes.dark[color];
  });
  console.log(this.$vuetify.theme.themes);
  console.log(themeColors);
  return themeColors;
}

// const elevate = computed(() => useWindowScroll().y.value > 64);
</script>

<style scoped></style>
