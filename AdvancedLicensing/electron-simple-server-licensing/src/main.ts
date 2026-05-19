import { app, BrowserWindow, ipcMain } from "electron";
import { createHmac, randomBytes } from "crypto";
import path from "node:path";

// Server Secret from SciChart MyAccount (64 hex characters).
// Requires Advanced Licensing with Simple Validation v2 enabled on your order.
// This value lives only in the main process — it is never exposed to renderer code.
const SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

// Hex-decode once. HMAC keys are raw bytes — do not pass the hex string.
const secretBuffer = Buffer.from(SCICHART_SERVER_SECRET, "hex");

// Renderer requests a token via IPC. HMAC computation stays in main, keeping the
// Server Secret out of reach of renderer code and DevTools inspection.
//
// Every request gets a fresh token. A cached inline token's serverNow timestamp
// would eventually fall outside the licence's max_skew window — HMAC-SHA256 is
// cheap, simpler to sign per request than to tie a cache TTL to the licence.
//
// This example is inline-only: the Electron renderer's generateSimpleToken
// dependency callback signature is (orderId) => string | null, with no client
// nonce. The companion licence must therefore use validate_nonce=0.
ipcMain.handle("get-license-token", (): string => {
  const now = Math.floor(Date.now() / 1000);
  const serverNonce = randomBytes(8).toString("hex");
  const payload = `v2:${serverNonce}:${now}`;
  const hmac = createHmac("sha256", secretBuffer).update(payload).digest("hex");
  return `${payload}:${hmac}`;
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
