using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace blazor_simple_server_licensing.Service
{
    /// <summary>
    /// Signs SciChart "Simple Validation v2" license tokens (HMAC-SHA256) server-side.
    /// Mirrors the reference Node.js endpoint: the Server Secret never leaves the server.
    /// </summary>
    public sealed partial class LicenseTokenService
    {
        // Constrain echoed client nonces — defence against header / log injection if a
        // malformed nonce ever reaches a downstream system.
        [GeneratedRegex("^[0-9a-fA-F]{8,64}$")]
        private static partial Regex ClientNoncePattern();

        private readonly byte[] _secret;

        public LicenseTokenService(IConfiguration configuration)
        {
            // Server Secret from SciChart MyAccount (64 hex characters — requires
            // Advanced Licensing with Simple Validation v2).
            var serverSecret = configuration["SciChart:ServerSecret"] ?? "SCICHART_SERVER_SECRET";
            _secret = Convert.FromHexString(serverSecret);
        }

        public static bool IsValidClientNonce(string nonce) => ClientNoncePattern().IsMatch(nonce);

        /// <summary>
        /// Builds a fresh signed token. Mode is selected by the request: a non-empty
        /// <paramref name="clientNonce"/> produces a round-trip token, otherwise an inline token.
        /// The license on the client side enforces which one it will accept.
        /// </summary>
        public string CreateToken(string? clientNonce, long serverNow, string serverNonce)
        {
            var payload = string.IsNullOrEmpty(clientNonce)
                ? $"v2:{serverNonce}:{serverNow}"
                : $"v2:{clientNonce}:{serverNonce}:{serverNow}";

            var hmac = Convert.ToHexString(
                HMACSHA256.HashData(_secret, Encoding.UTF8.GetBytes(payload))).ToLowerInvariant();

            return $"{payload}:{hmac}";
        }
    }
}
