use hmac::{Hmac, Mac};
use once_cell::sync::Lazy;
use rand::Rng;
use sha2::Sha256;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

// Server Secret from SciChart MyAccount (64 hex characters).
// Requires Advanced Licensing with Simple Validation v2 enabled on your order.
// Compiled into the native binary — not extractable from JS or DevTools.
const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

// Hex-decode the Server Secret to raw bytes once. HMAC keys are binary;
// passing the hex string directly would silently produce a different key.
static SECRET_BIN: Lazy<Vec<u8>> =
    Lazy::new(|| hex::decode(SCICHART_SERVER_SECRET).expect("SERVER_SECRET must be 64 hex chars"));

// Inline-mode tokens are not bound to a client nonce, so the same token can be
// reused while it's still within the licence-declared valid_time. We refresh
// periodically; the licence (not this code) determines how long the WASM will
// keep accepting the token on the client side.
const INLINE_REFRESH_SECONDS: u64 = 30 * 60;

struct LicenseCache {
    token: Option<String>,
    issued_at: u64,
}

fn sign(payload: &str) -> String {
    let mut mac = HmacSha256::new_from_slice(&SECRET_BIN).expect("HMAC init failed");
    mac.update(payload.as_bytes());
    format!("{payload}:{}", hex::encode(mac.finalize().into_bytes()))
}

fn rand_hex_8() -> String {
    hex::encode(rand::thread_rng().gen::<[u8; 8]>())
}

// Renderer requests a token via Tauri's invoke bridge. HMAC computation stays
// in Rust, keeping the Server Secret out of reach of the webview and DevTools.
//
// SV v2 inline-mode token format:
//   v2:<serverNonce>:<serverNow>:<hmac>
// The HMAC signs the full payload up to (but not including) the final colon.
//
// This integration is inline-mode only — Tauri's invoke bridge does not pass a
// client nonce through SciChart's dependency callback, so the corresponding
// licence must have validate_nonce=0.
#[tauri::command]
fn get_license_token(cache: tauri::State<Mutex<LicenseCache>>) -> String {
    let mut c = cache.lock().unwrap();
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    if c.token.is_none() || now.saturating_sub(c.issued_at) > INLINE_REFRESH_SECONDS {
        let server_nonce = rand_hex_8();
        c.token = Some(sign(&format!("v2:{server_nonce}:{now}")));
        c.issued_at = now;
    }
    c.token.clone().unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(LicenseCache {
            token: None,
            issued_at: 0,
        }))
        .invoke_handler(tauri::generate_handler![get_license_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
