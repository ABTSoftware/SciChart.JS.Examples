# SciChart Native Server Licensing Component

This is the native library used for server side licensing in Advanced licensing solutions.  
The zip file here contains binaries for

- Windows x86
- Windows x64
- Linux x86
- Linux x64
- Linux arm
- Linux arm64

## How Server side Licensing Works

Server side licensing uses a client key and a server key. The first time a chart is created on the client, a validation challenge is generated using the client key and this is sent to the server (by default to /api/license?orderid={orderId}&challenge={challenge}). The server needs to pass the challenge to the SciChart native library which has had the server key set, and return the response to the client. The result is that the application can be deployed to any domain, including localhost. Note that the communication is only between the client and its originating server. It does not require outside internet access. The validation result is stored in a cookie on the client, so this validation only needs to occur once per week per client.

## Before you start

1. Read [SciChart Advanced Licensing](https://support.scichart.com/support/solutions/articles/101000516558-scichart-standard-advanced-licensing) and ensure you have complied with the contractual requirements. At minimum this means having a BUNDLE license and commititing to maintain at least 1 active license for the lifetime of your project.
2. Contact [sales@scichart.com](mailto:sales@scichart.com) to sign the necessary agreement. Once the necessary license type and agreement is in place, Advanced Licensing will be enabled for your license. This adds new functionality to the Licenses section of the [My Account Page](https://scichart.com/my-account) page which will enable you to generate the key pairs needed.
3. On the My Account page, add your application name as an OEM or Embedded License App Name, then click to Show runtime keys and copy the client and server keys

## Integrating SciChartServerLicensing

The required code flow is as follows

On server start

1. Call SetAssemblyName, passing the name of your application which needs to match the name you set on the MyAccount page.
2. Call SetRuntimeLicenseKey passing the server license key generated from the MyAccount, on

The first step is to call .
Secondly, call SetRuntimeLicenseKey passing the server license key that I'll send you once I have your application name.
The license information is stored statically within the native component, so depending on how your server works, you should only need to do these calls once at startup.
Then, you need to expose an endpoint on your server which the client will call to validate its license. This will be called with a querystring parameter called "challenge". Pass that value to ValidateChallenge and return the result to the client as text (not json). By default the client expects the endpoint to be /api/license but you can change this on the client by doing SciChartSurface.setServerLicenseEndpoint("/custom/endpoint").
Finally, on the client, call SciChartSurface.setRuntimeLicenseKey as normal, using the client part of the license key.

void SciChartLicenseServer_SetAssemblyName(char* name)
int SciChartLicenseServer_SetRuntimeLicenseKey(char* key)
char* SciChartLicenseServer_ValidateChallenge(char* challenge)
char\* SciChartLicenseServer_Dump()
