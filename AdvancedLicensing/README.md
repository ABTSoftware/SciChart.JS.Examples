# Advanced Licensing for SciChart.JS

Standard SciChart.JS licenses allow production deployment to a fixed, known hostname. If you are building an application that will be deployed by third parties to hosts you do not know or control (OEM scenarios), or that must run on localhost, you will need an Advanced Licensing solution.

Advanced Licensing requires a BUNDLE license and a commitment to maintain an active license for the lifetime of the project. See the knowledgebase article [SciChart Advanced Licensing](https://support.scichart.com/support/solutions/articles/101000516558-scichart-standard-advanced-licensing) for full details.

Before implementing, [submit a support request](https://support.scichart.com/support/tickets/new) or email [support@scichart.com](mailto:support@scichart.com) with your intended deployment details, server tech stack, and target platform — we will confirm the correct solution for your use case.

---

## Simple Server Validation

From v6 this is the only server-side licensing approach. Your server computes an HMAC-SHA256 token using a hex key from MyAccount — no native binaries, no FFI, no asymmetric challenge/response. Two modes (inline, or round-trip with a client nonce) are selected per-licence. Requires a license with the `SV:H:V:N` feature flag.

**Use this if:** you have a web server you control, or are building an Electron or Tauri desktop app.

→ **[SimpleServerSideLicensing-Readme.md](SimpleServerSideLicensing-Readme.md)**

### Runnable examples

| Example | Stack |
| --- | --- |
| [nodejs-simple-server-licensing](nodejs-simple-server-licensing/) | Node.js + Express |
| [dotnet-simple-server-licensing](dotnet-simple-server-licensing/) | .NET Minimal API |
| [dotnet-mvc-simple-server-licensing](dotnet-mvc-simple-server-licensing/) | .NET MVC |
| [blazor-simple-server-licensing](blazor-simple-server-licensing/) | Blazor |
| [java-spring-simple-server-licensing](java-spring-simple-server-licensing/) | Spring Boot |
| [electron-simple-server-licensing](electron-simple-server-licensing/) | Electron |
| [tauri-simple-server-licensing](tauri-simple-server-licensing/) | Tauri |

### Reusable package

[SciChart.AspNetCore.SimpleLicensing](SciChart.AspNetCore.SimpleLicensing/) — ASP.NET Core integration for Simple Server Validation v2.

Language snippets for other stacks (Python · Django · Go · Ruby · PHP · Rust) are in [SimpleServerSideLicensing-Readme.md](SimpleServerSideLicensing-Readme.md).
