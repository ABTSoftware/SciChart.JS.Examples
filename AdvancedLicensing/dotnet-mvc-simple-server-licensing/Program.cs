using SciChart.AspNetCore.SimpleLicensing;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

// Server-side licence token service. Reads the Server Secret from
// appsettings.json: SciChart:ServerSecret. The <scichart-license /> tag
// helper in _Layout.cshtml resolves this service to emit a fresh signed
// meta tag into every rendered page.
builder.Services.AddSciChartSimpleLicensing(builder.Configuration.GetSection("SciChart"));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseStaticFiles(new StaticFileOptions
{
    // Required to serve .wasm and .data files
    ServeUnknownFileTypes = true
});
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Re-validation endpoint. The meta tag covers initial validation on each full
// page load; this endpoint covers re-validation when the cached scLicense
// cookie expires (after valid_time) without a page reload — e.g. SPA sessions
// that outlive the token — and is the only path used with validate_nonce=1.
app.MapSciChartLicenseEndpoint();

app.Run();
