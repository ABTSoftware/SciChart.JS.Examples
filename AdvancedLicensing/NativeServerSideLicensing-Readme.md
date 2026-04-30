# Native Server Licensing (NaCl challenge-response)

Native Server Licensing uses asymmetric cryptography (NaCl) to bind a license to a specific domain. The client sends a challenge to the server; the server signs it using a private key held in a native DLL; the client verifies the signature using the corresponding public key embedded in the license.

This approach is appropriate when you need strong domain enforcement beyond what CORS provides — for example, if you are distributing a licensed component to customers who run their own servers.

Contact [support@scichart.com](mailto:support@scichart.com) before implementing. We will confirm the correct binary for your target platform and architecture (Windows/Linux, x86/x64/ARM).

## How it works

```
Browser (SciChart.js)
  → GET /api/license?challenge=<nonce>&orderid=<X>
  ← 200 OK  body: <signed-response>

Client verifies asymmetric signature against the public key in the license.
```

The server must call the native `SciChartLicenseServer` library for each challenge. The library handles key management and signing.

## Prebuilt integrations

- [dotnet-server-licensing](../dotnet-server-licensing/)
  Uses the [SciChart.Server.Licensing](https://www.nuget.org/packages/SciChart.Server.Licensing/) NuGet package. Covers ASP.NET Core, Blazor, and Electron.NET.

- [nodejs-server-licensing](../nodejs-server-licensing/)
  Uses `ffi-rs` to call the native library from Node.js.

## Manual integration

Native binaries for all supported platforms and the full C API are in [SciChartLicenseServer](../SciChartLicenseServer/).

For server languages not listed above, you will need to write FFI/interop code to call the native library. The API surface is small — a single function that takes a challenge string and returns a signed response.

## Comparison with Simple Server Validation

|                     | Native (this page)        | Simple Server Validation |
| ------------------- | ------------------------- | ------------------------ |
| Mechanism           | Asymmetric NaCl signing   | Symmetric HMAC-SHA256    |
| Native dependency   | Yes (DLL / SO)            | None                     |
| Domain enforcement  | Challenge enforces domain | CORS                     |
| Feature flag needed | No                        | `"SV"`                   |
| Supported platforms | Windows/Linux x86/x64/ARM | Any                      |

If your deployment does not require challenge-based domain enforcement, consider [Simple Server Validation](../SimpleServerSideLicensing/) instead — it is significantly easier to integrate.
