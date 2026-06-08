# Simple Server Licensing Example (Node.js)

Demonstrates SciChart's **Simple Server Validation v2** flow — server-side license validation using only HMAC-SHA256, with no native DLL and no FFI.

## How it works

A v2 token can take one of two shapes on the wire:

- **Inline** (4 fields) — `v2:serverNonce:serverNow:hmac`. Independent of any client state; servable to many clients and embeddable in HTML via a `<meta>` tag. Should still be signed per request — the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the token is older than the licence's tolerance, so caching past that point causes valid clients to reject otherwise-correct tokens.
- **Round-trip** (5 fields) — `v2:clientNonce:serverNonce:serverNow:hmac`. The client generates a random nonce in WASM and sends it as `?nonce=<hex>`; the server echoes it into the signed token. A captured response is bound to the requesting client and cannot be replayed on another origin.

For most deployments the two shapes are interchangeable under a single licence — mix inline meta-tag delivery and round-trip requests freely, the SciChart client accepts whichever arrives. Deployments that can't keep server and client clocks in reasonable alignment should be locked to round-trip only: inline tokens can drift stale, round-trip tokens are signed against the request that produced them.

The fourth field of `SV:H:V:N` chooses: `0` (permissive default) accepts both shapes; `1` (restricted) accepts round-trip only and disables inline delivery.

This example's server handles both shapes from one endpoint; the licence on the client side decides what it accepts.

```
Browser (SciChart.js)
  → GET /api/license?orderid=<X>[&nonce=<hex>]    (nonce only when validate_nonce=1)
  ← 200 OK  body: v2:[clientNonce:]serverNonce:serverNow:hmac

SciChart WASM verifies HMAC, checks clock skew against the licence's
max_skew, enforces server-time monotonicity across re-validations,
and caches the result in a cookie until valid_time has elapsed.
```

## Prerequisites

- Node.js 18+
- A SciChart license with the `SV:H:V:N` feature flag, where:

  - `max_skew` — accepted client/server clock skew as `H` or `H.MM` (e.g. `0.05` = 5 min, `1` = 1 h, `1.30` = 90 min). `0` disables the check.
  - `valid_time` — token validity in the client's wall clock, same `H.MM` format (e.g. `168` = 7 days, `0.30` = 30 min)
  - `validate_nonce` — `0` accepts either shape (permissive default); `1` restricts to round-trip only (inline delivery disabled)

  Contact [support@scichart.com](mailto:support@scichart.com) to have an SV v2 feature added to your license.

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile) and open **Orders & Keys → Manage Licenses → Runtime License Key**. Copy the **Server Secret** (a 64-char hex string) from the _Server Secret_ section. Only present if your license carries the Simple Server Validation (`SV`) feature.

2. **Set the Server Secret**
   Edit `src/server.ts` and replace `SCICHART_SERVER_SECRET` with your Server Secret.

3. **Set the client license key**
   Edit `src/index.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string. The key must carry an `SV:H:V:N` feature.

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Build and run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — the chart should render without a watermark.

## Verification

- Open browser DevTools → Network. Look for `GET /api/license?orderid=...` returning `200`. When the licence has `validate_nonce=1` the URL also has `&nonce=<hex>`.
- In Application → Cookies, you should see `scLicense` set with a future expiry.
- The console should log `Simple server license validated`.

## Token format

Inline shape (4 colon-separated fields):

```
v2:<serverNonce>:<serverNow>:<hmac>
```

Round-trip shape (5 colon-separated fields):

```
v2:<clientNonce>:<serverNonce>:<serverNow>:<hmac>
```

- `serverNonce` — server-generated random hex (≥ 16 chars)
- `serverNow` — server wall-clock Unix timestamp, decimal seconds
- `clientNonce` (round-trip only) — verbatim echo of the request's `?nonce=` value
- `hmac` — `HMAC-SHA256(serverSecret, payload)` where the payload is everything before the final colon

## Server snippets for other languages

See [../SimpleServerSideLicensing-Readme.md](../SimpleServerSideLicensing-Readme.md) for Python, Go, Ruby, PHP, and Rust snippets.

> **Key point in all cases:** hex-decode the Server Secret to binary bytes before passing to HMAC. Do not use the hex string directly as the key.

> **Inline-mode caching:** not recommended. Inline tokens are not bound to a particular client, but the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the cache is older than the licence's tolerance — sign per request. Round-trip responses cannot be cached either.

## Differences from Advanced Server Licensing

|                             | Simple (this example)                | Advanced                            |
| --------------------------- | ------------------------------------ | ----------------------------------- |
| Server dependency           | None (stdlib HMAC)                   | Native DLL + FFI                    |
| Crypto                      | Symmetric HMAC-SHA256                | Asymmetric NaCl box                 |
| Token validity              | Per-licence (`valid_time`)           | 7 days, daily re-validation         |
| Cross-origin replay defence | Round-trip shape + client nonce      | Encrypted challenge enforces domain |
| Clock-skew tolerance        | Per-licence (`max_skew`, 0 disables) | Anchored on client time             |
| Required feature flag       | `SV:H:V:N`                           | none                                |
