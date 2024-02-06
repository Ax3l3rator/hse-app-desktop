export interface IElectronAPI {
  authorizeViaBrowser: () => Promise<void>;
  checkIfAuthorized: () => Promise<boolean>;
  leave: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  onAuthorize: (callback: (...args: any[]) => void) => Promise<void>;
  onLeave: (callback: (...args: any[]) => void) => Promise<void>;
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
