import { contextBridge, ipcRenderer } from "electron";

// Expose a minimal, named API to the renderer. Never expose the full ipcRenderer
// object — that would let renderer code send arbitrary IPC messages to main.
contextBridge.exposeInMainWorld("electronAPI", {
  getLicenseToken: (): Promise<string> =>
    ipcRenderer.invoke("get-license-token"),
});
