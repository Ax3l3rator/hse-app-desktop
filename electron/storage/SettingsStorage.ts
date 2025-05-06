import { ipcMain } from 'electron';
import { BaseLocalStorage } from './LocalStorage';

export interface SettingsStorageData {
  theme: 'dark' | 'light';
}

const storage = new BaseLocalStorage<SettingsStorageData>('settings-storage', {
  theme: 'dark',
});

ipcMain.handle(`${storage.name}-get`, (_, parameter_name) => storage.get(parameter_name));
ipcMain.handle(`${storage.name}-set`, (_, parameter_name, parameter_value) =>
  storage.set(parameter_name, parameter_value),
);
