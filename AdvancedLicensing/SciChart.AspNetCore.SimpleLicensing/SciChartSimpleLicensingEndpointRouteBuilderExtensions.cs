using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace SciChart.AspNetCore.SimpleLicensing;

public static class SciChartSimpleLicensingEndpointRouteBuilderExtensions
{
    /// <summary>
    /// Maps <c>GET {pattern}</c> (default <c>/api/license</c>) to serve SciChart v2 license tokens.
    /// Returns the inline shape by default; if the request carries <c>?nonce=&lt;hex&gt;</c>, returns
    /// the round-trip shape with the client nonce echoed and signed.
    /// </summary>
    /// <remarks>
    /// Call this alongside the <c>&lt;scichart-license /&gt;</c> tag helper. The tag helper covers
    /// initial validation on each full page load; this endpoint covers re-validation when the
    /// cached <c>scLicense</c> cookie expires (after <c>valid_time</c>) without a page reload —
    /// e.g. long-running SPA sessions — and is also the only path used when the licence has
    /// <c>validate_nonce=1</c>.
    /// </remarks>
    public static RouteHandlerBuilder MapSciChartLicenseEndpoint(
        this IEndpointRouteBuilder endpoints,
        string pattern = "/api/license")
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        return endpoints.MapGet(pattern, (ISciChartLicenseTokenService svc, HttpContext ctx) =>
        {
            var rawNonce = ctx.Request.Query["nonce"].ToString();
            if (!string.IsNullOrEmpty(rawNonce))
            {
                if (!svc.IsValidClientNonce(rawNonce))
                {
                    return Results.Text("Error: malformed client nonce", "text/plain", statusCode: 400);
                }
                return Results.Text(svc.CreateRoundTripToken(rawNonce), "text/plain");
            }
            return Results.Text(svc.CreateInlineToken(), "text/plain");
        });
    }
}
