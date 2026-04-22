# Mobile Optimisation Design — 2026-03-09

## Target

Android Chrome with RTL-SDR via USB OTG. App currently "struggles to work at all" on mobile.

## Root Causes

1. **`100vh` layout break** — Android Chrome's dynamic address bar makes `100vh` overflow, cutting off content below the fold.
2. **Browser zoom hijacks touch** — Without `user-scalable=no`, pinch on the charts triggers browser zoom instead of reaching the app's pointer events.
3. **Missing `touch-action: none` on charts** — Single-finger swipes on the charts area are intercepted as page scroll before the app receives them.
4. **No pinch-to-zoom** — Scroll-wheel zoom isn't available on touch; the zoom slider is the only option and is buried in the controls panel.
5. **High default DSP load** — 2 MSPS + FFT 2048 + CPU performance mode can freeze or crash weaker mobile CPUs.

## Changes

### 1. Viewport & Layout (`index.html`, `App.css`)

- `index.html`: Add `user-scalable=no, maximum-scale=1` to viewport meta tag.
- `App.css`: Replace `100vh` with `100dvh` on `.receiver-page` height, `.receiver-frame` height, and `.controls-panel` max-height.
- `App.css`: Add `touch-action: none` to `.receiver-charts`.

### 2. Pinch-to-Zoom Hook (`src/features/receiver/hooks/usePinchZoom.ts`)

New hook attached to `chartsContainerRef` in `App.tsx`. Tracks up to two simultaneous pointer IDs. When both are active, computes Euclidean distance change between them per frame and maps it to `setZoomLevel` (range 1–4×). Single-pointer interactions (tap-to-tune, drag tuning window) unaffected — hook only activates at `pointerCount === 2`. Cleans up on `pointerup` and `pointercancel`.

### 3. Mobile-Aware Defaults (`src/features/receiver/hooks/useReceiverSettings.ts`)

Detect mobile once at init: `/Mobi|Android/i.test(navigator.userAgent)`.

| Setting               | Desktop   | Mobile      |
| --------------------- | --------- | ----------- |
| `sampleRate`          | 2,048,000 | 1,024,000   |
| `fftSize`             | 2048      | 1024        |
| `performanceTradeoff` | `"cpu"`   | `"latency"` |

Detection is not reactive — runs once in `useState` initializer. User can still change all settings via the Settings dialog.

## Files Changed

| File                                                 | Change                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `index.html`                                         | Add `user-scalable=no, maximum-scale=1` to viewport         |
| `src/App.css`                                        | `100vh → 100dvh` (3 places), `touch-action: none` on charts |
| `src/features/receiver/hooks/usePinchZoom.ts`        | New hook                                                    |
| `src/features/receiver/hooks/index.ts`               | Export `usePinchZoom`                                       |
| `src/App.tsx`                                        | Wire `usePinchZoom` into `chartsContainerRef`               |
| `src/features/receiver/hooks/useReceiverSettings.ts` | Mobile-aware defaults                                       |
