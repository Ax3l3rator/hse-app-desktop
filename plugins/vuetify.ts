import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
//@ts-expect-error
import colors from 'vuetify/lib/util/colors';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: colors.blue.base,
            'primary-lighten-1': colors.blue.lighten1,
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});
