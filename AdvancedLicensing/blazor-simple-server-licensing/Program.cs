using System.Security.Cryptography;
using blazor_simple_server_licensing.Components;
using blazor_simple_server_licensing.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<LicenseTokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

// Every request gets a fresh token. A cached token's serverNow timestamp would
// eventually fall outside the licence's max_skew window — HMAC-SHA256 is cheap,
// simpler to sign per request than to tie a cache TTL to the licence.
//
// Mode is selected by the request: ?nonce=<value> -> round-trip; otherwise inline.
// The licence on the client side enforces which one it will accept.
app.MapGet("/api/license", (HttpRequest request, LicenseTokenService licenseTokens) =>
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var rawNonce = request.Query["nonce"].ToString();
    var serverNonce = Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLowerInvariant();

    if (!string.IsNullOrEmpty(rawNonce))
    {
        if (!LicenseTokenService.IsValidClientNonce(rawNonce))
        {
            return Results.Text("Error: malformed client nonce", statusCode: StatusCodes.Status400BadRequest);
        }
        return Results.Text(licenseTokens.CreateToken(rawNonce, now, serverNonce));
    }

    return Results.Text(licenseTokens.CreateToken(null, now, serverNonce));
});

app.Run();
