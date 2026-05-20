# SciChart.AspNetCore.SimpleLicensing

ASP.NET Core integration for [SciChart.js](https://www.scichart.com) **Simple Server Validation v2** — server-signed license tokens using HMAC-SHA256, no native dependency.

This package contains:

- `ISciChartLicenseTokenService` — generates v2 tokens (inline + round-trip).
- `<scichart-license />` tag helper — embeds the token in `<head>` as `<meta name="x-scichart-license" content="v2:..." />`.
- `MapSciChartLicenseEndpoint()` — minimal-API endpoint that serves the token over `GET /api/license`.

Use both together. The tag helper covers initial validation on every full page load (no XHR needed). The endpoint covers re-validation when the cached `scLicense` cookie expires — long-running SPAs eventually outlive `valid_time` and need a fresh token without a reload — and is also the only path the client uses when the licence has `validate_nonce=1`.

## Prerequisites

- ASP.NET Core 8.0 or newer
- A SciChart license with the `SV:H:V:N` feature flag, where:
  - `max_skew` — accepted client/server clock skew as `H` or `H.MM`
  - `valid_time` — token validity in the client's wall clock (`H.MM`)
  - `validate_nonce` — `0` permissive (inline or round-trip); `1` restricted (round-trip only)
- A 64-char hex Server Secret from [SciChart MyAccount](https://www.scichart.com/profile)

Contact [support@scichart.com](mailto:support@scichart.com) to have an SV v2 feature added to your license.

## Usage

### 1. Install

```bash
dotnet add package SciChart.AspNetCore.SimpleLicensing
```

### 2. Configure

`appsettings.json`:

```json
{
  "SciChart": {
    "ServerSecret": "0123456789abcdef..."
  }
}
```

### 3. Register

`Program.cs`:

```csharp
builder.Services.AddSciChartSimpleLicensing(builder.Configuration.GetSection("SciChart"));

// ... after `var app = builder.Build();`
app.MapSciChartLicenseEndpoint();
```

Alternative inline configuration:

```csharp
builder.Services.AddSciChartSimpleLicensing(opts =>
    opts.ServerSecret = "0123456789abcdef...");
```

### 4. Register the tag helper

`Views/_ViewImports.cshtml`:

```cshtml
@addTagHelper *, SciChart.AspNetCore.SimpleLicensing
```

### 5. Emit the meta tag

`Views/Shared/_Layout.cshtml`:

```cshtml
<!DOCTYPE html>
<html>
<head>
    <scichart-license />
    <!-- other head content -->
</head>
<body>
    @RenderBody()
</body>
</html>
```

### 6. Client side

The client still sets its runtime license key as usual:

```ts
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY");
```

That's it. Any page rendered through the layout carries a fresh server-signed v2 token in its head; the SciChart WASM runtime picks it up on `SciChartSurface.create(...)` and validates it offline.

## How the token gets to the client

Initial validation on every full page load — no XHR:

```
Server-rendered page:
  <head>
    <meta name="x-scichart-license"
          content="v2:<serverNonce>:<serverNow>:<hmac>" />
  </head>

SciChart WASM verifies HMAC against the runtime licence key's
embedded server secret, checks clock skew against max_skew,
enforces monotonicity, and caches the result in `scLicense`
until valid_time has elapsed.
```

Re-validation when the cached cookie expires — uses the mapped endpoint:

```
Browser (SciChart.js)
  → GET /api/license?orderid=<X>[&nonce=<hex>]
  ← 200 OK  body: v2:[clientNonce:]serverNonce:serverNow:hmac
```

A long-running SPA that stays open past `valid_time` will hit this path; the meta tag from the original page render is no longer fresh enough. Licences with `validate_nonce=1` use the same endpoint and additionally echo a client-generated nonce.

## Why a singleton

`ISciChartLicenseTokenService` is registered as a singleton — the secret is hex-decoded to bytes once at first resolution. To rotate the secret, restart the host (the standard ASP.NET Core options pattern would otherwise hot-reload `IOptionsMonitor<T>`, but a token-signing key change is a security-sensitive event that warrants an explicit restart).

## Differences from Advanced Server Licensing

|                             | Simple (this package)                | Advanced (`SciChart.Server.Licensing`) |
| --------------------------- | ------------------------------------ | -------------------------------------- |
| Server dependency           | None (stdlib HMAC)                   | Native DLL + FFI                       |
| Crypto                      | Symmetric HMAC-SHA256                | Asymmetric NaCl box                    |
| Token validity              | Per-licence (`valid_time`)           | 7 days, daily re-validation            |
| Cross-origin replay defence | Round-trip shape + client nonce      | Encrypted challenge enforces domain    |
| Clock-skew tolerance        | Per-licence (`max_skew`, 0 disables) | Anchored on client time                |
| Required feature flag       | `SV:H:V:N`                           | none                                   |
