# .Net Server Side Licensing for SciChart.JS

This project demonstrates how to use the SciChart Server Licensing package to license an application that will be deployed into an environment where the hostname will be localhost, or will not be known by the application developer.  In these cases, normal SciChart host-restricted licensing will not work.  Server based licenses validate against the name of the application instead, and are usually only available to site license customers.  If you think you may need this form of licensing, please contact support@scichart.com.

Server side licensing is currently available for dotnet servers.  Other platforms indcluding node.js will follow.

## Building the demo
This demo uses typescript and webpack to manage the client side.  See the tsconfig.json and webpack.config.js files to see how this is set up. 
The demo does not include license keys. It is really just intended as a code example.  If necessry you can contact support and we will issue you a short term key for this demo.  You will need to set the  server key in Startup.cs and the client key in index.ts as descibed below. Then from the project folder run

npm install
npm run webpack

Runtime keys from the SciChart Licensing Wizard will not work with the server side component.

## How it works

SciChart.JS will call the licensing endpoint on first chart load, and once per day thereafter, to get a validation token that will allow the client side charts to display. 

## How to add Scichart Server Licensing to your project

1.  Contact support@scichart.com with details about your intended deployment so we can ensure you are getting the correct licensing solution.
2.  Provide the name of the entry assembly for your application.  eg for this demo it would be DotnetServerLicensing.  We will supply you with two license keys: a server key and a client key.
3.  Add a nuget reference to SciChart.Server.Licensing.
4.  ### Add the License Server to your services.  
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

5.  ### Create a controller to handle licensing requests.  
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

6. ### Configure SciChart.js
    see /src/index.ts

    At minimum, you can just set the SciChart client key as normal
    ```js   
        SciChartSurface.setRuntimeLicenseKey("client key here");
    ```
    To instead fetch the client license from the server (useful if you have the same deployment to different domains requiring different licenses)
    use fetch, then pass the test response to setRuntimeLicenseKey. Don't worry if this happenes before or after the SciChartSurface is created - charts will automatically update when the license is set.
    ```js 
    fetch("/api/getclientlicense").then(r => r.text()).then(key => SciChartSurface.setRuntimeLicenseKey(key));
    ```
    When using a server key, scichart needs to call back to the server to validate the client license.  
    The default endpoint is /api/license.  If you just need to use a different endpoint you can change this using
    ```js 
    SciChartSurface.setServerLicenseEndpoint("/custom/endpoint")
    ```
    If fetching from the server requires additional code, eg authorization headers, then you can supply your own callback like this
    ```js
    SciChartSurface.setLicenseCallback((queryString) => fetch("/custom?"+queryString, { headers: { authorization: <whatever is needed here > }));
    ```
    Make sure you include the querystring parameter in the server request.  You can add additional parameters to the qerystring if need be.

## Security Considerations

The most important thing is that CORS policy should be such that the server licensing endpoint should not be callable by other applications.  Since this licensing is intended for use in on-device or intranet deployments, this should not usually be an issue, but we will ask you to consider this before issuing a server key.

## Debugging
The SciChart license server sends debug messages to the Ilogger.  To see these, in your appsettings do
```
"Logging": {
    "LogLevel": {
      "SciChart": "Debug",
```
If the client is not behaving as expected, we may ask you to enable client side license debugging.  This is done in Chrome DevTools by adding a Local Storage key of LICENSE_DEBUG with value 1.

## Testing
The License Server itself is fully unit tested.
For unit testing controllers that make use of it, we suggest you mock the ILicenseService.
If you try to instantiate the real LicenseServer with your server key within a unit test, you will get an error like
```
SciChart License is not valid: License is not valid for this domain. Expected: yourappname, Actual: testhost
```
If you really need to do this, contact support with the Actual value from the error and we can add it into your server key.