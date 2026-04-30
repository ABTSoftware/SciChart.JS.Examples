# Simple Server Licensing Example (Node.js)

Demonstrates SciChart's **Simple Server Validation** flow — server-side license validation using only HMAC-SHA256, with no native DLL and no FFI.

## How it works

1. The client sets a runtime license key that has the `"SV"` (SimpleValidation) feature flag.
2. On load, SciChart calls `GET /api/license?orderid=<id>` on the same origin.
3. The server computes `HMAC-SHA256(serverSecret, "nonce:expiry")` and returns `nonce:expiry:hmac`.
4. SciChart verifies the token in WASM (constant-time comparison) and caches it in a cookie.
5. The token is valid for 7 days; SciChart re-validates once every 24 hours automatically.

No challenge from client to server is required — CORS provides the domain-binding security.

## Prerequisites

- Node.js 18+
- A SciChart license with the `"SV"` feature flag enabled (contact SciChart support or use your Advanced Licensing account)

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile). Find your license's Server Secret, which is 64 hex characters. This will only be available if you have Advanced Licensing with Simple Validation enabled on your order.

2. **Set the Server Secret**
   Edit `src/server.ts` and replace the `SCICHART_SERVER_SECRET` value with your Server Secret.

3. **Set the client license key**
   Edit `src/index.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string.

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

- Open browser DevTools → Network. Look for `GET /api/license?orderid=...` returning `200`.
- In Application → Cookies, you should see `scLicense` set with a 7-day expiry.
- The console should log `Simple server license validated`.

## Server snippets for other languages

The server logic is trivial to port — all you need is HMAC-SHA256 from the standard library.

**Node.js** (this example):

```javascript
const { createHmac, randomBytes } = require("crypto");
const nonce = randomBytes(8).toString("hex");
const expiry = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
const hmac = createHmac("sha256", Buffer.from(serverSecret, "hex"))
  .update(`${nonce}:${expiry}`)
  .digest("hex");
res.send(`${nonce}:${expiry}:${hmac}`);
```

**Python** (stdlib only):

```python
import hmac, hashlib, secrets, time
nonce  = secrets.token_hex(8)
expiry = int(time.time()) + 7 * 24 * 3600
msg    = f"{nonce}:{expiry}".encode()
key    = bytes.fromhex(server_secret)
mac    = hmac.new(key, msg, hashlib.sha256).hexdigest()
return f"{nonce}:{expiry}:{mac}"
```

**C#** (stdlib only):

```csharp
var nonce  = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
var expiry = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + 7 * 24 * 3600;
var msg    = Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
var key    = Convert.FromHexString(serverSecret);
using var hmac = new HMACSHA256(key);
var mac    = Convert.ToHexString(hmac.ComputeHash(msg)).ToLower();
return $"{nonce}:{expiry}:{mac}";
```

> **Key point in all cases:** hex-decode the Server Secret to binary bytes before passing to HMAC. Do not use the hex string directly as the key.

## Differences from Advanced Server Licensing

|                       | Simple (this example)             | Advanced                              |
| --------------------- | --------------------------------- | ------------------------------------- |
| Server dependency     | None (stdlib HMAC)                | Native DLL + FFI                      |
| Challenge/response    | No (CORS provides domain binding) | Yes (NaCl asymmetric)                 |
| Token validity        | 7 days, daily re-validation       | 7 days, daily re-validation           |
| Required feature flag | `"SV"`                            | none                                  |
| Security model        | Symmetric HMAC, server-side only  | Asymmetric, challenge enforces domain |
