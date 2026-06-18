# Blazor Simple Server Licensing Example

Demonstrates SciChart's **Simple Server Validation v2** flow — server-side license validation using only HMAC-SHA256, with no native DLL and no FFI.

## Prerequisites

- .Net 8+
- A SciChart license with the `SV:H:V:N` feature flag, where:

  - `max_skew` — accepted client/server clock skew as `H` or `H.MM` (e.g. `0.05` = 5 min, `1` = 1 h, `1.30` = 90 min). `0` disables the check.
  - `valid_time` — token validity in the client's wall clock, same `H.MM` format (e.g. `168` = 7 days, `0.30` = 30 min)
  - `validate_nonce` — `0` accepts either shape (permissive default); `1` restricts to round-trip only (inline delivery disabled)

Contact [support@scichart.com](mailto:support@scichart.com) to have an SV v2 feature added to your license.

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/my-account/) and open **Orders & Keys → Manage Licenses → Runtime License Key**. Copy the **Server Secret** (a 64-char hex string) from the _Server Secret_ section. Only present if your license carries the Simple Server Validation (`SV`) feature.

2. **Set the Server Secret**
   Edit `appsettings.json` and replace `SCICHART_SERVER_SECRET` with your Server Secret.

3. **Set the client runtime license key**
   Edit `Components/Pages/Home.razor.cs` and replace `YOUR_RUNTIME_LICENSE_KEY` with your full runtime license key string. The key must carry an `SV:H:V:N` feature.

4. **Run the project**

   ```bash
   dotnet run
   ```

   Open the app in the browser — the chart should render without a watermark.

## Verification

- Open browser DevTools → Network. Look for `GET /api/license?orderid=...` returning `200`. When the licence has `validate_nonce=1` the URL also has `&nonce=<hex>`.
- In Application → Cookies, you should see `scLicense` set with a future expiry.
- The console should log `Simple server license validated`. In order to see this message set Local Storage `LICENSE_DEBUG` to `1`.
