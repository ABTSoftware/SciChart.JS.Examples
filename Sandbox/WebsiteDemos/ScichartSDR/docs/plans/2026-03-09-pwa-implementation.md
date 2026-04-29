# PWA Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade sdr-radio to a full PWA — installable, precached static assets (including WASM), and a graceful offline notice banner.

**Architecture:** `vite-plugin-pwa` wraps Workbox to auto-generate a service worker at build time that precaches all JS/CSS/WASM chunks. `@vite-pwa/assets-generator` generates all icon sizes from `favicon.svg` via a one-off CLI command. An `OfflineNotice` component listens to `window` online/offline events and renders a banner when disconnected.

**Tech Stack:** Vite 7, React 19, TypeScript, vite-plugin-pwa, @vite-pwa/assets-generator, Workbox

---

### Task 1: Install dependencies

**Files:**

- Modify: `package.json` (via npm)

**Step 1: Install dev dependencies**

```bash
npm install --save-dev vite-plugin-pwa @vite-pwa/assets-generator
```

Expected: both packages appear in `devDependencies` in `package.json`.

**Step 2: Verify install**

```bash
npx vite --version
```

Expected: version prints without error (confirms no broken installs).

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vite-plugin-pwa and assets-generator"
```

---

### Task 2: Generate PWA icon assets

**Files:**

- Create: `pwa-assets.config.ts` (project root)
- Create: `public/icons/` (generated, not hand-written)

**Step 1: Create the assets generator config**

Create `pwa-assets.config.ts` at the project root:

```ts
import { defineConfig, minimalPreset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: minimalPreset,
  images: ["public/favicon.svg"],
});
```

`minimalPreset` generates: `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png` — all output to `public/`.

**Step 2: Add the generate script to package.json**

In `package.json`, add to `"scripts"`:

```json
"generate-pwa-assets": "pwa-assets-generator --config pwa-assets.config.ts"
```

**Step 3: Run the generator**

```bash
npm run generate-pwa-assets
```

Expected: several `.png` files appear in `public/` (e.g., `pwa-192x192.png`, `apple-touch-icon-180x180.png`, etc.).

**Step 4: Commit**

```bash
git add pwa-assets.config.ts package.json public/pwa-64x64.png public/pwa-192x192.png public/pwa-512x512.png public/maskable-icon-512x512.png public/apple-touch-icon-180x180.png
git commit -m "chore: generate PWA icon assets from favicon.svg"
```

---

### Task 3: Configure VitePWA plugin

**Files:**

- Modify: `vite.config.ts`

**Step 1: Update vite.config.ts**

Replace the entire file with:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      pwaAssets: {
        config: true,
      },
      manifest: {
        name: "SciChart SDR",
        short_name: "SDR Radio",
        description:
          "Software Defined Radio receiver with spectrum and waterfall display",
        theme_color: "#040d1a",
        background_color: "#090e18",
        display: "standalone",
        orientation: "landscape",
        start_url: ".",
        scope: ".",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,wasm,data}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  assetsInclude: ["**/*.wasm", "**/*.data"],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("/node_modules/")) {
            return undefined;
          }

          if (id.includes("/node_modules/scichart/")) {
            return "scichart-vendor";
          }

          if (
            id.includes("/node_modules/@mui/") ||
            id.includes("/node_modules/@emotion/")
          ) {
            return "mui-vendor";
          }

          if (id.includes("/node_modules/@jtarrio/")) {
            return "sdr-vendor";
          }

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/")
          ) {
            return "react-vendor";
          }

          return undefined;
        },
      },
    },
  },
});
```

Key additions:

- `VitePWA(...)` plugin with `autoUpdate` SW registration
- `pwaAssets: { config: true }` — reads `pwa-assets.config.ts` and auto-injects icon tags into the HTML
- `workbox.globPatterns` includes `**/*.wasm` so WASM files are precached
- `maximumFileSizeToCacheInBytes: 5MB` — allows caching the SciChart WASM files (each ~1.2MB)
- `start_url: '.'` and `scope: '.'` match the `base: './'` setting

**Step 2: Verify the build compiles**

```bash
npm run build
```

Expected: build succeeds, `dist/sw.js` and `dist/manifest.webmanifest` are generated. You may also see a Workbox precache manifest log showing the WASM files.

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat: configure VitePWA plugin with Workbox and manifest"
```

---

### Task 4: Register service worker in main.tsx

**Files:**

- Modify: `src/main.tsx`
- Modify: `tsconfig.app.json`

**Step 1: Add vite-plugin-pwa types to tsconfig**

In `tsconfig.app.json`, update the `types` array:

```json
"types": ["vite/client", "vite-plugin-pwa/client"]
```

This gives TypeScript the type declaration for the `virtual:pwa-register` module.

**Step 2: Update main.tsx**

```ts
import { registerSW } from "virtual:pwa-register";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);
```

`registerSW({ immediate: true })` registers the service worker and activates it immediately on first install. With `registerType: 'autoUpdate'`, updates apply automatically when a new SW is available.

**Step 3: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors about `virtual:pwa-register`.

**Step 4: Commit**

```bash
git add src/main.tsx tsconfig.app.json
git commit -m "feat: register PWA service worker in app entry point"
```

---

### Task 5: Create OfflineNotice component

**Files:**

- Create: `src/components/OfflineNotice.tsx`

**Step 1: Create the component**

```tsx
import { useState, useEffect } from "react";

export function OfflineNotice() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="offline-notice">
      No internet connection — radio hardware required to receive signals
    </div>
  );
}
```

**Step 2: Add CSS for the banner**

In `src/App.css`, append at the end:

```css
.offline-notice {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 8px 16px;
  background: rgba(180, 60, 40, 0.92);
  color: #fff;
  font-size: 0.82rem;
  text-align: center;
  letter-spacing: 0.03em;
  border-top: 1px solid rgba(255, 100, 80, 0.5);
}
```

**Step 3: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/components/OfflineNotice.tsx src/App.css
git commit -m "feat: add OfflineNotice component for offline state"
```

---

### Task 6: Wire OfflineNotice into App.tsx

**Files:**

- Modify: `src/App.tsx`

**Step 1: Import and render OfflineNotice**

At the top of `App.tsx`, add the import alongside existing imports:

```ts
import { OfflineNotice } from "./components/OfflineNotice";
```

Inside the `return (...)`, place `<OfflineNotice />` as the last child inside `<Box className="receiver-page">`, just before the closing `</Box>`:

```tsx
return (
  <Box className="receiver-page">
    <Paper className="receiver-frame" elevation={0}>
      {/* ... existing content ... */}
    </Paper>
    <OfflineNotice />
  </Box>
);
```

**Step 2: Verify build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: show offline notice banner when network is unavailable"
```

---

### Task 7: End-to-end PWA verification

**Step 1: Serve the production build**

```bash
npm run preview
```

Open the URL printed (typically `http://localhost:4173`).

**Step 2: Check PWA install prompt**

In Chrome/Edge: look for the install icon in the address bar. Click it — the app should install and open in a standalone window with the correct name "SciChart SDR".

**Step 3: Check Lighthouse PWA audit**

In Chrome DevTools → Lighthouse → select "Progressive Web App" category → Generate report.

Expected: all PWA checks pass (installable, service worker registered, manifest valid, icons present).

**Step 4: Check offline caching**

In Chrome DevTools → Application → Service Workers: confirm the SW is registered and active.

In DevTools → Application → Cache Storage: confirm `workbox-precache` contains JS/CSS/WASM entries.

**Step 5: Test offline banner**

In DevTools → Network tab → check "Offline" → reload the page.

Expected: app shell loads from cache, red offline banner appears at the bottom.

**Step 6: Commit final verification note (optional)**

If any issues found during verification, fix them and commit. Otherwise the feature is complete.

---

## Troubleshooting Notes

- **`virtual:pwa-register` type error**: ensure `"vite-plugin-pwa/client"` is in `tsconfig.app.json` `types` array.
- **WASM files not precached**: confirm `globPatterns` in workbox config includes `**/*.wasm`. Check `dist/sw.js` for the precache manifest list.
- **SW scope issues with `base: './'`**: if the SW doesn't register in a subdirectory deployment, verify `start_url: '.'` and `scope: '.'` are set in the manifest config.
- **Large cache warning**: the WASM files are ~1.2MB each. The `maximumFileSizeToCacheInBytes: 5MB` override handles this.
