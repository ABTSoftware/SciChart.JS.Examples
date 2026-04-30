use hmac::{Hmac, Mac};
use rand::Rng;
use sha2::Sha256;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

// Server Secret from SciChart MyAccount (64 hex characters).
// Requires Advanced Licensing with Simple Validation enabled on your order.
// Compiled into the native binary — not extractable from JS or DevTools.
const SCICHART_SERVER_SECRET: &str = "YOUR_SERVER_SECRET_HERE";

struct LicenseCache {
    token: Option<String>,
    expiry: u64,
}

// Renderer requests a token via Tauri's invoke bridge. HMAC computation stays in
// Rust, keeping the Server Secret out of reach of the webview and DevTools.
#[tauri::command]
fn get_license_token(cache: tauri::State<Mutex<LicenseCache>>) -> String {
    let mut c = cache.lock().unwrap();
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    if c.token.is_none() || c.expiry.saturating_sub(now) < 2 * 24 * 3600 {
        let key = hex::decode(SCICHART_SERVER_SECRET).expect("SERVER_SECRET must be 64 hex chars");
        let nonce = hex::encode(rand::thread_rng().gen::<[u8; 8]>());
        let expiry = now + 7 * 24 * 3600;
        let msg = format!("{}:{}", nonce, expiry);
        let mut mac = HmacSha256::new_from_slice(&key).expect("valid key length");
        mac.update(msg.as_bytes());
        let mac_hex = hex::encode(mac.finalize().into_bytes());
        c.token = Some(format!("{}:{}:{}", nonce, expiry, mac_hex));
        c.expiry = expiry;
    }
    c.token.clone().unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(LicenseCache {
            token: None,
            expiry: 0,
        }))
        .invoke_handler(tauri::generate_handler![get_license_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
