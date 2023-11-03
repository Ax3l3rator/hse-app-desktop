import type { Session } from 'electron';
import { app, shell } from 'electron';
import { URL } from 'node:url';

type Permission = Parameters<
  Exclude<Parameters<Session['setPermissionRequestHandler']>[0], null>
>[1];

const ALLOWED_ORIGINS_AND_PERMISSIONS = new Map<string, Set<Permission>>(
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL
    ? [[new URL(import.meta.env.VITE_DEV_SERVER_URL).origin, new Set()]]
    : [],
);

const ALLOWED_EXTERNAL_ORIGINS = new Set<`https://${string}`>([
  'https://hse.ru',
  'https://github.com',
]);

app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, url) => {
    const { origin } = new URL(url);
    if (ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      return;
    }
    event.preventDefault();

    if (import.meta.env.DEV) {
      console.warn(`Blocked navigating to disallowed origin: ${origin}`);
    }
  });

  contents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      const { origin } = new URL(webContents.getURL());

      const permissionGranted =
        !!ALLOWED_ORIGINS_AND_PERMISSIONS.get(origin)?.has(permission);
      callback(permissionGranted);

      if (!permissionGranted && import.meta.env.DEV) {
        console.warn(
          `${origin} requested permission for '${permission}', but was rejected.`,
        );
      }
    },
  );
  contents.setWindowOpenHandler(({ url }) => {
    const { origin } = new URL(url);

    if (ALLOWED_EXTERNAL_ORIGINS.has(origin as `https://${string}`)) {
      shell.openExternal(url).catch(console.error);
    } else if (import.meta.env.DEV) {
      console.warn(`Blocked the opening of a disallowed origin: ${origin}`);
    }

    return { action: 'deny' };
  });

  contents.on('will-attach-webview', (event, webPreferences, params) => {
    const { origin } = new URL(params.src);
    if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      if (import.meta.env.DEV) {
        console.warn(
          `A webview tried to attach ${params.src}, but was blocked.`,
        );
      }

      event.preventDefault();
      return;
    }

    // Strip away preload scripts if unused or verify their location is legitimate.
    delete webPreferences.preload;
    // @ts-expect-error
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Enable contextIsolation
    webPreferences.contextIsolation = true;
  });
});
