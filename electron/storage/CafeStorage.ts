import { ipcMain } from 'electron';
import { LocalTimedStorage } from './LocalTimedStorage';
import type { BuildingCafe } from '~/types/cafes';

const storage = new LocalTimedStorage<BuildingCafe & { last_save: Date }>('cafes');

ipcMain.handle(`${storage.name}-get`, (_, parameter_name) => storage.get(parameter_name));
ipcMain.handle(`${storage.name}-set`, (_, parameter_name, parameter_value) =>
  storage.set(parameter_name, parameter_value),
);
