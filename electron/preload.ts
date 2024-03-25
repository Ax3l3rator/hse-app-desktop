import { contextBridge, ipcRenderer } from 'electron';
import type { SearchType } from '~/types/search';

contextBridge.exposeInMainWorld('electronAPI', {
  authorizeViaBrowser: async () => ipcRenderer.invoke('auth-hse-browser'),
  checkIfAuthorized: async () => await ipcRenderer.invoke('check-authorization'),
  leave: async () => await ipcRenderer.invoke('reset-tokens'),
  getFullUserInfo: async () => await ipcRenderer.invoke('get-full-user-info'),
  onAuthorize: async (callback: (...args: any[]) => void) =>
    ipcRenderer.on('authorize', (_event, value) => callback(value)),
  onLeave: async (callback: (...args: any[]) => void) => ipcRenderer.on('leave', (_event, value) => callback(value)),
  getSchedule: async (email: string) => await ipcRenderer.invoke('get-student-schedule', email),
  getSearchResults: async (query: string, type: SearchType) =>
    await ipcRenderer.invoke('get-search-results', query, type),
  onSearchResults: async (callback: (...args: any[]) => void) =>
    ipcRenderer.on('search-results-arrived', (_event, value) => {
      callback(value);
    }),
  getNameByEmail: async (email: string) => ipcRenderer.invoke('get-name-by-email', email),
  getFullPersonInfo: async (email: string) => ipcRenderer.invoke('get-full-person-info', email),
  getBuildings: async () => await ipcRenderer.invoke('get-buildings'),
  getFreeAuditoriums: async (building_id: number, date_from: string, date_to: string) =>
    await ipcRenderer.invoke('get-free-auditoriums', building_id, date_from, date_to),
  onFreeAuditoriumsResults: async (callback: (...args: any[]) => void) =>
    ipcRenderer.on('free-auditoriums-arrived', (_event, value) => {
      callback(value);
    }),
});
