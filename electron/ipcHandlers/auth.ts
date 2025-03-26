import { ipcMain } from 'electron';
import { HSEAuthService } from '../utils/HSEAuthService';

ipcMain.handle('get-full-user-info', async () => await HSEAuthService.getFullUserInfo());
ipcMain.handle('leave', HSEAuthService.leave);
ipcMain.handle('get-student-schedule', async (_, email) => await HSEAuthService.getSchedule(email));
ipcMain.handle('auth-hse-browser', () => HSEAuthService.openAuthBrowserExternal());
ipcMain.handle('check-authorization', async () => {
  try {
    const res = await HSEAuthService.authorize();
    return res;
  } catch (err) {
    return false;
  }
});
