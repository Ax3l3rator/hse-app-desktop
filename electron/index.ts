// import './security';
import { app } from 'electron';
import { restoreOrCreateWindow, sendAuthEvent } from './mainWindow';
import './ipcHandlers';
import './security';
import { platform } from 'node:process';
import { resolve } from 'path';
import { HSEAuthService } from './utils/HSEAuthService';

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
    // handlers
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
