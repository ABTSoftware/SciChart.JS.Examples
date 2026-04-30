# Simple Server Validation

Simple Server Validation is a lightweight server-side licensing approach that requires no native DLL, no FFI, and no challenge/response handshake. Your server computes an HMAC-SHA256 token and returns it to SciChart.js, which verifies it in WASM.

Requires a license key with the **`"SV"` feature flag**. Contact [support@scichart.com](mailto:support@scichart.com) to have this enabled on your order.

## How it works

```
Browser (SciChart.js)
  → GET /api/license?orderid=<X>
  ← 200 OK  body: <nonce>:<expiry>:<hmac>

SciChart WASM verifies HMAC, caches result in a cookie for 7 days.
Re-validates automatically every 24 hours.
```

1. Set your runtime license key with the `"SV"` feature flag using `SciChartSurface.setRuntimeLicenseKey(...)`.
2. SciChart calls `GET /api/license?orderid=<X>` on first load (default endpoint; override with `setServerLicenseEndpoint`).
3. Your server computes `HMAC-SHA256(serverSecret, "nonce:expiry")` and returns `nonce:expiry:hmac`.
4. SciChart verifies the token in WASM and caches it in a cookie.

No challenge parameter is sent — CORS provides the domain-binding security. The token is symmetric: only servers that hold the Server Secret can produce a valid token.

## What you need

- Your **Server Secret** — a 64-character hex string found in [SciChart MyAccount](https://www.scichart.com/profile) under your license's Advanced Licensing section. This will only be present if Simple Validation is enabled on your order.
- Your **client license key** — the full license key string passed to `setRuntimeLicenseKey`.

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

All implementations follow the same three steps:

1. Hex-decode the Server Secret to bytes.
2. Generate a random 8-byte nonce and a Unix expiry timestamp 7 days from now.
3. Return `HMAC-SHA256(key, "nonce:expiry")` as `nonce:expiry:hmac`.

Replace `YOUR_SERVER_SECRET_HERE` with your 64-char hex Server Secret in each snippet.

---

### Python (Flask)

No external dependencies — uses only the Python standard library.

```python
import hmac, hashlib, secrets, time
from flask import Flask

app = Flask(__name__)

SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE"

_cached_token  = None
_cached_expiry = 0

@app.get("/api/license")
def get_license():
    global _cached_token, _cached_expiry
    now = int(time.time())
    if _cached_token is None or _cached_expiry - now < 2 * 24 * 3600:
        nonce          = secrets.token_hex(8)
        expiry         = now + 7 * 24 * 3600
        msg            = f"{nonce}:{expiry}".encode()
        key            = bytes.fromhex(SCICHART_SERVER_SECRET)
        mac            = hmac.new(key, msg, hashlib.sha256).hexdigest()
        _cached_token  = f"{nonce}:{expiry}:{mac}"
        _cached_expiry = expiry
    return _cached_token
```

The same logic works with **FastAPI** — replace `@app.get` with FastAPI's equivalent and return a `PlainTextResponse`.

---

### Python (Django)

```python
# views.py
import hmac, hashlib, secrets, time
from django.http import HttpResponse

SCICHART_SERVER_SECRET = "YOUR_SERVER_SECRET_HERE"

def license(request):
    now    = int(time.time())
    nonce  = secrets.token_hex(8)
    expiry = now + 7 * 24 * 3600
    msg    = f"{nonce}:{expiry}".encode()
    key    = bytes.fromhex(SCICHART_SERVER_SECRET)
    mac    = hmac.new(key, msg, hashlib.sha256).hexdigest()
    return HttpResponse(f"{nonce}:{expiry}:{mac}", content_type="text/plain")

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
    "sync"
    "time"
)

const sciChartServerSecret = "YOUR_SERVER_SECRET_HERE"

var (
    mu           sync.Mutex
    cachedToken  string
    cachedExpiry int64
)

func licenseHandler(w http.ResponseWriter, r *http.Request) {
    mu.Lock()
    defer mu.Unlock()

    now := time.Now().Unix()
    if cachedToken == "" || cachedExpiry-now < 2*24*3600 {
        nonceBytes := make([]byte, 8)
        rand.Read(nonceBytes)
        nonce  := hex.EncodeToString(nonceBytes)
        expiry := now + 7*24*3600
        msg    := fmt.Sprintf("%s:%d", nonce, expiry)
        key, _ := hex.DecodeString(sciChartServerSecret)
        mac    := hmac.New(sha256.New, key)
        mac.Write([]byte(msg))
        cachedToken  = fmt.Sprintf("%s:%d:%s", nonce, expiry, hex.EncodeToString(mac.Sum(nil)))
        cachedExpiry = expiry
    }
    w.Header().Set("Content-Type", "text/plain")
    fmt.Fprint(w, cachedToken)
}

func main() {
    http.HandleFunc("/api/license", licenseHandler)
    http.ListenAndServe(":8080", nil)
}
```

For **Gin** or **Echo** frameworks, replace `http.HandleFunc` with the framework's router — the HMAC logic is identical.

---

### Ruby (Sinatra)

Uses the `openssl` gem, which is bundled with every Ruby installation.

```ruby
require 'sinatra'
require 'openssl'
require 'securerandom'

SCICHART_SERVER_SECRET = 'YOUR_SERVER_SECRET_HERE'

$cached_token  = nil
$cached_expiry = 0

get '/api/license' do
  content_type :text
  now = Time.now.to_i
  if $cached_token.nil? || $cached_expiry - now < 2 * 24 * 3600
    nonce          = SecureRandom.hex(8)
    expiry         = now + 7 * 24 * 3600
    msg            = "#{nonce}:#{expiry}"
    key            = [SCICHART_SERVER_SECRET].pack('H*')
    mac            = OpenSSL::HMAC.hexdigest('SHA256', key, msg)
    $cached_token  = "#{nonce}:#{expiry}:#{mac}"
    $cached_expiry = expiry
  end
  $cached_token
end
```

For **Rails**, add the equivalent action to an `Api::LicenseController` and route it in `config/routes.rb`.

---

### PHP

Uses `hash_hmac` and `hex2bin` from PHP's standard library — no Composer packages needed.

```php
<?php

define('SCICHART_SERVER_SECRET', 'YOUR_SERVER_SECRET_HERE');

function buildLicenseToken(): string {
    $now    = time();
    $nonce  = bin2hex(random_bytes(8));
    $expiry = $now + 7 * 24 * 3600;
    $msg    = "{$nonce}:{$expiry}";
    $key    = hex2bin(SCICHART_SERVER_SECRET);   // decode hex string to raw bytes
    $mac    = hash_hmac('sha256', $msg, $key);
    return "{$nonce}:{$expiry}:{$mac}";
}

// Route: GET /api/license
header('Content-Type: text/plain');
echo buildLicenseToken();
```

For **Laravel**, add this to a controller action and register it in `routes/api.php`:

```php
// app/Http/Controllers/LicenseController.php
public function index(): \Illuminate\Http\Response
{
    return response(buildLicenseToken(), 200, ['Content-Type' => 'text/plain']);
}

// routes/api.php
Route::get('/license', [LicenseController::class, 'index']);
// Accessible at /api/license with the default api prefix
```

---

### Rust

Uses the [`hmac`](https://crates.io/crates/hmac) and [`sha2`](https://crates.io/crates/sha2) crates from the RustCrypto family. Add to `Cargo.toml`:

```toml
[dependencies]
hmac   = "0.12"
sha2   = "0.10"
hex    = "0.4"
axum   = "0.7"   # or any web framework
rand   = "0.8"
tokio  = { version = "1", features = ["full"] }
```

```rust
use axum::{routing::get, Router};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use std::time::{SystemTime, UNIX_EPOCH};

const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

async fn license_handler() -> String {
    let now    = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    let nonce  = hex::encode(rand::random::<[u8; 8]>());
    let expiry = now + 7 * 24 * 3600;
    let msg    = format!("{nonce}:{expiry}");
    let key    = hex::decode(SCICHART_SERVER_SECRET).expect("invalid Server Secret");
    let mut mac = Hmac::<Sha256>::new_from_slice(&key).expect("HMAC init failed");
    mac.update(msg.as_bytes());
    let mac_hex = hex::encode(mac.finalize().into_bytes());
    format!("{nonce}:{expiry}:{mac_hex}")
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/api/license", get(license_handler));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```
