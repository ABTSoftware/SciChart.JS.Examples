namespace SciChart.AspNetCore.SimpleLicensing;

/// <summary>
/// Generates SciChart Simple Server Validation v2 tokens.
/// </summary>
public interface ISciChartLicenseTokenService
{
    /// <summary>
    /// Returns an inline token of the form <c>v2:serverNonce:serverNow:hmac</c>.
    /// Servable to many clients and embeddable in HTML via a meta tag.
    /// </summary>
    string CreateInlineToken();

    /// <summary>
    /// Returns a round-trip token of the form <c>v2:clientNonce:serverNonce:serverNow:hmac</c>.
    /// The client nonce is echoed verbatim — caller must validate it first.
    /// </summary>
    string CreateRoundTripToken(string clientNonce);

    /// <summary>
    /// Checks whether the given string is shaped as a valid client nonce
    /// (8–64 hex characters). Use before passing untrusted input to
    /// <see cref="CreateRoundTripToken"/>.
    /// </summary>
    bool IsValidClientNonce(string clientNonce);
}
