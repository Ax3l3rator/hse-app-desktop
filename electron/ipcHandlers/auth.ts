import { ipcMain } from 'electron';
import { HSEAuthService } from '../utils/HSEAuthService';

export function handleAuth() {
  ipcMain.handle('get-full-user-info', async () => await HSEAuthService.getFullUserInfo());
  ipcMain.handle('leave', HSEAuthService.leave);
  ipcMain.handle('auth-hse-browser', () => HSEAuthService.openAuthBrowserExternal());
  ipcMain.handle('check-authorization', async () => {
    try {
      const res = await HSEAuthService.authorize();
      return res;
    } catch (err) {
      return false;
    }
  });
}
