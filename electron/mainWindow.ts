import { app, BrowserWindow, type CommandLine } from 'electron';
import { join, resolve } from 'node:path';
import { format } from 'node:url';

const preload = join(__dirname, 'preload.js');
const distPath = join(__dirname, '../.output/public');

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webviewTag: false,
      preload: join(app.getAppPath(), './dist-electron/preload.js'),
    },
    minHeight: 500,
    minWidth: 500,
    width: 1280,
    height: 720,
    icon: '../icons/icon.png',
    title: 'HSE App Desktop',
  });

  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    browserWindow.webContents.on('before-input-event', (_, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') {
        browserWindow.webContents.openDevTools({ mode: 'detach' });
      }
    });
    if (import.meta.env.DEV) {
      browserWindow.webContents.on('before-input-event', (_, input) => {
        if (input.type === 'keyDown' && input.key === 'F12') {
          browserWindow.webContents.openDevTools({ mode: 'detach' });
        }
      });
    }
  });

  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    await browserWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await browserWindow.loadURL(
      format({
        pathname: join(app.getAppPath(), '.output/public/index.html'),
        slashes: true,
        protocol: 'file:',
      }),
    );
  }

  browserWindow.removeMenu();
  browserWindow.setMenu(null);

  return browserWindow;
}

export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }
  window.focus();
}

export async function sendAuthEvent() {
  BrowserWindow.getAllWindows()
    .find((w) => !w.isDestroyed())
    ?.webContents.send('authorize');
}

export async function sendLeaveEvent() {
  BrowserWindow.getAllWindows()
    .find((w) => !w.isDestroyed())
    ?.webContents.send('leave');
}
