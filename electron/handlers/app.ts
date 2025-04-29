import { ipcMain, shell } from 'electron';

ipcMain.handle('open-in-browser', (_, url) => {
  shell.openExternal(url);
});
