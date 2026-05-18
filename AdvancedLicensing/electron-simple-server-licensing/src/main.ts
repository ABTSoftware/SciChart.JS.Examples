import { app, BrowserWindow, ipcMain } from "electron";
import { createHmac, randomBytes } from "crypto";
import path from "node:path";

// Server Secret from SciChart MyAccount (64 hex characters).
// Requires Advanced Licensing with Simple Validation v2 enabled on your order.
// This value lives only in the main process — it is never exposed to renderer code.
const SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

// Hex-decode once. HMAC keys are raw bytes — do not pass the hex string.
const secretBuffer = Buffer.from(SCICHART_SERVER_SECRET, "hex");

// Inline-mode tokens are not bound to a client nonce, so the same token is
// valid until valid_time (set by the licence) has elapsed in the client's
// wall clock. Refresh periodically; the licence — not this code — enforces
// the actual validity window on the SciChart side.
const INLINE_REFRESH_SECONDS = 30 * 60;
let cachedInlineToken = "";
let cachedInlineTokenIssuedAt = 0;

// Renderer requests a token via IPC. HMAC computation stays in main, keeping the
// Server Secret out of reach of renderer code and DevTools inspection.
//
// This example is inline-only: the Electron renderer's generateSimpleToken
// dependency callback signature is (orderId) => string | null, with no client
// nonce. The companion licence must therefore use validate_nonce=0.
ipcMain.handle("get-license-token", (): string => {
  const now = Math.floor(Date.now() / 1000);
  if (
    !cachedInlineToken ||
    now - cachedInlineTokenIssuedAt > INLINE_REFRESH_SECONDS
  ) {
    const serverNonce = randomBytes(8).toString("hex");
    const payload = `v2:${serverNonce}:${now}`;
    const hmac = createHmac("sha256", secretBuffer)
      .update(payload)
      .digest("hex");
    cachedInlineToken = `${payload}:${hmac}`;
    cachedInlineTokenIssuedAt = now;
  }
  return cachedInlineToken;
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
