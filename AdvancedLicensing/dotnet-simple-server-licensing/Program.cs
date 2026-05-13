using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    // Required to serve .wasm and .data files
    ServeUnknownFileTypes = true
});

// Server Secret from SciChart MyAccount (64 hex characters — requires Advanced Licensing with Simple Validation)
const string SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

string? cachedToken = null;
long cachedExpiry = 0;

// Regenerate at most once per week; refresh when fewer than 2 days remain.
app.MapGet("/api/license", () =>
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    if (cachedToken is null || cachedExpiry - now < 2 * 24 * 3600)
    {
        var nonce  = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLower();
        var expiry = now + 7 * 24 * 3600;
        var msg    = Encoding.UTF8.GetBytes($"{nonce}:{expiry}");
        var key    = Convert.FromHexString(SCICHART_SERVER_SECRET);
        using var hmac = new HMACSHA256(key);
        var mac    = Convert.ToHexString(hmac.ComputeHash(msg)).ToLower();
        cachedToken  = $"{nonce}:{expiry}:{mac}";
        cachedExpiry = expiry;
    }
    return cachedToken;
});

app.Run();
