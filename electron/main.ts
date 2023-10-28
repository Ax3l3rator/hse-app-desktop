import { app, BrowserWindow } from 'electron';

app.whenReady().then(() => {
  new BrowserWindow().loadURL(
    JSON.parse(process.env.__NUXT_DEV__ as string).proxy.url,
  );
});
