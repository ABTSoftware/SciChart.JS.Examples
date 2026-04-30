# Simple Server Licensing Example (.NET 10 MVC)

Demonstrates adding SciChart's **Simple Server Validation** endpoint to a standard ASP.NET Core MVC application. The pattern is a single `LicenseController` that slots naturally alongside your existing controllers — no changes to routing or middleware needed beyond the one shown.

## How it works

1. The client sets a runtime license key that has the `"SV"` (SimpleValidation) feature flag.
2. On load, SciChart calls `GET /api/license?orderid=<id>` on the same origin.
3. `LicenseController.Get()` computes `HMAC-SHA256(serverSecret, "nonce:expiry")` and returns `nonce:expiry:hmac`.
4. SciChart verifies the token in WASM (constant-time comparison) and caches it in a cookie.
5. The token is valid for 7 days; SciChart re-validates once every 24 hours automatically.

No challenge from client to server is required — CORS provides the domain-binding security.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Node.js 18+ (for building the client bundle)
- A SciChart license with the `"SV"` feature flag enabled

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile). Find your license's Server Secret, which is 64 hex characters. This will only be available if you have Advanced Licensing with Simple Validation enabled on your order.

2. **Set the Server Secret**
   Edit `Controllers/LicenseController.cs` and replace the `SCICHART_SERVER_SECRET` value with your Server Secret. In production, prefer loading it from configuration:

   ```csharp
   private readonly string _serverSecret =
       configuration["SciChart:ServerSecret"] ?? throw new InvalidOperationException("SciChart:ServerSecret not configured");
   ```

3. **Set the client license key**
   Edit `src/index.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string.

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

## The controller

`LicenseController.cs` is the only file that differs from a standard MVC project. It uses the standard `[ApiController]` + `[Route("api/[controller]")]` pattern, so `GET /api/license` is automatically wired up by `app.MapControllerRoute` in `Program.cs` — no extra routing configuration required.

```csharp
[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    private const string SCICHART_SERVER_SECRET = "<your 64-char hex Server Secret>";

    [HttpGet]
    public string Get()
    {
        var nonce  = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
        var expiry = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + 7 * 24 * 3600;
        var msg    = Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
        var key    = Convert.FromHexString(SCICHART_SERVER_SECRET);
        using var hmac = new HMACSHA256(key);
        var mac    = Convert.ToHexString(hmac.ComputeHash(msg)).ToLower();
        return $"{nonce}:{expiry}:{mac}";
    }
}
```

> **Key point:** hex-decode the Server Secret to binary bytes before passing to HMAC. Do not use the hex string directly as the key.

## Verification

- Open browser DevTools → Network. Look for `GET /api/license?orderid=...` returning `200`.
- In Application → Cookies, you should see `scLicense` set with a 7-day expiry.
- The console should log `Simple server license validated`.

## Differences from Advanced Server Licensing

|                       | Simple (this example)             | Advanced                              |
| --------------------- | --------------------------------- | ------------------------------------- |
| Server dependency     | None (stdlib HMAC)                | `SciChart.Server.Licensing` NuGet     |
| Challenge/response    | No (CORS provides domain binding) | Yes (NaCl asymmetric)                 |
| Token validity        | 7 days, daily re-validation       | 7 days, daily re-validation           |
| Required feature flag | `"SV"`                            | none                                  |
| Security model        | Symmetric HMAC, server-side only  | Asymmetric, challenge enforces domain |
