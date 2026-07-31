package com.example.scichart;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(LicenseController.class);

    // Server Secret from SciChart MyAccount (64 hex characters).
    // Requires Advanced Licensing with Simple Validation v2 enabled on your order.
    // In production, load this from application properties or an environment variable.
    private static final String SCICHART_SERVER_SECRET =
            "YOUR_SERVER_SECRET_HERE";

    // Constrain echoed client nonces — defence against header / log injection if a
    // malformed nonce ever reaches a downstream system.
    private static final Pattern CLIENT_NONCE_PATTERN = Pattern.compile("^[0-9a-fA-F]{8,64}$");

    private static final HexFormat HEX = HexFormat.of();
    private static final SecureRandom RANDOM = new SecureRandom();

    // Lazy-decoded once, then cached for the lifetime of the process.
    private static volatile byte[] secretBytes;

    // Every request gets a fresh token. A cached inline token's serverNow timestamp
    // would eventually fall outside the licence's max_skew window — HMAC-SHA256 is
    // cheap, simpler to sign per request than to tie a cache TTL to the licence.
    //
    // Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
    // The licence on the client side enforces which one it will accept.
    @GetMapping("/api/license")
    public ResponseEntity<String> get(@RequestParam(name = "nonce", required = false) String rawNonce,
                                      HttpServletRequest request) {
        long now = System.currentTimeMillis() / 1000;
        String serverNonce = HEX.formatHex(randomBytes(8));

        if (rawNonce != null && !rawNonce.isEmpty()) {
            if (!CLIENT_NONCE_PATTERN.matcher(rawNonce).matches()) {
                log.warn("License token refused: malformed client nonce from {}", request.getRemoteAddr());
                return ResponseEntity.badRequest().body("Error: malformed client nonce");
            }
            // Safe to log rawNonce verbatim — CLIENT_NONCE_PATTERN has already restricted it to hex.
            log.info("License token issued (round-trip) to {}: clientNonce={} serverNonce={} serverNow={}",
                    request.getRemoteAddr(), rawNonce, serverNonce, now);
            return ResponseEntity.ok(signToken("v2:" + rawNonce + ":" + serverNonce + ":" + now));
        }

        log.info("License token issued (inline) to {}: serverNonce={} serverNow={}",
                request.getRemoteAddr(), serverNonce, now);
        return ResponseEntity.ok(signToken("v2:" + serverNonce + ":" + now));
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
