import express from "express";
import { createHmac, randomBytes } from "crypto";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// Server Secret from SciChart MyAccount (64 hex characters — requires Advanced Licensing with Simple Validation v2)
const SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE";

const secretBuffer = Buffer.from(SCICHART_SERVER_SECRET, "hex");

// Inline-mode tokens are not bound to a client nonce, so the same token can be
// served to many clients while it's still within its licence-declared valid_time.
// We refresh periodically; the licence (not this server) determines how long a
// token actually remains valid on the client.
const INLINE_REFRESH_SECONDS = 30 * 60;
let cachedInlineToken = "";
let cachedInlineTokenIssuedAt = 0;

// Constrain echoed client nonces — defence against header / log injection if a
// malformed nonce ever reaches a downstream system.
const CLIENT_NONCE_PATTERN = /^[0-9a-fA-F]{8,64}$/;

const signToken = (payload: string): string => {
  const hmac = createHmac("sha256", secretBuffer).update(payload).digest("hex");
  return `${payload}:${hmac}`;
};

// Mode is selected by the request: ?nonce=<value> → round-trip; otherwise inline.
// The licence on the client side enforces which one it will accept.
app.get("/api/license", (req, res) => {
  const now = Math.floor(Date.now() / 1000);
  const rawNonce = typeof req.query.nonce === "string" ? req.query.nonce : "";

  if (rawNonce) {
    if (!CLIENT_NONCE_PATTERN.test(rawNonce)) {
      res.status(400).send("Error: malformed client nonce");
      return;
    }
    const serverNonce = randomBytes(8).toString("hex");
    res.send(signToken(`v2:${rawNonce}:${serverNonce}:${now}`));
    return;
  }

  if (
    !cachedInlineToken ||
    now - cachedInlineTokenIssuedAt > INLINE_REFRESH_SECONDS
  ) {
    const serverNonce = randomBytes(8).toString("hex");
    cachedInlineToken = signToken(`v2:${serverNonce}:${now}`);
    cachedInlineTokenIssuedAt = now;
  }
  res.send(cachedInlineToken);
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
