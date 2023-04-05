# SciChart.js Electron, Typescript, Webpack Boilerplate example

This example was generated using [Electron Forge](https://www.electronjs.org/blog/forge-v6-release#what-is-electron-forge) from TS + webpack boilerplate
## Running the example

> npm install
> npm start

You will need to have the **[SciChart Licensing Wizard](https://www.scichart.com/licensing-scichart-js/)** running with a trial or activated license.

__NOTE you may need to configure the security policy in dev mode to allow connection with the Licensing Wizard
```javascript
devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'"
```

## Runtime Licensing for Electron

SciChart runtime licenses normally match the hostname, but for electron apps in runtime, there is no hostname (because the content for the mainWindow is loaded from a file, not a server).  Licenses for electon should use the app name, or appId instead.  You can add this to your license on the website [www.scichart.com/profile](https://www.scichart.com/profile)

The Scichart license key must be set in the renderer, but it is preferable not to store it there.  We suggest using ipc to fetch it from the main process.

In index.tsx (renderer)
```javascript
import { ipcRenderer } from 'electron';

SciChartSurface.setRuntimeLicenseKey(ipcRenderer.sendSync("getLicense"));
```

In main.ts
```javascript
import { ipcMain } from "electron";

ipcMain.on('getLicense', (event: any, arg: any) => {
    event.returnValue = "RUNTIME LICENSE KEY HERE";
});
```
