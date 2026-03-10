# SciChart SDR (WebUSB + RTL-SDR)

A browser SDR receiver app inspired by [`jtarrio/radioreceiver`](https://github.com/jtarrio/radioreceiver), built with React + TypeScript + SciChart. Installable as a Progressive Web App.

## Features

- RTL-SDR input through WebUSB (`@jtarrio/webrtlsdr`)
- Live FFT spectrum + waterfall display
- Click-to-tune on spectrum/waterfall
- Separate `center` and `tuned` frequencies with automatic re-centering
- Demodulation modes from `@jtarrio/signals` (WBFM, NBFM, AM, etc.)
- Bandwidth, squelch, gain, PPM correction, stereo/mono, and volume controls
- Zoomable frequency viewport
- RDS station name display (WBFM)
- Frequency presets
- **PWA** — installable, precached assets, offline notice

## Requirements

- Chromium-based browser with WebUSB support (Chrome, Edge, Opera)
- RTL-SDR compatible USB dongle
- HTTPS or localhost (required for both WebUSB and service worker)

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the local Vite URL in a supported browser, connect your RTL-SDR, and press `START`.

## Build

```bash
npm run build
npm run preview   # serve production build locally
```

Run this after modifying `public/favicon.svg` to regenerate all icon sizes.

## Notes

- SciChart WebAssembly files are served from `public/scichart/`.
- Browser audio playback requires a user gesture before output starts.
- The service worker precaches all JS/CSS/WASM assets (~5.6 MB) on first install for fast subsequent loads.
