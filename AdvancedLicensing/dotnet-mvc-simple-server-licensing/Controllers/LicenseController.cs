using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace DotnetMvcSimpleServerLicensing.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    // Server Secret from SciChart MyAccount (64 hex characters — requires Advanced Licensing with Simple Validation v2).
    // In production, load this from configuration rather than hardcoding it.
    private const string SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

    // Hex-decode the Server Secret to bytes once. HMAC keys are raw bytes, not hex strings.
    private static readonly byte[] SecretBytes = Convert.FromHexString(SCICHART_SERVER_SECRET);

    // Inline-mode tokens are not bound to a client nonce, so the same token can be
    // served to many clients while it's still within its licence-declared valid_time.
    // We refresh periodically; the licence (not this server) determines how long a
    // token actually remains valid on the client.
    private const int InlineRefreshSeconds = 30 * 60;

    // Constrain echoed client nonces — defence against header / log injection if a
    // malformed nonce ever reaches a downstream system.
    private static readonly Regex ClientNoncePattern = new("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

    // Inline-token cache. Lock guards both fields together.
    private static readonly object CacheLock = new();
    private static string? _cachedInlineToken;
    private static long _cachedInlineTokenIssuedAt;

    private static string SignToken(string payload)
    {
        var mac = HMACSHA256.HashData(SecretBytes, Encoding.UTF8.GetBytes(payload));
        return $"{payload}:{Convert.ToHexString(mac).ToLower()}";
    }

    // Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
    // The licence on the client side enforces which one it will accept.
    [HttpGet]
    public IActionResult Get([FromQuery] string? nonce)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var rawNonce = nonce ?? string.Empty;

        if (rawNonce.Length > 0)
        {
            if (!ClientNoncePattern.IsMatch(rawNonce))
            {
                return BadRequest("malformed client nonce");
            }
            var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
            return Content(SignToken($"v2:{rawNonce}:{serverNonce}:{now}"));
        }

        lock (CacheLock)
        {
            if (_cachedInlineToken is null || now - _cachedInlineTokenIssuedAt > InlineRefreshSeconds)
            {
                var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
                _cachedInlineToken = SignToken($"v2:{serverNonce}:{now}");
                _cachedInlineTokenIssuedAt = now;
            }
            return Content(_cachedInlineToken);
        }
    }
}
