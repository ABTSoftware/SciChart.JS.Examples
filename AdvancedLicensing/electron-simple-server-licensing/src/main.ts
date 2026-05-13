import { app, BrowserWindow, ipcMain } from "electron";
import { createHmac, randomBytes } from "crypto";
import path from "node:path";

// Server Secret from SciChart MyAccount (64 hex characters).
// Requires Advanced Licensing with Simple Validation enabled on your order.
// This value lives only in the main process — it is never exposed to renderer code.
const SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

let cachedToken = "";
let cachedExpiry = 0;

// Renderer requests a token via IPC. HMAC computation stays in main, keeping the
// Server Secret out of reach of renderer code and DevTools inspection.
ipcMain.handle("get-license-token", (): string => {
  const now = Math.floor(Date.now() / 1000);
  if (!cachedToken || cachedExpiry - now < 2 * 24 * 3600) {
    const key = Buffer.from(SCICHART_SERVER_SECRET, "hex");
    const nonce = randomBytes(8).toString("hex");
    const expiry = now + 7 * 24 * 3600;
    const hmac = createHmac("sha256", key)
      .update(`${nonce}:${expiry}`)
      .digest("hex");
    cachedToken = `${nonce}:${expiry}:${hmac}`;
    cachedExpiry = expiry;
  }
  return cachedToken;
});

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // isolates preload from renderer (default since Electron 12)
      nodeIntegration: false, // renderer has no direct Node.js access
    },
  });
  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
