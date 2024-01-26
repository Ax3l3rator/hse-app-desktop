import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  authorizeViaBrowser: async () => ipcRenderer.invoke('auth-hse-browser'),
  checkIfAuthorized: async () => await ipcRenderer.invoke('check-authorization'),
  leave: async () => ipcRenderer.invoke('reset-tokens'),
  getUserInfo: async () => await ipcRenderer.invoke('get-user-info'),
  onAuthorize: async (callback: (...args: any[]) => void) =>
    ipcRenderer.on('authorize', (_event, value) => callback(value)),
  onLeave: async (callback: (...args: any[]) => void) => ipcRenderer.on('leave', (_event, value) => callback(value)),
});
