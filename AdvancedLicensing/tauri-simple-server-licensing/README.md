# SciChart Simple Server Licensing — Tauri (Rust)

Demonstrates Simple Server Validation for SciChart.js in a [Tauri](https://tauri.app/) desktop application. The HMAC-SHA256 token is generated in the **Rust backend** and delivered to SciChart via Tauri's `invoke` bridge — the Server Secret is compiled into the native binary and never appears in the webview, DevTools, or any JavaScript.

This is the desktop equivalent of running a web server, with one notable security advantage over Electron: the Rust code is compiled to a native binary, making the Server Secret significantly harder to extract than minified JavaScript in an Electron main process.

## Prerequisites

- [Rust](https://rustup.rs/) stable (1.77.2+)
- [Node.js](https://nodejs.org/) 18+
- WebView2 runtime (Windows — included in Windows 11; downloadable for Windows 10)
- A SciChart license key with the **`"SV"` (Simple Validation) feature flag**

## Setup

**1. Install the Tauri CLI:**

```bash
cargo install tauri-cli --version "^2" --locked
```

**2. Configure your keys.**

In `src-tauri/src/lib.rs`, replace the placeholder with your Server Secret from [SciChart MyAccount](https://www.scichart.com/profile):

```rust
const SCICHART_SERVER_SECRET: &str = "YOUR_64_HEX_CHAR_SERVER_SECRET";
```

In `src/renderer.ts`, replace the placeholder with your client license key:

```typescript
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");
```

**3. Install frontend dependencies and build:**

```bash
npm install
npm run build
```

**4. Run in development mode:**

```bash
cargo tauri dev
```

## How it works

```
Webview (SciChart.js)
  setLicenseCallback → invoke("get_license_token")
    → Rust: HMAC-SHA256(serverSecret, "nonce:expiry")
  ← nonce:expiry:hmac

SciChart WASM verifies the token and caches it for 7 days.
```

`SciChartSurface.setLicenseCallback` replaces SciChart's normal HTTP fetch with a custom async function. Here the callback calls `invoke("get_license_token")` which crosses the Tauri IPC bridge into Rust, computes the HMAC, and returns the token string. The `Response` wrapper makes it compatible with SciChart's expected interface.

### Frontend (`src/renderer.ts`)

```typescript
import { invoke } from "@tauri-apps/api/core";

SciChartSurface.setLicenseCallback(async (): Promise<Response> => {
  const token = await invoke<string>("get_license_token");
  return new Response(token);
});
```

### Rust backend (`src-tauri/src/lib.rs`)

```rust
const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

#[tauri::command]
fn get_license_token(cache: tauri::State<Mutex<LicenseCache>>) -> String {
    // hex-decode key, generate nonce, compute HMAC-SHA256, cache for 7 days
    ...
}
```

The token is cached in a `Mutex<LicenseCache>` managed by Tauri — only regenerated when fewer than 2 days remain before expiry.

## Project structure

```
tauri-simple-server-licensing/
├── src/
│   └── renderer.ts          # SciChart init + setLicenseCallback via invoke
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs           # Tauri commands including get_license_token
│   │   └── main.rs          # Entry point
│   ├── icons/               # App icons (required by Tauri)
│   ├── Cargo.toml
│   ├── build.rs
│   └── tauri.conf.json
├── index.html
├── webpack.config.js
├── package.json
└── tsconfig.json
```

## Production build

```bash
cargo tauri build
```

The installer is produced in `src-tauri/target/release/bundle/`.
