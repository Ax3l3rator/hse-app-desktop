import type { BuildingGrouped } from '~/types/buildings';
import type { SearchType } from '~/types/search';

export interface IElectronAPI {
  authorizeViaBrowser: () => Promise<void>;
  checkIfAuthorized: () => Promise<boolean>;
  leave: () => Promise<void>;
  getFullUserInfo: () => Promise<any>;
  getSchedule: (email: string) => Promise<any>;
  onAuthorize: (callback: (...args: any[]) => void) => Promise<void>;
  onLeave: (callback: (...args: any[]) => void) => Promise<void>;
  getSearchResults: (query: string, type: SearchType) => Promise<any>;
  onSearchResults: (callback: (...args: any[]) => void) => Promise<void>;
  getNameByEmail: (email: string) => Promise<string>;
  getFullPersonInfo: (email: string) => Promise<any>;
  getBuildings: () => Promise<BuildingGrouped[]>;
  getFreeAuditoriums: (building_id: number, date_from: string, date_to: string) => Promise<any>;
  onFreeAuditoriumsResults: (callback: (...args: any[]) => void) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
declare module '#app' {
  interface PageMeta {
    showPagination?: boolean;
  }
}

export {};
