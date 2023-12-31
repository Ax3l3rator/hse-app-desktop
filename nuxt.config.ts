// https://nuxt.com/docs/api/configuration/nuxt-config
import readFileSync from 'fs';
import resolve from 'path';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  css: ['vuetify/styles'],
  devtools: { enabled: true },
  modules: [
    'nuxt-electron',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config: any) => {
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  // devServer: {
  //   https: {
  //     key: './server.key',
  //     cert: './server.crt',
  //   },
  // },
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/index.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload();
        },
      },
    ],
  },
  ssr: false,
  experimental: {
    appManifest: false, // set this to false, then the application starts working
  },

  build: {
    transpile: ['vuetify'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  // nitro: {
  //   routeRules: {
  //     '/*': { cors: true },
  //     '/': { prerender: true },
  //   },
  // },
});
