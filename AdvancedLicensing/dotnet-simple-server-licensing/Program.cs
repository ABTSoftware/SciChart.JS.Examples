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

// Constrain echoed client nonces — defence against header / log injection if a
// malformed nonce ever reaches a downstream system.
var clientNoncePattern = new Regex("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

string SignToken(string payload)
{
    using var hmac = new HMACSHA256(secretBytes);
    var mac = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload))).ToLower();
    return $"{payload}:{mac}";
}

// Every request gets a fresh token. A cached inline token's serverNow timestamp
// would eventually fall outside the licence's max_skew window — HMAC-SHA256 is
// cheap, simpler to sign per request than to tie a cache TTL to the licence.
//
// Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
// The licence on the client side enforces which one it will accept.
app.MapGet("/api/license", (HttpContext ctx) =>
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var rawNonce = ctx.Request.Query["nonce"].ToString();
    var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();

    if (!string.IsNullOrEmpty(rawNonce))
    {
        if (!clientNoncePattern.IsMatch(rawNonce))
        {
            return Results.Text("Error: malformed client nonce", "text/plain", statusCode: 400);
        }
        return Results.Text(SignToken($"v2:{rawNonce}:{serverNonce}:{now}"), "text/plain");
    }

    return Results.Text(SignToken($"v2:{serverNonce}:{now}"), "text/plain");
});

app.Run();
