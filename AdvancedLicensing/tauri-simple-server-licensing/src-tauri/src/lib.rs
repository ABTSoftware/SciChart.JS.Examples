use hmac::{Hmac, Mac};
use once_cell::sync::Lazy;
use rand::Rng;
use sha2::Sha256;
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
// Every request gets a fresh token. A cached inline token's serverNow timestamp
// would eventually fall outside the licence's max_skew window — HMAC-SHA256 is
// cheap, simpler to sign per request than to tie a cache TTL to the licence.
//
// This integration is inline-mode only — Tauri's invoke bridge does not pass a
// client nonce through SciChart's dependency callback, so the corresponding
// licence must have validate_nonce=0.
#[tauri::command]
fn get_license_token() -> String {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let server_nonce = rand_hex_8();
    sign(&format!("v2:{server_nonce}:{now}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_license_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
