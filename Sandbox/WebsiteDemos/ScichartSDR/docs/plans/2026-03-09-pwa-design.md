# PWA Upgrade Design — 2026-03-09

## Goal

Upgrade sdr-radio to a full Progressive Web App: installable, cacheable static assets for fast repeat loads, and a graceful offline UI.

## Approach

Use `vite-plugin-pwa` (Workbox) for service worker generation and manifest injection. Use `@vite-pwa/assets-generator` to produce all icon sizes from the existing `favicon.svg`.

## Architecture

- `vite-plugin-pwa` injects SW registration into the build and generates `sw.js` via Workbox at build time.
- Workbox precaches all JS/CSS chunks and WASM files on first install.
- `autoUpdate` mode: SW updates silently in background, activates on next app open.
- `OfflineNotice` React component listens to `navigator.onLine` and renders a banner when offline.

## Web App Manifest

Configured in `vite.config.ts` via the plugin:

- `name`: "SciChart SDR"
- `short_name`: "SDR Radio"
- `display`: "standalone"
- `theme_color`: matches app dark theme
- `background_color`: matches app background
- Icons: 64, 192, 512 (standard + maskable), Apple touch icon

## Service Worker / Caching

- **Precache**: all Vite build artifacts + public WASM files (`scichart.wasm`, `scichart-nosimd.wasm`, `scichart2d.js`)
- **Navigation**: `NetworkFirst` strategy
- **Assets**: `CacheFirst` strategy
- **Tradeoff**: initial SW install is large (~several MB for WASM) — acceptable for a desktop radio tool

## Offline UI

- New `OfflineNotice` component shown when `navigator.onLine === false`
- Simple banner: _"No internet connection — radio hardware required to receive signals"_
- App shell (charts, controls) remains visible; only radio connection is blocked by hardware absence

## Files Changed

| File                               | Change                                                   |
| ---------------------------------- | -------------------------------------------------------- |
| `vite.config.ts`                   | Add `VitePWA()` plugin with manifest + Workbox config    |
| `src/main.tsx`                     | Register SW via `registerSW` from `virtual:pwa-register` |
| `src/components/OfflineNotice.tsx` | New component                                            |
| `src/App.tsx`                      | Add `<OfflineNotice />`                                  |
| `public/icons/`                    | Generated icon assets                                    |
| `package.json`                     | Add `vite-plugin-pwa`, `@vite-pwa/assets-generator`      |

## New Dependencies

- `vite-plugin-pwa` (devDependency)
- `@vite-pwa/assets-generator` (devDependency)
