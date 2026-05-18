package com.example.scichart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.regex.Pattern;

@RestController
public class LicenseController {

    // Server Secret from SciChart MyAccount (64 hex characters).
    // Requires Advanced Licensing with Simple Validation v2 enabled on your order.
    // In production, load this from application properties or an environment variable.
    private static final String SCICHART_SERVER_SECRET =
            "YOUR_SERVER_SECRET_HERE";

    // Inline-mode tokens are not bound to a client nonce, so the same token can be
    // served to many clients while it's still within its licence-declared valid_time.
    // We refresh periodically; the licence (not this server) determines how long a
    // token actually remains valid on the client.
    private static final long INLINE_REFRESH_SECONDS = 30 * 60;

    // Constrain echoed client nonces — defence against header / log injection if a
    // malformed nonce ever reaches a downstream system.
    private static final Pattern CLIENT_NONCE_PATTERN = Pattern.compile("^[0-9a-fA-F]{8,64}$");

    private static final HexFormat HEX = HexFormat.of();
    private static final SecureRandom RANDOM = new SecureRandom();

    // Lazy-decoded once, then cached for the lifetime of the process.
    private static volatile byte[] secretBytes;

    // Cached inline token shared across requests — safe because inline tokens are
    // not bound to a particular client. In a multi-instance deployment, move this
    // to a distributed cache (e.g. Redis).
    private static volatile String cachedInlineToken = "";
    private static volatile long cachedInlineTokenIssuedAt = 0;

    // Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
    // The licence on the client side enforces which one it will accept.
    @GetMapping("/api/license")
    public ResponseEntity<String> get(@RequestParam(name = "nonce", required = false) String rawNonce) {
        long now = System.currentTimeMillis() / 1000;

        if (rawNonce != null && !rawNonce.isEmpty()) {
            if (!CLIENT_NONCE_PATTERN.matcher(rawNonce).matches()) {
                return ResponseEntity.badRequest().body("Error: malformed client nonce");
            }
            String serverNonce = HEX.formatHex(randomBytes(8));
            return ResponseEntity.ok(signToken("v2:" + rawNonce + ":" + serverNonce + ":" + now));
        }

        String token = cachedInlineToken;
        long issuedAt = cachedInlineTokenIssuedAt;
        if (token.isEmpty() || now - issuedAt > INLINE_REFRESH_SECONDS) {
            synchronized (LicenseController.class) {
                token = cachedInlineToken;
                issuedAt = cachedInlineTokenIssuedAt;
                if (token.isEmpty() || now - issuedAt > INLINE_REFRESH_SECONDS) {
                    String serverNonce = HEX.formatHex(randomBytes(8));
                    token = signToken("v2:" + serverNonce + ":" + now);
                    cachedInlineToken = token;
                    cachedInlineTokenIssuedAt = now;
                }
            }
        }
        return ResponseEntity.ok(token);
    }

    private static String signToken(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretBytes(), "HmacSHA256"));
            byte[] hmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            return payload + ":" + HEX.formatHex(hmac);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            // HmacSHA256 with a valid 32-byte key is guaranteed available in every JVM
            throw new IllegalStateException("HMAC-SHA256 unavailable", e);
        }
    }

    private static byte[] secretBytes() {
        byte[] local = secretBytes;
        if (local == null) {
            synchronized (LicenseController.class) {
                local = secretBytes;
                if (local == null) {
                    local = HEX.parseHex(SCICHART_SERVER_SECRET);
                    secretBytes = local;
                }
            }
        }
        return local;
    }

    private static byte[] randomBytes(int n) {
        byte[] buf = new byte[n];
        RANDOM.nextBytes(buf);
        return buf;
    }
}
