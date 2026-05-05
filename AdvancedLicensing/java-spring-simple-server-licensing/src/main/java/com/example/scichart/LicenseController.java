package com.example.scichart;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@RestController
public class LicenseController {

    // Server Secret from SciChart MyAccount (64 hex characters).
    // Requires Advanced Licensing with Simple Validation enabled on your order.
    // In production, load this from application properties or an environment variable.
    private static final String SCICHART_SERVER_SECRET =
            "YOUR_SERVER_SECRET_HERE";

    // Cached token shared across requests — safe because tokens are not user-specific.
    // In a multi-instance deployment, move this to a distributed cache (e.g. Redis).
    private static String cachedToken = null;
    private static long cachedExpiry = 0;

    @GetMapping("/api/license")
    public synchronized String get() {
        long now = System.currentTimeMillis() / 1000;
        if (cachedToken == null || cachedExpiry - now < 2 * 24 * 3600) {
            cachedToken = buildToken(now);
            cachedExpiry = now + 7 * 24 * 3600;
        }
        return cachedToken;
    }

    private static String buildToken(long now) {
        try {
            var hex    = HexFormat.of();
            var nonce  = hex.formatHex(SecureRandom.getSeed(8));
            var expiry = now + 7 * 24 * 3600;
            var msg    = (nonce + ":" + expiry).getBytes(java.nio.charset.StandardCharsets.UTF_8);
            var key    = hex.parseHex(SCICHART_SERVER_SECRET);
            var mac    = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return nonce + ":" + expiry + ":" + hex.formatHex(mac.doFinal(msg));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            // HmacSHA256 with a valid 32-byte key is guaranteed available in every JVM
            throw new IllegalStateException("HMAC-SHA256 unavailable", e);
        }
    }
}
