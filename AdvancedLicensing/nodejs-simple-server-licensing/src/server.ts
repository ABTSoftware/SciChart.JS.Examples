import express from "express";
import { createHmac, randomBytes } from "crypto";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Server Secret from SciChart MyAccount (64 hex characters — requires Advanced Licensing with Simple Validation)
const SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

let cachedToken = "";
let cachedExpiry = 0;

// Regenerate at most once per week; refresh when fewer than 2 days remain.
app.get("/api/license", (_req, res) => {
  const now = Math.floor(Date.now() / 1000);
  if (!cachedToken || cachedExpiry - now < 2 * 24 * 3600) {
    const pubkeyBuffer = Buffer.from(SCICHART_SERVER_SECRET, "hex");
    const nonce = randomBytes(8).toString("hex");
    const expiry = now + 7 * 24 * 3600;
    const hmac = createHmac("sha256", pubkeyBuffer)
      .update(`${nonce}:${expiry}`)
      .digest("hex");
    cachedToken = `${nonce}:${expiry}:${hmac}`;
    cachedExpiry = expiry;
  }
  res.send(cachedToken);
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
