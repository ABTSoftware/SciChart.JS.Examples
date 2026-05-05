using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace DotnetMvcSimpleServerLicensing.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LicenseController : ControllerBase
{
    // Server Secret from SciChart MyAccount (64 hex characters).
    // Requires Advanced Licensing with Simple Validation enabled on your order.
    // In production, load this from configuration rather than hardcoding it.
    private const string SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

    // Cached token shared across requests — safe because HMAC tokens are not user-specific.
    // In a multi-instance deployment, move this to a distributed cache.
    private static string? _cachedToken;
    private static long _cachedExpiry;

    [HttpGet]
    public string Get()
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        if (_cachedToken is null || _cachedExpiry - now < 2 * 24 * 3600)
        {
            var nonce  = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
            var expiry = now + 7 * 24 * 3600;
            var msg    = Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
            var key    = Convert.FromHexString(SCICHART_SERVER_SECRET);
            using var hmac = new HMACSHA256(key);
            var mac    = Convert.ToHexString(hmac.ComputeHash(msg)).ToLower();
            _cachedToken  = $"{nonce}:{expiry}:{mac}";
            _cachedExpiry = expiry;
        }
        return _cachedToken;
    }
}
