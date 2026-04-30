# Simple Server Licensing Example (Spring Boot)

Demonstrates adding SciChart's **Simple Server Validation** endpoint to a standard Spring Boot application. The entire server-side change is a single `@RestController` using only `javax.crypto.Mac` from the JDK — no extra dependencies.

## How it works

1. The client sets a runtime license key that has the `"SV"` (SimpleValidation) feature flag.
2. On load, SciChart calls `GET /api/license?orderid=<id>` on the same origin.
3. `LicenseController.get()` computes `HMAC-SHA256(serverSecret, "nonce:expiry")` and returns `nonce:expiry:hmac`.
4. SciChart verifies the token in WASM (constant-time comparison) and caches it in a cookie.
5. The token is valid for 7 days; SciChart re-validates once every 24 hours automatically.

No challenge from client to server is required — CORS provides the domain-binding security.

## Prerequisites

- Java 21+
- Maven 3.9+ (or use the Maven wrapper: `./mvnw`)
- Node.js 18+ (for building the client bundle)
- A SciChart license with the `"SV"` feature flag enabled

## Setup

1. **Get your Server Secret**
   Log in to [SciChart MyAccount](https://www.scichart.com/profile). Find your license's Server Secret, which is 64 hex characters. This will only be available if you have Advanced Licensing with Simple Validation enabled on your order.

2. **Set the Server Secret**
   Edit `src/main/java/com/example/scichart/LicenseController.java` and replace the `SCICHART_SERVER_SECRET` value. In production, prefer externalising this via `application.properties`:

   ```properties
   scichart.server-secret=<your 64-char hex Server Secret>
   ```

   Then inject it with `@Value("${scichart.server-secret}")`.

3. **Set the client license key**
   Edit `client/index.ts` and replace the key passed to `setRuntimeLicenseKey` with your full license key string.

4. **Build the client bundle**

   ```bash
   npm install
   npm run build
   ```

   This writes `bundle.js` and the SciChart WASM files into `src/main/resources/static/`, where Spring Boot serves them automatically.

5. **Run the server**
   ```bash
   ./mvnw spring-boot:run
   ```
   Open http://localhost:8080 — the chart should render without a watermark.

## The controller

`LicenseController.java` is the only file that differs from a standard Spring Boot project. Add it alongside your existing controllers — no changes to routing configuration or `application.properties` needed.

```java
@RestController
public class LicenseController {

    private static final String SCICHART_SERVER_SECRET = "<your 64-char hex Server Secret>";

    @GetMapping("/api/license")
    public synchronized String get() {
        var hex    = HexFormat.of();
        var nonce  = hex.formatHex(SecureRandom.getSeed(8));
        var expiry = System.currentTimeMillis() / 1000 + 7 * 24 * 3600;
        var msg    = (nonce + ":" + expiry).getBytes(StandardCharsets.UTF_8);
        var mac    = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(hex.parseHex(SCICHART_SERVER_SECRET), "HmacSHA256"));
        return nonce + ":" + expiry + ":" + hex.formatHex(mac.doFinal(msg));
    }
}
```

> **Key point:** `HexFormat.of().parseHex()` decodes the Server Secret to binary bytes before it is passed to HMAC. Do not use the hex string directly as the key.

## Verification

- Open browser DevTools → Network. Look for `GET /api/license?orderid=...` returning `200`.
- In Application → Cookies, you should see `scLicense` set with a 7-day expiry.
- The console should log `Simple server license validated`.

## Differences from Advanced Server Licensing

|                       | Simple (this example)             | Advanced                              |
| --------------------- | --------------------------------- | ------------------------------------- |
| Server dependency     | None (JDK `javax.crypto`)         | Native library + JNI                  |
| Challenge/response    | No (CORS provides domain binding) | Yes (NaCl asymmetric)                 |
| Token validity        | 7 days, daily re-validation       | 7 days, daily re-validation           |
| Required feature flag | `"SV"`                            | none                                  |
| Security model        | Symmetric HMAC, server-side only  | Asymmetric, challenge enforces domain |
