# Simple Server Licensing Example (.NET 10 MVC)

Demonstrates SciChart's **Simple Server Validation v2** flow in an ASP.NET Core MVC application via the [`SciChart.AspNetCore.SimpleLicensing`](../SciChart.AspNetCore.SimpleLicensing/) package.

This example uses **inline meta-tag delivery as the primary path**: the licence token is rendered into `<head>` by the layout, so SciChart validates with no XHR on each full page load. The XHR endpoint stays mapped for re-validation when long-running sessions outlive the cached cookie.

## How it works

A v2 token can take one of two shapes on the wire:

- **Inline** (4 fields) — `v2:serverNonce:serverNow:hmac`. Independent of any client state; servable to many clients and embeddable in HTML via a `<meta>` tag. Should still be signed per request — the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the token is older than the licence's tolerance, so caching past that point causes valid clients to reject otherwise-correct tokens.
- **Round-trip** (5 fields) — `v2:clientNonce:serverNonce:serverNow:hmac`. The client generates a random nonce in WASM and sends it as `?nonce=<hex>`; the server echoes it into the signed token. A captured response is bound to the requesting client and cannot be replayed on another origin.

For most deployments the two shapes are interchangeable under a single licence — mix inline meta-tag delivery and round-trip requests freely, the SciChart client accepts whichever arrives. Deployments that can't keep server and client clocks in reasonable alignment should be locked to round-trip only: inline tokens can drift stale, round-trip tokens are signed against the request that produced them.

The fourth field of `SV:H:V:N` chooses: `0` (permissive default) accepts both shapes; `1` (restricted) accepts round-trip only and disables inline delivery.

```
Initial validation, every full page load — no XHR:

ASP.NET Core MVC renders:
  <head>
    <scichart-license />   →   <meta name="x-scichart-license"
                                     content="v2:<serverNonce>:<serverNow>:<hmac>" />
  </head>

Browser loads → SciChart WASM reads the meta tag, verifies the HMAC against
the runtime licence key's embedded secret, checks clock skew, and caches
the result in `scLicense` until valid_time has elapsed.

Re-validation (cached cookie expired without a page reload, or validate_nonce=1):

Browser (SciChart.js)
  → GET /api/license?orderid=<X>[&nonce=<hex>]
  ← 200 OK  body: v2:[clientNonce:]serverNonce:serverNow:hmac

Served by `MapSciChartLicenseEndpoint()` from the same package.
```

## What the package gives you

|                                    |                                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `AddSciChartSimpleLicensing(...)`  | Registers the singleton token service; binds your Server Secret.                                                                     |
| `<scichart-license />`             | Razor tag helper. One line in `_Layout.cshtml` head; emits a fresh `<meta name="x-scichart-license" content="v2:..." />` per render. |
| `app.MapSciChartLicenseEndpoint()` | `GET /api/license` for re-validation after the cached cookie expires, and the only path used when `validate_nonce=1`.                |

The package contains no native dependency — just `System.Security.Cryptography.HMACSHA256`.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) (the package itself targets `net8.0` and works with .NET 8+)
- Node.js 18+ (for building the client bundle)
- A SciChart license with the `SV:H:V:N` feature flag, where:

  - `max_skew` — accepted client/server clock skew as `H` or `H.MM` (e.g. `0.05` = 5 min, `1` = 1 h, `1.30` = 90 min). `0` disables the check.
  - `valid_time` — token validity in the client's wall clock, same `H.MM` format (e.g. `168` = 7 days, `0.30` = 30 min)
  - `validate_nonce` — `0` accepts either shape (permissive default); `1` restricts to round-trip only (inline delivery disabled)

  Contact [support@scichart.com](mailto:support@scichart.com) to have an SV v2 feature added to your license.

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile). Find your license's Server Secret, a 64-char hex string. Only present if Advanced Licensing with Simple Validation is enabled on your order.

2. **Set the Server Secret**
   Edit `appsettings.json` and replace `YOUR_SERVER_SECRET_HERE`:

   ```json
   "SciChart": {
     "ServerSecret": "0123456789abcdef..."
   }
   ```

   For production, override via the standard ASP.NET Core configuration sources (user secrets, environment variables, key vault).

3. **Set the client license key**
   Edit `src/index.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string. The key must carry an `SV:H:V:N` feature.

4. **Build the client bundle**

   ```bash
   npm install
   npm run build
   ```

5. **Run the server**
   ```bash
   dotnet run
   ```
   Open http://localhost:5000 — the chart should render without a watermark.

## How the example is wired up

`Program.cs`:

```csharp
builder.Services.AddSciChartSimpleLicensing(builder.Configuration.GetSection("SciChart"));
// ...
app.MapSciChartLicenseEndpoint();
```

`Views/_ViewImports.cshtml`:

```cshtml
@addTagHelper *, SciChart.AspNetCore.SimpleLicensing
```

`Views/Shared/_Layout.cshtml`:

```cshtml
<head>
    <scichart-license />
    ...
</head>
```

That's the entire integration. Any new view rendered through `_Layout.cshtml` automatically carries a fresh server-signed v2 token.

## Verification

- View source on http://localhost:5000 — you should see `<meta name="x-scichart-license" content="v2:..." />` in `<head>`.
- Open browser DevTools → Network. On a fresh load with `validate_nonce=0` you should see **no** `/api/license` request — the meta tag covers validation. With `validate_nonce=1`, every load fires `GET /api/license?orderid=...&nonce=<hex>` returning `200`. Either way, the same endpoint will be hit later for re-validation once the cached cookie expires.
- In Application → Cookies, `scLicense` is set with a future expiry.
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
- `clientNonce` (round-trip only) — verbatim echo of the request's `?nonce=` value, validated against `^[0-9a-fA-F]{8,64}$`
- `hmac` — `HMAC-SHA256(serverSecret, payload)` where the payload is everything before the final colon

## Server snippets for other languages

See [../SimpleServerSideLicensing-Readme.md](../SimpleServerSideLicensing-Readme.md) for Python, Go, Ruby, PHP, and Rust snippets.

> **Key point in all cases:** hex-decode the Server Secret to binary bytes before passing to HMAC. Do not use the hex string directly as the key.

> **Inline-mode caching:** not recommended. Inline tokens are not bound to a particular client, but the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the cache is older than the licence's tolerance — sign per request. Round-trip responses cannot be cached either.

## Differences from Advanced Server Licensing

|                             | Simple (this example)                                 | Advanced                            |
| --------------------------- | ----------------------------------------------------- | ----------------------------------- |
| Server dependency           | `SciChart.AspNetCore.SimpleLicensing` (BCL HMAC only) | `SciChart.Server.Licensing` NuGet   |
| Crypto                      | Symmetric HMAC-SHA256                                 | Asymmetric NaCl box                 |
| Token validity              | Per-licence (`valid_time`)                            | 7 days, daily re-validation         |
| Cross-origin replay defence | Round-trip shape + client nonce                       | Encrypted challenge enforces domain |
| Clock-skew tolerance        | Per-licence (`max_skew`, 0 disables)                  | Anchored on client time             |
| Required feature flag       | `SV:H:V:N`                                            | none                                |
