# Advanced Licensing for SciChart.JS

Standard SciChart.JS licenses allow production deployment to a fixed, known hostname. If you are building an application that will be deployed by third parties to hosts you do not know or control (OEM scenarios), or that must run on localhost, you will need an Advanced Licensing solution.

Advanced Licensing requires a BUNDLE license and a commitment to maintain an active license for the lifetime of the project. See the knowledgebase article [SciChart Advanced Licensing](https://support.scichart.com/support/solutions/articles/101000516558-scichart-standard-advanced-licensing) for full details.

Before implementing, [submit a support request](https://support.scichart.com/support/tickets/new) or email [support@scichart.com](mailto:support@scichart.com) with your intended deployment details, server tech stack, and target platform — we will confirm the correct solution for your use case.

---

## Choose an approach

### [Simple Server Validation](SimpleServerSideLicensing/)

Server computes an HMAC-SHA256 token using a hex key from MyAccount. No native binaries, no FFI, no challenge/response. Requires a license with the `"SV"` feature flag.

**Use this if:** you have a web server you control, or are building an Electron or Tauri desktop app, and want the easiest possible integration.

Runnable examples: Node.js · .NET Minimal API · .NET MVC · Spring Boot · Electron · Tauri

Language snippets: Python · Django · Go · Ruby · PHP · Rust

→ **[SimpleServerSideLicensing/README.md](SimpleServerSideLicensing/)**

---

### [Native Server Licensing](NativeServerSideLicensing/)

Server signs a challenge from the client using a native DLL (NaCl asymmetric cryptography). Provides strong domain enforcement beyond CORS.

**Use this if:** you need challenge-based domain binding, or you are distributing a component to customers who run their own servers.

Runnable examples: .NET (NuGet) · Node.js (ffi-rs)

→ **[NativeServerSideLicensing/README.md](NativeServerSideLicensing/)**
