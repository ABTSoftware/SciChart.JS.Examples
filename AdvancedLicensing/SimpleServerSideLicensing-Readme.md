# Simple Server Validation v2

Simple Server Validation is a lightweight server-side licensing approach that requires no native DLL, no FFI, and no challenge/response handshake using asymmetric crypto. Your server computes an HMAC-SHA256 token and returns it to SciChart.js, which verifies it in WASM.

Requires a license key with the **`SV:H:V:N` feature flag**. Contact [support@scichart.com](mailto:support@scichart.com) to have this enabled on your order.

## Two delivery shapes

A v2 token can take one of two shapes on the wire:

- **Inline** (4 fields) — `v2:serverNonce:serverNow:hmac`. Independent of any client state; servable to many clients and embeddable in HTML via a `<meta>` tag. Should still be signed per request — the embedded `serverNow` ages relative to the client's clock and will fall outside `max_skew` once the token is older than the licence's tolerance, so caching past that point causes valid clients to reject otherwise-correct tokens.
- **Round-trip** (5 fields) — `v2:clientNonce:serverNonce:serverNow:hmac`. The client generates a random nonce in WASM and sends it as `?nonce=<hex>`; the server echoes it into the signed token. A captured response is bound to the requesting client and cannot be replayed on another origin.

For most deployments the two shapes are **interchangeable under a single licence**: your server can serve an inline token in HTML for first paint _and_ a round-trip token for subsequent re-validation; the SciChart client accepts whichever arrives. This is the common case.

The exception is deployments that cannot keep server and client clocks in reasonable alignment. Inline delivery becomes risky there — a cached or long-lived token can drift outside the skew envelope before it's verified, whereas a round-trip token is signed against the request that produced it and never has time to go stale. Such deployments should be locked to round-trip only.

The fourth field of the `SV:H:V:N` feature flag captures this:

- `validate_nonce=0` (permissive default) — the licence accepts either shape. Mix delivery channels freely.
- `validate_nonce=1` (restricted) — round-trip only; inline delivery is disabled.

The server is permissive about which shape to emit: if the request carries `?nonce=<hex>`, sign a round-trip token; otherwise sign an inline token. The licence on the client side decides what it'll accept.

## How it works

```
Browser (SciChart.js)
  → GET /api/license?orderid=<X>[&nonce=<hex>]    (nonce only in round-trip mode)
  ← 200 OK  body: v2:[clientNonce:]serverNonce:serverNow:hmac

SciChart WASM verifies HMAC, checks clock skew against the licence's
max_skew, enforces server-time monotonicity across re-validations,
and caches the result in a cookie until valid_time has elapsed.
```

1. Set your runtime license key with the `SV:H:V:N` feature flag using `SciChartSurface.setRuntimeLicenseKey(...)`.
2. SciChart calls `GET /api/license?orderid=<X>` on first load. In round-trip mode it also appends `&nonce=<hex>` where the nonce was generated inside the SciChart WASM module.
3. Your server computes `HMAC-SHA256(serverSecret, payload)` and returns the signed token in the appropriate format.
4. SciChart verifies the token in WASM, checks the parameters declared by the licence, and caches the validated result in a cookie.

## Feature-flag parameters

The SV feature string is `SV:<max_skew>:<valid_time>:<validate_nonce>`:

| Parameter        | Format        | Range          | Meaning                                                                                                                                                                                                                                                             |
| ---------------- | ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_skew`       | `H` or `H.MM` | 0 to 8760.00   | Accepted absolute difference between server time and client wall clock at token acceptance, written as hours-dot-minutes (`MM` is a literal minute count, 00–59, not a fractional hour). `0` disables the skew check entirely (escape hatch for clockless devices). |
| `valid_time`     | `H` or `H.MM` | 0.01 to 168.00 | Duration the token remains valid in the client's wall clock after acceptance, same `H.MM` format. Shorter values bound the replay window.                                                                                                                           |
| `validate_nonce` | `0` or `1`    | —              | `0` — permissive: licence accepts either inline or round-trip tokens. `1` — restricted to round-trip only.                                                                                                                                                          |

The `H.MM` format is two integer parses split on a dot: `0.05` is 5 minutes, `1.30` is 1 hour 30 minutes, `168` is 168 hours, `168.00` is also 168 hours. Bare `H` (no dot) is equivalent to `H.00`.

Example licences:

- `SV:1:168:0` — 1-hour skew tolerance, 7-day validity, permissive. Default web deployment.
- `SV:24:24:1` — loose clocks, 24-hour validity, restricted to round-trip.
- `SV:0:0.05:1` — no skew check at all, 5-minute validity, restricted to round-trip — for environments with unreliable clocks where the short window and client-nonce binding carry the security weight.
- `SV:0.30:1.30:0` — 30-minute skew tolerance, 90-minute validity, permissive.

## What you need

- Your **Server Secret** — a 64-character hex string found in [SciChart MyAccount](https://www.scichart.com/profile) under your license's Advanced Licensing section. Only present if Simple Validation is enabled on your order.
- Your **client license key** — the full license key string passed to `setRuntimeLicenseKey`. Must carry an `SV:H:V:N` feature.

> **Important:** always hex-decode the Server Secret to raw bytes before passing it to HMAC. Do not use the hex string directly as the HMAC key.

## Runnable examples

| Example                                                                        | Stack                      | Notes                                                                                        |
| ------------------------------------------------------------------------------ | -------------------------- | -------------------------------------------------------------------------------------------- |
| [nodejs-simple-server-licensing](../nodejs-simple-server-licensing/)           | Node.js + Express          | Uses built-in `crypto` module                                                                |
| [dotnet-simple-server-licensing](../dotnet-simple-server-licensing/)           | ASP.NET Core 8 Minimal API | Single `Program.cs`, no NuGet packages                                                       |
| [dotnet-mvc-simple-server-licensing](../dotnet-mvc-simple-server-licensing/)   | ASP.NET Core 10 MVC        | `LicenseController` alongside existing controllers                                           |
| [java-spring-simple-server-licensing](../java-spring-simple-server-licensing/) | Spring Boot 3 + Maven      | `@RestController` using `javax.crypto.Mac`                                                   |
| [electron-simple-server-licensing](../electron-simple-server-licensing/)       | Electron                   | Token generated in main process via IPC                                                      |
| [tauri-simple-server-licensing](../tauri-simple-server-licensing/)             | Tauri (Rust)               | Token generated in Rust backend via invoke bridge; Server Secret compiled into native binary |

---

## Server snippets for other languages

All implementations follow the same pattern:

1. Hex-decode the Server Secret to bytes.
2. If the request carries `?nonce=<hex>`, validate it (`^[0-9a-fA-F]{8,64}$`) and emit a round-trip token.
3. Otherwise emit an inline token. Sign per request — caching is not recommended because the embedded `serverNow` falls outside `max_skew` once the cache age exceeds the licence's tolerance.
4. Sign with `HMAC-SHA256(secret, payload)` where the payload is the token text up to (but not including) the final colon and HMAC.

Replace `YOUR_SERVER_SECRET_HERE` with your 64-char hex Server Secret in each snippet.

---

### Python (Flask)

No external dependencies beyond Flask — uses only the Python standard library for crypto.

```python
import hmac, hashlib, re, secrets, time
from flask import Flask, request, abort

app = Flask(__name__)

SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE"
SECRET_BIN = bytes.fromhex(SCICHART_SERVER_SECRET)
NONCE_RE   = re.compile(r"^[0-9a-fA-F]{8,64}$")

def sign(payload: str) -> str:
    mac = hmac.new(SECRET_BIN, payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{mac}"

@app.get("/api/license")
def get_license():
    now          = int(time.time())
    server_nonce = secrets.token_hex(8)
    client_nonce = request.args.get("nonce", "")
    if client_nonce:
        if not NONCE_RE.match(client_nonce):
            abort(400, "malformed client nonce")
        return sign(f"v2:{client_nonce}:{server_nonce}:{now}")
    return sign(f"v2:{server_nonce}:{now}")
```

Same logic works with **FastAPI** — return a `PlainTextResponse` and read the query param via `Query`.

---

### Python (Django)

```python
# views.py
import hmac, hashlib, re, secrets, time
from django.http import HttpResponse, HttpResponseBadRequest

SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE"
SECRET_BIN = bytes.fromhex(SCICHART_SERVER_SECRET)
NONCE_RE   = re.compile(r"^[0-9a-fA-F]{8,64}$")

def sign(payload: str) -> str:
    mac = hmac.new(SECRET_BIN, payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{mac}"

def license(request):
    now = int(time.time())
    client_nonce = request.GET.get("nonce", "")
    if client_nonce:
        if not NONCE_RE.match(client_nonce):
            return HttpResponseBadRequest("malformed client nonce")
        server_nonce = secrets.token_hex(8)
        return HttpResponse(sign(f"v2:{client_nonce}:{server_nonce}:{now}"),
                            content_type="text/plain")
    server_nonce = secrets.token_hex(8)
    return HttpResponse(sign(f"v2:{server_nonce}:{now}"), content_type="text/plain")

# urls.py
# path("api/license", views.license),
```

---

### Go

No external dependencies — uses only the standard library.

```go
package main

import (
    "crypto/hmac"
    "crypto/rand"
    "crypto/sha256"
    "encoding/hex"
    "fmt"
    "net/http"
    "regexp"
    "time"
)

const sciChartServerSecret = "YOUR_SERVER_SECRET_HERE"

var (
    secretBin []byte
    nonceRe   = regexp.MustCompile(`^[0-9a-fA-F]{8,64}$`)
)

func init() {
    var err error
    secretBin, err = hex.DecodeString(sciChartServerSecret)
    if err != nil {
        panic("invalid Server Secret hex")
    }
}

func sign(payload string) string {
    h := hmac.New(sha256.New, secretBin)
    h.Write([]byte(payload))
    return payload + ":" + hex.EncodeToString(h.Sum(nil))
}

func randHex(n int) string {
    b := make([]byte, n)
    rand.Read(b)
    return hex.EncodeToString(b)
}

func licenseHandler(w http.ResponseWriter, r *http.Request) {
    now         := time.Now().Unix()
    serverNonce := randHex(8)
    clientNonce := r.URL.Query().Get("nonce")
    w.Header().Set("Content-Type", "text/plain")

    if clientNonce != "" {
        if !nonceRe.MatchString(clientNonce) {
            http.Error(w, "malformed client nonce", http.StatusBadRequest)
            return
        }
        fmt.Fprint(w, sign(fmt.Sprintf("v2:%s:%s:%d", clientNonce, serverNonce, now)))
        return
    }

    fmt.Fprint(w, sign(fmt.Sprintf("v2:%s:%d", serverNonce, now)))
}

func main() {
    http.HandleFunc("/api/license", licenseHandler)
    http.ListenAndServe(":8080", nil)
}
```

For **Gin** or **Echo**, replace `http.HandleFunc` with the framework's router — the signing logic is identical.

---

### Ruby (Sinatra)

Uses the `openssl` gem, bundled with every Ruby installation.

```ruby
require 'sinatra'
require 'openssl'
require 'securerandom'

SCICHART_SERVER_SECRET = 'YOUR_SERVER_SECRET_HERE'
SECRET_BIN             = [SCICHART_SERVER_SECRET].pack('H*')
NONCE_RE               = /\A[0-9a-fA-F]{8,64}\z/

def sign(payload)
  mac = OpenSSL::HMAC.hexdigest('SHA256', SECRET_BIN, payload)
  "#{payload}:#{mac}"
end

get '/api/license' do
  content_type :text
  now           = Time.now.to_i
  client_nonce  = params['nonce'].to_s
  server_nonce  = SecureRandom.hex(8)

  unless client_nonce.empty?
    halt 400, 'malformed client nonce' unless NONCE_RE.match?(client_nonce)
    return sign("v2:#{client_nonce}:#{server_nonce}:#{now}")
  end

  sign("v2:#{server_nonce}:#{now}")
end
```

For **Rails**, port the action into an `Api::LicenseController` and route it in `config/routes.rb`.

---

### PHP

Uses `hash_hmac`, `hex2bin`, and `random_bytes` from PHP's standard library — no Composer packages needed.

```php
<?php

const SCICHART_SERVER_SECRET = 'YOUR_SERVER_SECRET_HERE';
const NONCE_PATTERN          = '/^[0-9a-fA-F]{8,64}$/';

function signLicenseToken(string $payload): string {
    static $secretBin = null;
    if ($secretBin === null) {
        $secretBin = hex2bin(SCICHART_SERVER_SECRET);
    }
    $mac = hash_hmac('sha256', $payload, $secretBin);
    return "{$payload}:{$mac}";
}

// Route: GET /api/license
header('Content-Type: text/plain');
$now          = time();
$clientNonce  = $_GET['nonce'] ?? '';
$serverNonce  = bin2hex(random_bytes(8));

if ($clientNonce !== '') {
    if (!preg_match(NONCE_PATTERN, $clientNonce)) {
        http_response_code(400);
        echo 'Error: malformed client nonce';
        exit;
    }
    echo signLicenseToken("v2:{$clientNonce}:{$serverNonce}:{$now}");
    exit;
}

echo signLicenseToken("v2:{$serverNonce}:{$now}");
```

For **Laravel**, lift the logic into a controller action and register it in `routes/api.php`.

---

### Rust (Axum)

Uses the [`hmac`](https://crates.io/crates/hmac) and [`sha2`](https://crates.io/crates/sha2) crates from the RustCrypto family. Add to `Cargo.toml`:

```toml
[dependencies]
hmac      = "0.12"
sha2      = "0.10"
hex       = "0.4"
axum      = "0.7"
rand      = "0.8"
regex     = "1"
tokio     = { version = "1", features = ["full"] }
serde     = { version = "1", features = ["derive"] }
once_cell = "1"
```

```rust
use axum::{extract::Query, http::StatusCode, routing::get, Router};
use hmac::{Hmac, Mac};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::Deserialize;
use sha2::Sha256;
use std::time::{SystemTime, UNIX_EPOCH};

const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

static SECRET_BIN: Lazy<Vec<u8>> =
    Lazy::new(|| hex::decode(SCICHART_SERVER_SECRET).expect("invalid Server Secret hex"));
static NONCE_RE: Lazy<Regex> = Lazy::new(|| Regex::new(r"^[0-9a-fA-F]{8,64}$").unwrap());

fn sign(payload: &str) -> String {
    let mut mac = Hmac::<Sha256>::new_from_slice(&SECRET_BIN).expect("HMAC init failed");
    mac.update(payload.as_bytes());
    format!("{payload}:{}", hex::encode(mac.finalize().into_bytes()))
}

fn rand_hex(n: usize) -> String {
    let mut buf = vec![0u8; n];
    rand::Rng::fill(&mut rand::thread_rng(), &mut buf[..]);
    hex::encode(buf)
}

#[derive(Deserialize)]
struct Q { nonce: Option<String> }

async fn license_handler(Query(q): Query<Q>) -> Result<String, (StatusCode, &'static str)> {
    let now          = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    let server_nonce = rand_hex(8);
    if let Some(client_nonce) = q.nonce.filter(|n| !n.is_empty()) {
        if !NONCE_RE.is_match(&client_nonce) {
            return Err((StatusCode::BAD_REQUEST, "malformed client nonce"));
        }
        return Ok(sign(&format!("v2:{client_nonce}:{server_nonce}:{now}")));
    }
    Ok(sign(&format!("v2:{server_nonce}:{now}")))
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/api/license", get(license_handler));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## Token format quick reference

Inline (4 fields):

```
v2:<serverNonce>:<serverNow>:<hmac>
```

Round-trip (5 fields):

```
v2:<clientNonce>:<serverNonce>:<serverNow>:<hmac>
```

HMAC input is the full payload before the final `:` (i.e. `v2:...:<serverNow>`).
