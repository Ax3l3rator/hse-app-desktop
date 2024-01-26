<template>
  <!-- <v-breadcrumbs :items="['Главная', 'расписание']"></v-breadcrumbs> -->
  <v-sheet elevation="6" :height="1200" color="primary" class="rounded-lg pa-3">
    This is a test vuetify sheet!
    <v-btn @click="docss"> test button</v-btn>
    <v-sheet style="margin-top: 300px"> {{ elevate }} </v-sheet>
  </v-sheet>
</template>

<script setup>
function docss() {
  console.log('here');
  var themeColors = {};
  Object.keys(this.$vuetify.theme.themes.dark).forEach((color) => {
    themeColors[`--v-${color}`] = this.$vuetify.theme.themes.dark[color];
  });
  console.log(this.$vuetify.theme.themes);
  console.log(themeColors);
  return themeColors;
}

const { x, y } = useWindowScroll();

const elevate = computed(() => useWindowScroll().y.value > 64);
</script>

<style scoped></style>
