# Simple Server Licensing Example (Electron)

Demonstrates SciChart's **Simple Server Validation** flow in an Electron app. Unlike the HTTP server examples, there is no separate server process — the HMAC token is generated in the Electron **main process** and delivered to the renderer via IPC.

This is the correct pattern for Electron: the Server Secret never appears in renderer code, where it would be visible in DevTools or extractable from the renderer bundle.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Main process (Node.js)                         │
│                                                 │
│  ipcMain.handle('get-license-token')            │
│    → HMAC-SHA256(serverSecret, nonce:expiry)    │
│    → returns token string                       │
└────────────────────┬────────────────────────────┘
                     │ ipcRenderer.invoke (secure IPC)
┌────────────────────▼────────────────────────────┐
│  Preload script (contextBridge)                 │
│                                                 │
│  window.electronAPI.getLicenseToken()           │
└────────────────────┬────────────────────────────┘
                     │ window.electronAPI.getLicenseToken()
┌────────────────────▼────────────────────────────┐
│  Renderer (browser context)                     │
│                                                 │
│  SciChartSurface.setLicenseCallback(            │
│    () => window.electronAPI.getLicenseToken()   │
│  )                                              │
└─────────────────────────────────────────────────┘
```

## How it works

1. The renderer sets a runtime license key with the `"SV"` (SimpleValidation) feature flag.
2. SciChart calls the license callback instead of a network fetch.
3. The callback invokes `window.electronAPI.getLicenseToken()` exposed via `contextBridge`.
4. The preload forwards the call to the main process using `ipcRenderer.invoke`.
5. The main process computes `HMAC-SHA256(serverSecret, "nonce:expiry")` and returns the token.
6. SciChart verifies the token in WASM and caches it in a cookie for 7 days.

## Prerequisites

- Node.js 18+
- A SciChart license with the `"SV"` feature flag enabled

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile). Find your license's Server Secret, which is 64 hex characters. This will only be available if you have Advanced Licensing with Simple Validation enabled on your order.

2. **Set the Server Secret**
   Edit `src/main.ts` and replace the `SCICHART_SERVER_SECRET` value. This constant lives only in the main process — it is never bundled into the renderer.

3. **Set the client license key**
   Edit `src/renderer.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string.

4. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

## Key files

| File              | Role                                                                               |
| ----------------- | ---------------------------------------------------------------------------------- |
| `src/main.ts`     | Creates the window, registers `ipcMain.handle('get-license-token')`, computes HMAC |
| `src/preload.ts`  | Bridges IPC to the renderer via `contextBridge.exposeInMainWorld`                  |
| `src/renderer.ts` | Calls `setLicenseCallback` with the IPC bridge, initialises the chart              |
| `src/global.d.ts` | TypeScript type for `window.electronAPI`                                           |

## Security notes

- `contextIsolation: true` (Electron default since v12) ensures the preload's Node.js context is isolated from renderer JavaScript.
- `nodeIntegration: false` means renderer code cannot call Node.js APIs or `require()` directly.
- Only `getLicenseToken` is exposed via `contextBridge` — the full `ipcRenderer` is never accessible from the renderer, preventing arbitrary IPC message injection.
- The Server Secret and HMAC computation are confined to the main process, which is not inspectable via renderer DevTools.

## Differences from Advanced Server Licensing

|                       | Simple (this example)       | Advanced                              |
| --------------------- | --------------------------- | ------------------------------------- |
| Token generation      | Main process (IPC)          | Main process (IPC + native DLL)       |
| Challenge/response    | No                          | Yes (NaCl asymmetric)                 |
| Token validity        | 7 days, daily re-validation | 7 days, daily re-validation           |
| Required feature flag | `"SV"`                      | none                                  |
| Security model        | Symmetric HMAC              | Asymmetric, challenge enforces domain |
