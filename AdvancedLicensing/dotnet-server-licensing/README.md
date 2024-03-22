# .Net Server Side Licensing for SciChart.JS

This project demonstrates how to use the SciChart Server Licensing package to license an application that will be deployed into an environment where the hostname will be localhost, or will not be known by the application developer. In these cases, normal SciChart host-restricted licensing will not work. Server based licenses validate against the name of the application instead. If you think you may need this form of licensing, please contact support@scichart.com.

Server side licensing requires a BUNDLE license and an agreement to maintain an active license for the lifetime of the product. See [SciChart Advanced Licensing](https://support.scichart.com/support/solutions/articles/101000516558-scichart-standard-advanced-licensing)

## Building the demo

This demo uses typescript and webpack to manage the client side. See the tsconfig.json and webpack.config.js files to see how this is set up.
The demo does not include license keys. It is really just intended as a code example. Runtime keys from the My Account page will not work with the server side component, unless your order has Advanced Liensing enabled. You will need to set the server key in Startup.cs and the client key in index.ts as described below. Then from the project folder run

npm install
npm run build
dotnet run

## How it works

SciChart.JS will call the licensing endpoint on first chart load, and once per day thereafter, to get a validation token that will allow the client side charts to display.

## How to add Scichart Server Licensing to your project

1.  Contact support@scichart.com with details about your intended deployment so we can ensure you are getting the correct licensing solution.
2.  In the [My Account Page](https://scichart.com/my-account) Licenses section, add your server entry assembly name as an OEM or Embedded License App Name. For this demo that would be DotnetServerLicensing.
3.  Click Show Runtime Keys to access your OEM or Embedded Licensing key pair.
4.  Add a nuget reference to SciChart.Server.Licensing.
5.  ### Add the License Server to your services.
    eg in Startup.cs

```c#
using SciChart.Server.Licensing;

namespace DotnetServerLicensing
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Other services

            // SciChart Licensing Server
            services.AddLicenseServer("server key here");
            // SciChart Licensing Server will send debug logs to an ILogger if available.
            services.AddLogging();
        }
```

6.  ### Create a controller to handle licensing requests.
    eg LicenseController.cs
    You can of course do this in an existing controller.

```c#
using Microsoft.AspNetCore.Mvc;
using SciChart.Server.Licensing;

namespace DotnetServerLicensing
{
    [ApiController]
    public class LicenseController : ControllerBase
    {
        private readonly ILicenseServer licenseServer;

        public LicenseController(ILicenseServer licenseServer)
        {
            this.licenseServer = licenseServer;
        }

        [Route("api/license")]
        [HttpGet]
        public string Validate()
        {
            return this.licenseServer.ValidateLicense(this.Request.QueryString);
        }
    }
}
```

7. ### Configure SciChart.js

   see /src/index.ts

   At minimum, you can just set the SciChart client key as normal

   ```js
   SciChartSurface.setRuntimeLicenseKey("client key here");
   ```

   To instead fetch the client license from the server (useful if you have the same deployment to different domains requiring different licenses)
   use fetch, then pass the test response to setRuntimeLicenseKey. Don't worry if this happenes before or after the SciChartSurface is created - charts will automatically update when the license is set.

   ```js
   fetch("/api/getclientlicense")
     .then((r) => r.text())
     .then((key) => SciChartSurface.setRuntimeLicenseKey(key));
   ```

   When using a server key, scichart needs to call back to the server to validate the client license.  
   The default endpoint is /api/license. If you just need to use a different endpoint you can change this using

   ```js
   SciChartSurface.setServerLicenseEndpoint("/custom/endpoint");
   ```

   If fetching from the server requires additional code, eg authorization headers, then you can supply your own callback like this

   ```js
   SciChartSurface.setLicenseCallback((queryString) => fetch("/custom?"+queryString, { headers: { authorization: <whatever is needed here > }));
   ```

   Make sure you include the querystring parameter in the server request. You can add additional parameters to the qerystring if need be.

## Security Considerations

The most important thing is that CORS policy should be such that the server licensing endpoint should not be callable by other applications. Since this licensing is intended for use in on-device or intranet deployments, this should not usually be an issue, but we will ask you to consider this before issuing a server key.

## Debugging

The SciChart license server sends debug messages to the Ilogger. To see these, in your appsettings do

```
"Logging": {
    "LogLevel": {
      "scichart": "^3.3.575",
```

If the client is not behaving as expected, we may ask you to enable client side license debugging. This is done in Chrome DevTools by adding a Local Storage key of LICENSE_DEBUG with value 1.

## Testing

The License Server itself is fully unit tested.
For unit testing controllers that make use of it, we suggest you mock the ILicenseService.
If you try to instantiate the real LicenseServer with your server key within a unit test, you may get an error like

```
SciChart License is not valid: License is not valid for this domain. Expected: yourappname, Actual: testhost
```

You need to add the Actual value as an OEM or Embedded License App Name and generate a key pair that includes it.

The server component is able to act as the client side as well if given the client key, but you need to reset the license state in between. A typical test looks like this

```
    [Test]
    public void ShouldGenerateValidateAndApply()
    {
        var orderId = "orderId";
        var server = new LicenseServer(serverKey, log);
        var challenge = SciChartLicenseServer.GetLicenseChallenge(); // Server can validate its own challenges
        Console.WriteLine(challenge);
        var resp = server.ValidateLicense($"?orderid={orderId}&challenge={challenge}");
        Assert.That(resp, Does.Not.StartWith("Error"));
        SciChartLicenseServer.ResetRuntimeLicense();
        SciChartLicenseServer.SetRuntimeLicenseKey(clientKey);
        var expiry = SciChartLicenseServer.ApplyLicenseResponse(resp);
        Assert.That(expiry, Is.GreaterThan(0))
    }
```
