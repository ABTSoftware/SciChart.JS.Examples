# Simple Server Licensing Example (Electron)

Demonstrates SciChart's **Simple Server Validation v2** flow in an Electron app — server-side license validation using only HMAC-SHA256, with no native DLL and no FFI. Unlike the HTTP server examples, there is no separate server process: the token is generated in the Electron **main process** and delivered to the renderer via IPC.

This is the correct pattern for Electron — the Server Secret never appears in renderer code, where it would be visible in DevTools or extractable from the renderer bundle.

## How it works

This example produces an **inline-shape** v2 token only — `v2:serverNonce:serverNow:hmac` — and delivers it over Electron IPC rather than via HTTP. The renderer-side dependency callback for IPC integrations has no client-nonce mechanism, so round-trip-shape tokens aren't producible on this path. The licence therefore must permit inline delivery (`validate_nonce=0`); a `validate_nonce=1` licence cannot be used here because it would reject every inline-shape response. The cross-origin replay scenario that round-trip-shape tokens defend against isn't meaningful for a token minted in the same trusted process that consumes it.

```
┌─────────────────────────────────────────────────┐
│  Main process (Node.js)                         │
│                                                 │
│  ipcMain.handle('get-license-token')            │
│    payload = "v2:" + serverNonce + ":" + now    │
│    hmac    = HMAC-SHA256(serverSecret, payload) │
│    token   = payload + ":" + hmac               │
└────────────────────┬────────────────────────────┘
                     │ ipcRenderer.invoke (secure IPC)
┌────────────────────▼────────────────────────────┐
│  Preload (contextBridge.exposeInMainWorld)      │
│                                                 │
│  window.electronAPI.getLicenseToken()           │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│  Renderer (browser context)                     │
│                                                 │
│  SciChartSurface.setLicenseCallback(            │
│    () => window.electronAPI.getLicenseToken()   │
│  )                                              │
│                                                 │
│  SciChart WASM verifies HMAC, checks clock skew │
│  against the licence's max_skew, and      │
│  caches the result in a cookie until            │
│  valid_time has elapsed.                  │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+
- A SciChart license with the `SV:H:V:N` feature flag, where:

  - `max_skew` — accepted client/server clock skew as `H` or `H.MM` (e.g. `0.05` = 5 min, `1` = 1 h, `1.30` = 90 min). `0` disables the check.
  - `valid_time` — token validity in the client's wall clock, same `H.MM` format (e.g. `168` = 7 days, `0.30` = 30 min)
  - `validate_nonce` — **must be `0`** for this Electron example. The IPC bridge produces inline-shape tokens only; a `1` licence would reject them.

  Contact [support@scichart.com](mailto:support@scichart.com) to have an SV v2 feature added to your license.

> **Important:** the licence used with this example must have `validate_nonce=0`. The Electron IPC bridge has no client-nonce mechanism, so a `validate_nonce=1` licence — which restricts the client to round-trip-shape tokens — cannot be used on this path.

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile) and open **Orders & Keys → Manage Licenses → Runtime License Key**. Copy the **Server Secret** (a 64-char hex string) from the _Server Secret_ section. Only present if your license carries the Simple Server Validation (`SV`) feature.

2. **Set the Server Secret**
   Edit `src/main.ts` and replace `SCICHART_SERVER_SECRET` with your Server Secret. This constant lives only in the main process — it is never bundled into the renderer.

3. **Set the client license key**
   Edit `src/renderer.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string. The key must carry an `SV:H:V:N` feature with `validate_nonce=0`.

4. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

## Verification

- Open Electron's renderer DevTools. The console should log `Simple server license validated` and the chart should render without a watermark.
- In Application → Cookies, you should see `scLicense` set with a future expiry.
- The token traffic happens over Electron IPC, not HTTP, so there is no network request to inspect.

## Token format (inline only)

```
v2:<serverNonce>:<serverNow>:<hmac>
```

- `serverNonce` — server-generated random hex (8 bytes / 16 hex chars)
- `serverNow` — server wall-clock Unix timestamp, decimal seconds
- `hmac` — `HMAC-SHA256(serverSecret, payload)` where the payload is everything before the final colon (i.e. `v2:<serverNonce>:<serverNow>`)

> **Key point:** hex-decode the Server Secret to binary bytes before passing to HMAC. Do not use the hex string directly as the key. See `src/main.ts` — `Buffer.from(SCICHART_SERVER_SECRET, "hex")`.

## Key files

| File              | Role                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ |
| `src/main.ts`     | Creates the window, registers `ipcMain.handle('get-license-token')`, signs v2 tokens |
| `src/preload.ts`  | Bridges IPC to the renderer via `contextBridge.exposeInMainWorld`                    |
| `src/renderer.ts` | Wires `setLicenseCallback` to the IPC bridge, initialises the chart                  |
| `src/global.d.ts` | TypeScript type for `window.electronAPI`                                             |

## Differences from the HTTP-server examples

The Node.js, .NET, and Java examples in this repo all expose an HTTP `GET /api/license` endpoint. SciChart's renderer-side WASM hits it directly, and round-trip-shape tokens (`validate_nonce=1`) are available to defeat cross-origin replay. The Electron path is different in three ways that materially change the threat model:

- **No HTTP endpoint.** The token is produced in the Electron main process and crosses the trusted IPC boundary, not the wire.
- **Inline shape only.** The renderer-side dependency callback for IPC integrations has no client-nonce parameter, so the licence must use `validate_nonce=0`.
- **No CORS / cross-origin replay story.** The token never leaves the app process, so the cross-origin replay attack that round-trip-shape tokens defend against doesn't apply here.

## Security notes

- `contextIsolation: true` (Electron default since v12) isolates the preload's Node.js context from renderer JavaScript.
- `nodeIntegration: false` means renderer code cannot call Node.js APIs or `require()` directly.
- Only `getLicenseToken` is exposed via `contextBridge` — the full `ipcRenderer` is never accessible from the renderer, preventing arbitrary IPC message injection.
- The Server Secret and HMAC computation are confined to the main process, which is not inspectable via renderer DevTools.

## Further reading

- [../SimpleServerSideLicensing-Readme.md](../SimpleServerSideLicensing-Readme.md) — the broader SV v2 story, plus server snippets for Python, Go, Ruby, PHP, and Rust.
- [../nodejs-simple-server-licensing/README.md](../nodejs-simple-server-licensing/README.md) — the HTTP-server reference that this example is derived from.
