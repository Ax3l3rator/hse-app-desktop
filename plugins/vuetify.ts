import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
//@ts-expect-error
import colors from 'vuetify/lib/util/colors';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
    }, // {
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
