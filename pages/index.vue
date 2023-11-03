<template>
  <v-sheet :elevation="6" :height="200" :width="200" color="primary">
    This is a test vuetify sheet!
    <v-btn @click="docss"> test button</v-btn>
  </v-sheet>
</template>

<script>
export default {
  methods: {
    docss() {
      console.log('here');
      var themeColors = {};
      Object.keys(this.$vuetify.theme.themes.dark).forEach((color) => {
        themeColors[`--v-${color}`] = this.$vuetify.theme.themes.dark[color];
      });
      console.log(this.$vuetify.theme.themes);
      console.log(themeColors);
      return themeColors;
    },
  },
};
</script>
