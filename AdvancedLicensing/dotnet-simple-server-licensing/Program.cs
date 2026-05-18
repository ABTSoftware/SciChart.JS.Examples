using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    // Required to serve .wasm and .data files
    ServeUnknownFileTypes = true
});

// Server Secret from SciChart MyAccount (64 hex characters — requires Advanced Licensing with Simple Validation v2)
const string SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

var secretBytes = Convert.FromHexString(SCICHART_SERVER_SECRET);

// Inline-mode tokens are not bound to a client nonce, so the same token can be
// served to many clients while it's still within its licence-declared valid_time.
// We refresh periodically; the licence (not this server) determines how long a
// token actually remains valid on the client.
const int INLINE_REFRESH_SECONDS = 30 * 60;
var inlineLock = new object();
string? cachedInlineToken = null;
long cachedInlineTokenIssuedAt = 0;

// Constrain echoed client nonces — defence against header / log injection if a
// malformed nonce ever reaches a downstream system.
var clientNoncePattern = new Regex("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

string SignToken(string payload)
{
    using var hmac = new HMACSHA256(secretBytes);
    var mac = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload))).ToLower();
    return $"{payload}:{mac}";
}

// Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
// The licence on the client side enforces which one it will accept.
app.MapGet("/api/license", (HttpContext ctx) =>
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var rawNonce = ctx.Request.Query["nonce"].ToString();

    if (!string.IsNullOrEmpty(rawNonce))
    {
        if (!clientNoncePattern.IsMatch(rawNonce))
        {
            return Results.Text("Error: malformed client nonce", "text/plain", statusCode: 400);
        }
        var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
        return Results.Text(SignToken($"v2:{rawNonce}:{serverNonce}:{now}"), "text/plain");
    }

    lock (inlineLock)
    {
        if (cachedInlineToken is null || now - cachedInlineTokenIssuedAt > INLINE_REFRESH_SECONDS)
        {
            var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
            cachedInlineToken = SignToken($"v2:{serverNonce}:{now}");
            cachedInlineTokenIssuedAt = now;
        }
        return Results.Text(cachedInlineToken, "text/plain");
    }
});

app.Run();
