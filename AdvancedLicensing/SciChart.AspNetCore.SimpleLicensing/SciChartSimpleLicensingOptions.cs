namespace SciChart.AspNetCore.SimpleLicensing;

/// <summary>
/// Configuration for SciChart Simple Server Validation v2.
/// </summary>
public sealed class SciChartSimpleLicensingOptions
{
    /// <summary>
    /// Server Secret from SciChart MyAccount (64 hex characters). Required.
    /// Hex is decoded to raw bytes for the HMAC key — do not hex-decode it yourself.
    /// </summary>
    public string ServerSecret { get; set; } = string.Empty;
}
