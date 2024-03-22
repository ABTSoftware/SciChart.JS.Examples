# Advanced Licensing For SciChart.JS

Standard SciChart.JS licenses allow for production deployment to a fixed host name, which is not localhost. If you are building an application that will be deployed by third parties to hosts you do not know or control (ie OEM scenarios) or if you are building an embedded system that has to run on localhost, then you will need one of our Advanced Licensing solutions.

Advanced licensing requires a BUNDLE license and a commitment to maintain an active license for the lifetime of the project. For full details please see the knowlegebase article [SciChart Advanced Licensing](https://support.scichart.com/support/solutions/articles/101000516558-scichart-standard-advanced-licensing).

Once the necessary license type and agreement is in place, Advanced Licensing will be enabled for your license. This adds new functionality to the Licenses section of the [My Account](https://scichart.com/my-account) page which will enable you to generate the key pairs needed.

Before trying to implement any of these solutions we recommend [submitting a support request](https://support.scichart.com/support/tickets/new) or emailing [support@scichart.com](mailto:support@scichart.com) with details of your intended deployment, including the host requirement, the client and server tech stack and the target platform and architecture (eg windows/linux, x86/x64/arm/arm64), and we will make sure you get the correct solution.

## Prebuilt Solutions

- [dotnet-server-licensing](/AdvancedLicensing/dotnet-server-licensing/)
  If your server uses .net then you can make use of our [SciChart.Server.Licensing](https://www.nuget.org/packages/SciChart.Server.Licensing/) nuget package. This includes blazor applications and electron.net
- [nodejs-server-licensing](/AdvancedLicensing/nodejs-server-licensing/)
  How to use ffi-napi to call the native server licensing component from node.js

## Manual Integration

For other server languages you will need to write interop code to call our native library. Native binaries and full api details are in [SciChartLicenseServer](/AdvancedLicensing/SciChartLicenseServer/)
