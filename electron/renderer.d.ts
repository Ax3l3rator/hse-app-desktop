import type { BuildingGrouped } from '~/types/buildings';
import type { BuildingCafes, CafeMenu } from '~/types/cafes';
import type { Grades } from '~/types/grades';
import type { PersonalRating, Rating, RatingList } from '~/types/rating';
import type { SearchType } from '~/types/search';
import type { ServiceList } from '~/types/services';

type CafeResult<T> = T extends string ? Cafe : BuildingCafes;

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
  getGrades: (program_id?: string, academic_year?: string) => Promise<Grades>;
  getPersonalRating: () => Promise<PersonalRating>;
  getRatingList: () => Promise<RatingList>;
  getRating: (target: 'RATING_TARGET_PROGRAM' | 'RATING_TARGET_GROUP', id: string) => Promise<Rating>;
  getServiceList: (category?: string) => Promise<ServiceList>;
  onFreeAuditoriumsResults: (callback: (...args: any[]) => void) => Promise<any>;
  openInBrowser: (url: string) => void;
  getCafe: <T extends string | undefined = undefined>(id?: T) => Promise<CafeResult<T>>;
  getCafeMenu: (id: string) => Promise<CafeMenu>;
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
