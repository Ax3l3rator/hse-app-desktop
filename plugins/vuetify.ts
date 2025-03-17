import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

import colors from 'vuetify/lib/util/colors.mjs';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: colors.indigo.darken1,
            'primary-lighten-1': colors.indigo.base,
            'primary-lighten-2': colors.indigo.lighten1,
            'primary-lighten-3': colors.indigo.lighten2,
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: colors.indigo.base,
            'primary-lighten-1': colors.indigo.lighten1,
            'primary-lighten-2': colors.indigo.lighten2,
            'primary-lighten-3': colors.indigo.lighten3,
          },
        },
      },
    },
    // {
    // defaultTheme: 'dark',
    // themes: {
    //   dark: {
    //     dark: true,
    //   },
    //   light: {
    //     dark: false,
    //     // colors: {
    //     // primary: colors.blue.darken2,
    //     // 'primary-lighten-1': colors.blue.darken1,
    //     // 'primary-darken-1': colors.blue.darken3,
    //     // },
    //   },
    // },
    // },
  });
  app.vueApp.use(vuetify);
});
