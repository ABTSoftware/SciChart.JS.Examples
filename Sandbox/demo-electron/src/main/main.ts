
import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";

let isDev = require("electron-is-dev");

let mainWindow = null;

app.allowRendererProcessReuse = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: "#222222" /* Prevents white flicker on resize https://github.com/electron/electron/issues/10801 */
  });

  // Store the license key which is fetched in Index.tsx. Update this part below to include your runtime license key
  ipcMain.on('getLicense', (event: any, arg: any) => {
    event.returnValue = "RUNTIME LICENSE KEY HERE";
  });

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true
        })
    );
  }

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
