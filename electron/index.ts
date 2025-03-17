// import './security';
import { app, ipcMain, shell } from 'electron';
import { restoreOrCreateWindow, sendAuthEvent } from './mainWindow';
import { platform } from 'node:process';
import { resolve } from 'path';
import { HSEAuthService } from './utils/HSEAuthService';
import { InternalEventEmitter } from './utils/InternalEventEmitter';
import { HSEAPIService } from './utils/HSEAPIService';
import type { SearchType } from '~/types/search';

const isSingleInstance = app.requestSingleInstanceLock();
app.commandLine.appendSwitch('enable-overlay-scrollbar');
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.on('second-instance', restoreOrCreateWindow);

app.disableHardwareAcceleration();

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }

  process.kill(process.pid, 'SIGINT');
});

app.on('second-instance', async (event, commandLine) => {
  const deepLink = commandLine.at(-1);
  if (deepLink) {
    try {
      await HSEAuthService.authorizeByRedirectUrl(deepLink);
      setTimeout(async () => {
        await sendAuthEvent();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  } else throw new Error('Unknown');
});

app.on('open-url', (event, url) => {
  console.log(url);
});

app.on('activate', restoreOrCreateWindow);

app
  .whenReady()
  .then(() => {
    ipcMain.handle('auth-hse-browser', () => HSEAuthService.openAuthBrowserExternal());
    InternalEventEmitter.getAuthEventHook(HSEAuthService.openAuthBrowserExternal);
    ipcMain.handle('check-authorization', async () => {
      try {
        const res = await HSEAuthService.authorize();
        return res;
      } catch (err) {
        return false;
      }
    });
    ipcMain.handle('get-full-user-info', async () => await HSEAuthService.getFullUserInfo());
    ipcMain.handle('reset-tokens', HSEAuthService.leave);
    ipcMain.handle('get-student-schedule', async (_, email) => await HSEAuthService.getSchedule(email));
    ipcMain.handle('get-search-results', (event, query: string, type: SearchType) =>
      HSEAPIService.requestSearchResults(query, type).then((res) => {
        event.sender.send('search-results-arrived', res);
      }),
    );
    ipcMain.handle('get-name-by-email', async (_, email) => await HSEAPIService.getNameByEmail(email));
    ipcMain.handle('get-full-person-info', async (_, email) => await HSEAPIService.getFullPersonInfo(email));
    ipcMain.handle('get-buildings', async () => await HSEAPIService.getBuildings());
    ipcMain.handle(
      'get-grades',
      async (_, program_id, academic_year) => await HSEAPIService.getGrades(program_id, academic_year),
    );
    ipcMain.handle('get-personal-rating', async () => await HSEAPIService.getPersonalRating());
    ipcMain.handle('get-rating-list', async () => await HSEAPIService.getRatingList());
    ipcMain.handle('get-rating', async (_, target, id) => await HSEAPIService.getRating(target, id));
    ipcMain.handle('get-service-list', async (_, category) => await HSEAPIService.getServiceList(category));
    ipcMain.handle('get-cafe', async (_, id) => await HSEAPIService.getCafe(id));
    ipcMain.handle('get-cafe-menu', async (_, id) => await HSEAPIService.getCafeMenu(id));
    ipcMain.handle('get-free-auditoriums', (event, building_id, date_from, date_to) =>
      HSEAPIService.getFreeAuditoriums(building_id, date_from, date_to).then((res) => {
        event.sender.send('free-auditoriums-arrived', res);
      }),
    );
    ipcMain.handle('open-in-browser', (_, url) => {
      shell.openExternal(url);
    });
    restoreOrCreateWindow();
  })
  .catch((e) => console.error('Failed create window:', e));

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('ruz-app-fiddle', process.execPath, [resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('ruz-app-fiddle');
}

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
// if (import.meta.env.DEV) {
//   app
//     .whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(module => {
//       const {default: installExtension, VUEJS3_DEVTOOLS} =
//         // @ts-expect-error Hotfix for https://github.com/cawa-93/vite-electron-builder/issues/915
//         typeof module.default === 'function' ? module : (module.default as typeof module);
//
//       return installExtension(VUEJS3_DEVTOOLS, {
//         loadExtensionOptions: {
//           allowFileAccess: true,
//         },
//       });
//     })
//     .catch(e => console.error('Failed install extension:', e));
// }

/**
 * Check for app updates, install it in background and notify user that new version was installed.
 * No reason run this in non-production build.
 * @see https://www.electron.build/auto-update.html#quick-setup-guide
 *
 * Note: It may throw "ENOENT: no such file app-update.yml"
 * if you compile production app without publishing it to distribution server.
 * Like `npm run compile` does. It's ok 😅
 */
// if (import.meta.env.PROD) {
//   app
//     .whenReady()
//     .then(() =>
//       require('electron-updater').autoUpdater.checkForUpdatesAndNotify(),
//     )
//     .catch((e) => console.error('Failed check and install updates:', e));
// }
