using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;

namespace SciChart.AspNetCore.SimpleLicensing;

internal sealed class SciChartLicenseTokenService : ISciChartLicenseTokenService
{
    private static readonly Regex ClientNoncePattern =
        new("^[0-9a-fA-F]{8,64}$", RegexOptions.Compiled);

    private readonly byte[] _secretBytes;

    public SciChartLicenseTokenService(IOptions<SciChartSimpleLicensingOptions> options)
    {
        var secret = options.Value.ServerSecret;
        if (string.IsNullOrWhiteSpace(secret))
        {
            throw new InvalidOperationException(
                "SciChartSimpleLicensingOptions.ServerSecret is not set. " +
                "Configure it from SciChart MyAccount — a 64-character hex string.");
        }
        try
        {
            _secretBytes = Convert.FromHexString(secret);
        }
        catch (FormatException ex)
        {
            throw new InvalidOperationException(
                "SciChartSimpleLicensingOptions.ServerSecret must be a hex string.", ex);
        }
    }

    public string CreateInlineToken()
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var serverNonce = NewServerNonce();
        return Sign($"v2:{serverNonce}:{now}");
    }

    public string CreateRoundTripToken(string clientNonce)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var serverNonce = NewServerNonce();
        return Sign($"v2:{clientNonce}:{serverNonce}:{now}");
    }

    public bool IsValidClientNonce(string clientNonce) =>
        !string.IsNullOrEmpty(clientNonce) && ClientNoncePattern.IsMatch(clientNonce);

    private static string NewServerNonce() =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLowerInvariant();

    private string Sign(string payload)
    {
        var mac = HMACSHA256.HashData(_secretBytes, Encoding.UTF8.GetBytes(payload));
        return $"{payload}:{Convert.ToHexString(mac).ToLowerInvariant()}";
    }
}
