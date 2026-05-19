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

    // Constrain echoed client nonces — defence against header / log injection if a
    // malformed nonce ever reaches a downstream system.
    private static readonly Regex ClientNoncePattern = new("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

    private static string SignToken(string payload)
    {
        var mac = HMACSHA256.HashData(SecretBytes, Encoding.UTF8.GetBytes(payload));
        return $"{payload}:{Convert.ToHexString(mac).ToLower()}";
    }

    // Every request gets a fresh token. A cached inline token's serverNow timestamp
    // would eventually fall outside the licence's max_skew window — HMAC-SHA256 is
    // cheap, simpler to sign per request than to tie a cache TTL to the licence.
    //
    // Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
    // The licence on the client side enforces which one it will accept.
    [HttpGet]
    public IActionResult Get([FromQuery] string? nonce)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var rawNonce = nonce ?? string.Empty;
        var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();

        if (rawNonce.Length > 0)
        {
            if (!ClientNoncePattern.IsMatch(rawNonce))
            {
                return BadRequest("malformed client nonce");
            }
            return Content(SignToken($"v2:{rawNonce}:{serverNonce}:{now}"));
        }

        return Content(SignToken($"v2:{serverNonce}:{now}"));
    }
}
