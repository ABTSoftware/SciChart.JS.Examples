interface IElectronAPI {
  getLicenseToken: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {};
