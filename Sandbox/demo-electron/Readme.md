# SciChart.js Electron, Typescript React Boilerplate example

This example uses [electron-webpack](https://webpack.electron.build/) to simplify the process of setting up webpack with electron.  It's not required in order to use SciChart in electron. 

## To run in dev mode

> npm install  
> npm start

You will need to have the **[SciChart Licensing Wizard](https://www.scichart.com/licensing-scichart-js/)** running with a trial or activated license.

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

## Building for deployment

This example uses electron-builder, so building for Windows should just mean

> npm run dist

This will produce an exe in /dist/win-unpacked, and an installer in /dist.  Building for mac/linux may require some additional configuration.  For documentation see [electron.build](https://www.electron.build/)