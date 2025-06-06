# SciChart Server Licensing for Node.js

This project demonstrates how to use the SciChartLicenseServer native library to license an application that will be deployed into an environment where the hostname will be localhost, or will not be known by the application developer. In these cases, normal SciChart host-restricted licensing will not work. Server based licenses validate against the name of the application instead, and are usually only available to site license customers. If you think you may need this form of licensing, please contact support@scichart.com.

Server side licensing requires a BUNDLE license and an agreement to maintain an active license for the lifetime of the product. See [SciChart Advanced Licensing](https://support.scichart.com/support/solutions/articles/101000516558-scichart-standard-advanced-licensing)

## Building the demo

In order to run this demo you need to have advanced licensing enabled and then add an OEM/Embedded App name of scichart-nodejs-server-licensing. Then generate a runtime key and apply the client key in src/index.ts and the server key in src/server/licenseServer.ts

Then run

- `npm install`
- `npm run build`
- `npm start`

You can run the server with hot-reload using npm run dev.

## How it works

SciChart.JS will call the licensing endpoint on first chart load, and once per day thereafter, to get a validation token that will allow the client side charts to display.

## How to set up licensing and run the example

1. **Choose APP_NAME and generate licensing key pair**. In the [My Account Page](https://scichart.com/my-account) Licenses section using "Manage Hostnames" button add your **APP_NAME** as an "OEM or Embedded License App Name". For this demo that would be "scichart-nodejs-server-licensing". Then click "Show Runtime License Key" button to find **CLIENT_KEY** and **SERVER_KEY** in "OEM or Embedded Licensing key pair" section.
2. **Set up the the server**. In `src\server\licenseServer.ts` file set your **APP_NAME** and **SERVER_KEY**.
3. **Set up the the client**. In `src\index.ts` file set your **CLIENT_KEY**.
4. **Build the app** `npm run build` builds both client and server
5. **Run the app** `npm start`

As a result you will see your license validation request

![Local Image](./img/image.png)

## How to add SciChart License Server to your project

1.  Contact support@scichart.com with details about your intended deployment so we can ensure you are getting the correct licensing solution.
2.  In the [My Account Page](https://scichart.com/my-account) Licenses section, add your app name as an OEM or Embedded License App Name. For this demo that would be scichart-nodejs-server-licensing.
3.  Click Show Runtime Keys to access your OEM or Embedded Licensing key pair.
4.  Add the following npm packages
    `npm install ffi-rs bufferutil utf-8-validate`
5.  Get the native binaries.
6.  Configure webpack to build the server
    There are 3 important elements of the webpack.server.config

#### Configure these externals

```js
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    // Prevent webpack trying to build these from source
    externals: {
        express: "commonjs2 express",
        "ffi-rs": "commonjs2 ffi-rs",
    },
```

#### Copy the required native binary

```js
    const CopyPlugin = require("copy-webpack-plugin");

    plugins: [
        new CopyPlugin({
          // Copy the appropriate native binary for your platform
          // if you need multiple, copy them to subfolders and configure rules to pick the correct one in licenseServer.ts
          patterns: [
            { from: "src/runtimes/win-x64/native", to: "" },
          ]
        })
      ],
```

#### Use the output folder as the dirname root

This is so that the LicenseServer can locate the native binary properly

```js
node: {
  __dirname: false;
}
```

7.  Add the licenseServer.ts file to your server and set the app name and server key in it

```js
// The app name you set here must match one you have added on the MyAccount page before generating a key pair.
debug("app name", process.env.npm_package_name);
nativeLicenseServer.SciChartLicenseServer_SetAssemblyName([
  process.env.npm_package_name,
]);

// Set the Server key
const isValid = nativeLicenseServer.SciChartLicenseServer_SetRuntimeLicenseKey([
  "server key here",
]);
```

8.  Add the endpoint to your server
    in server.ts

```ts
import { licenseServer, closeLicenseServer } from "./licenseServer";

const app = express();

// The client expects the license validation endpoint to be at /api/license.
// If you need to use a different endpoint, tell the client by calling SciChartSurface.setServerLicenseEndpoint("/custom/endpoint")
app.use("/api/license", licenseServer);
```

9.  It is good practice to shutdown gracefully. This allows the native library to be properly closed and resources freed.

```ts
// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    closeLicenseServer();
    process.exit(0);
  });
});
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    closeLicenseServer();
    process.exit(0);
  });
});
```

10. ### Configure SciChart.js

see /src/index.ts

**Setting CLIENT_KEY**

At minimum, you can just set the SciChart client key as normal

```js
SciChartSurface.setRuntimeLicenseKey("client key here");
```

**Fetching CLIENT_KEY form a server**

To instead fetch the client license from the server (useful if you have the same deployment to different domains requiring different licenses)
use fetch, then pass the test response to setRuntimeLicenseKey. Don't worry if this happenes before or after the SciChartSurface is created - charts will automatically update when the license is set.

```js
fetch("/api/getclientlicense")
  .then((r) => r.text())
  .then((key) => SciChartSurface.setRuntimeLicenseKey(key));
```

**Changing license validation endpoint**

When using a server key, scichart needs to call back to the server to validate the client license.  
 The default endpoint is /api/license. If you just need to use a different endpoint you can change this using

```js
SciChartSurface.setServerLicenseEndpoint("/custom/endpoint");
```

**Changing license validation hostname, domain or port**

```js
SciChartSurface.setLicenseCallback((queryString) =>
  fetch(`http://localhost:3000/api/license?${queryString}`)
);
```

**Adding additional authorization headers**

If fetching from the server requires additional code, eg authorization headers, then you can supply your own callback like this

```js
SciChartSurface.setLicenseCallback((queryString) => fetch("/custom?"+queryString, { headers: { authorization: <whatever is needed here > }));
```

Make sure you include the querystring parameter in the server request. You can add additional parameters to the qerystring if need be.

## Security Considerations

The most important thing is that CORS policy should be such that the server licensing endpoint should not be callable by other applications. Since this licensing is intended for use in on-device or intranet deployments, this should not usually be an issue, but we will ask you to consider this before issuing a server key.

## Debugging

The example licenseServer.ts has some basic console logging that is enabled in development mode. Replace this with your own logging if need be.
If the client is not behaving as expected, we may ask you to enable client side license debugging. This is done in Chrome DevTools by adding a Local Storage key of LICENSE_DEBUG with value 1.
