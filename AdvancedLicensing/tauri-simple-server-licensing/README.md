# SciChart Simple Server Licensing — Tauri (Rust)

Demonstrates SciChart's **Simple Server Validation v2** flow inside a [Tauri](https://tauri.app/) desktop application. The HMAC-SHA256 token is generated in the **Rust backend** and delivered to SciChart's licence callback via Tauri's `invoke` bridge — the Server Secret is compiled into the native binary and never appears in the webview, DevTools, or any JavaScript.

This is the desktop equivalent of running a web server, with one notable security advantage over Electron: the Rust code is compiled to a native binary, making the Server Secret significantly harder to extract than minified JavaScript in an Electron main process.

## How it works

This example produces an **inline-shape** v2 token only — `v2:serverNonce:serverNow:hmac` — delivered to the webview via Tauri's `invoke` bridge rather than over HTTP:

- The Rust backend signs the token in-process; it never crosses an untrusted network on the way to the webview.
- A fresh token is generated per invoke — caching is not used. The embedded `serverNow` would otherwise drift outside the licence's `max_skew` window once the cache age exceeds it.

The webview-side dependency callback for `invoke` integrations has no client-nonce mechanism, so round-trip-shape tokens aren't producible on this path. The licence therefore must permit inline delivery (`validate_nonce=0`); a `validate_nonce=1` licence — which restricts the client to round-trip-shape tokens — cannot be used here because it would reject every inline-shape response. The cross-origin replay scenario that round-trip-shape tokens defend against isn't meaningful for a token minted in the same trusted process that consumes it.

```
Webview (SciChart.js)
  setLicenseCallback → invoke("get_license_token")
    → Rust: HMAC-SHA256(serverSecretBytes, "v2:serverNonce:serverNow")
  ← v2:serverNonce:serverNow:hmac

SciChart WASM verifies HMAC, checks clock skew against the licence's
max_skew, and caches the result until valid_time has elapsed.
```

## Prerequisites

- [Rust](https://rustup.rs/) stable (1.77.2+)
- [Node.js](https://nodejs.org/) 18+ (for the frontend bundle)
- [Tauri CLI](https://tauri.app/start/prerequisites/) v2
- WebView2 runtime (Windows — included in Windows 11; downloadable for Windows 10)
- A SciChart license with an `SV:H:V:N` feature flag, where:

  - `max_skew` — accepted client/server clock skew as `H` or `H.MM` (e.g. `0.05` = 5 min, `1` = 1 h, `1.30` = 90 min). `0` disables the check.
  - `valid_time` — token validity in the client's wall clock, same `H.MM` format (e.g. `168` = 7 days, `0.30` = 30 min)
  - `validate_nonce` — **must be `0`** for this example. The Tauri `invoke` bridge produces inline-shape tokens only; a `1` licence would reject them.

  Contact [support@scichart.com](mailto:support@scichart.com) to have an SV v2 feature added to your license. Be explicit that the licence is for a Tauri / inline-shape integration.

## Setup

**1. Install the Tauri CLI:**

```bash
cargo install tauri-cli --version "^2" --locked
```

**2. Set the Server Secret.**

In `src-tauri/src/lib.rs`, replace the placeholder with your Server Secret from [SciChart MyAccount](https://www.scichart.com/my-account/) (**Orders & Keys → Manage Licenses → Runtime License Key**, the _Server Secret_ section) — a 64-char hex string, only present if your license carries the Simple Server Validation (`SV`) feature:

```rust
const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";
```

**3. Set the client license key.**

In `src/renderer.ts`, replace the placeholder with your full license key string. The key must carry an `SV:H:V:N` feature with `validate_nonce=0`:

```typescript
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");
```

**4. Install frontend dependencies and build:**

```bash
npm install
npm run build
```

**5. Run in development mode:**

```bash
cargo tauri dev
```

The chart should render without a watermark.

## Verification

- The console should log `Simple server license validated`.
- No HTTP requests to `/api/license` are visible in DevTools — token delivery goes through Tauri's IPC bridge, not the network.
- Removing the Server Secret (or breaking the HMAC payload) causes the chart to render with the trial watermark and the console to log a validation failure.

## Token format (inline shape)

```
v2:<serverNonce>:<serverNow>:<hmac>
```

- `serverNonce` — 8 random bytes, hex-encoded
- `serverNow` — server wall-clock Unix timestamp, decimal seconds
- `hmac` — `HMAC-SHA256(serverSecretBytes, "v2:" + serverNonce + ":" + serverNow)` in hex

The HMAC signs the full payload up to (but not including) the final colon and the HMAC field. The Server Secret is hex-decoded to raw bytes before being passed to HMAC — using the hex string directly as the key would silently produce a different result.

## Differences from the HTTP-server examples

|                        | Tauri (this example)                                  | HTTP-server examples (Node.js, Rust/Axum, etc.)                            |
| ---------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| Delivery channel       | Tauri `invoke` IPC bridge                             | HTTP `GET /api/license`                                                    |
| Supported modes        | Inline only                                           | Inline **and** round-trip                                                  |
| Required licence flag  | `SV:H:V:N` with `validate_nonce=0`                    | Either mode                                                                |
| Server Secret exposure | Compiled into native binary                           | Lives in the server process                                                |
| Threat model           | Same trusted process generates and consumes the token | Network response; the round-trip shape defends against cross-origin replay |
| CORS / HTTP plumbing   | None                                                  | Required                                                                   |

For the broader SV v2 story — including the round-trip shape and server snippets in Python, Go, Ruby, PHP, and Rust/Axum — see [../SimpleServerSideLicensing-Readme.md](../SimpleServerSideLicensing-Readme.md).

## Project structure

```
tauri-simple-server-licensing/
├── src/
│   └── renderer.ts          # SciChart init + setLicenseCallback via invoke
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs           # Tauri command: v2 inline token generator
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
