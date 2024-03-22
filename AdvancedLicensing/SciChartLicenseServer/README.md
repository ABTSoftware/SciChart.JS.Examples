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
3. On the My Account page, add your application name as an OEM or Embedded License App Name, then click to Show Runtime Keys and copy the client and server keys

## Integrating SciChartServerLicensing

The required code flow is as follows

On server start

1. Call SetAssemblyName, passing the name of your application which needs to match the name you set on the MyAccount page.
2. Call SetRuntimeLicenseKey passing the server key.
3. If the call to SetRuntimeLicenseKey returns 0 (ie false), there is something wrong with the server key. Call GetLicenseErrors to find out what.

On a request to /api/license

1. Extract the value of the querystring parameter 'challenge'.
2. Pass this to ValidateChallenge which returns a response string.
3. Return the response to the client as text, not json.

## Api Details

The api is exposed from the native library in a few different ways.

### Dynamic linking C api

For interop scenarios where you will be loading and calling the library dynamically, we suggest you use the methods prefixed by SciChartLicenseServer\_. These are marked extern 'C' and their signatures are as follows

```c
void SciChartLicenseServer_SetAssemblyName(char* name)
int SciChartLicenseServer_SetRuntimeLicenseKey(char* key)
char* SciChartLicenseServer_ValidateChallenge(char* challenge)
char* SciChartLicenseServer_GetLicenseErrors()
```

### Static linking header

If you are using C / C++ and can link against the library statically, you can call the underlying LicenseServer class. Its header is as follows.

```c++
namespace SciChart {
    enum class SCRTLicenseType
    {
        /// Invalid but informs the user a trial is being requested.
        LICENSE_TYPE_NO_LICENSE = 0,
        /// Trial - Valid but with trial notices
        LICENSE_TYPE_TRIAL = 0x02,
        /// Community - Watermark but no expiry
        LICENSE_TYPE_COMMUNITY = 0x03,
        /// Full - Valid
        LICENSE_TYPE_FULL = 0x20,
        /// Full expired - For Non-perpetual (web)
        LICENSE_TYPE_FULL_EXPIRED = 0x04,
        /// Trial expired - Invalid
        LICENSE_TYPE_TRIAL_EXPIRED = 0x40,
        /// Subscription expired - build is after expiry date
        LICENSE_TYPE_SUBSCRIPTION_EXPIRED = 0x80,
        /// Invalid developer license - Invalid machine specific license
        LICENSE_TYPE_INVALID_DEVELOPER_LICENSE = 0x0F,
        /// License that requires server validation
        LICENSE_TYPE_REQUIRES_VALIDATION = 0x2F,
        /// Invalid license - Invalid runtime license
        LICENSE_TYPE_INVALID_LICENSE = 0xFF
    };

    namespace LicenseServer {

        void ResetRuntimeLicense();

        bool SetAssemblyName(const std::string& _assemblyName);

        /// Sets the Runtime License ( narrow string version ).
        /// Returns true passed license key is valid; otherwise false.
        bool SetRuntimeLicenseKey(const std::string& _strKey);

        /// Gets a type of the Runtime License.
        SCRTLicenseType GetLicenseType();

        /// Determines whether the Runtime License is valid.
        bool CheckLicenseValid();

        /// Gets the OrderId of the current license
        std::string GetOrderId();

        /// Gets the reason for the license failure
        std::string GetLicenseErrors();

        /// Decode and check challenge.  Generate response with encrypted expiry
        std::string ValidateChallenge(const std::string& _challenge);

        /// Dumps the information of the Runtime License to returned string.
        std::string Dump();
    }
}
```

### C# Api

For our .net integration there is a swig generated wrapper which exposes the methods prefixed with CSHARP\_, eg CSHARP_SetAssemblyName. It is not recommended to try and call these directly.
