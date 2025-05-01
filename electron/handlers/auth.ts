import { ipcMain } from 'electron';
import { HseAuth } from '../logic/HseAuth';

ipcMain.handle('leave', HseAuth.leave);
ipcMain.handle('auth-hse-browser', () => HseAuth.openAuthBrowserExternal());
ipcMain.handle('check-authorization', async () => {
  try {
    const res = await HseAuth.authorize();
    return res;
  } catch (err) {
    return false;
  }
});
