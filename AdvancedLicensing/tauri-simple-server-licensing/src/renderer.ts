import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { invoke } from "@tauri-apps/api/core";

// Runtime license key carrying an SV:H:V:N feature flag (SimpleValidation v2).
// Replace with your own key from SciChart MyAccount.
//
// The feature string encodes the v2 parameters:
//   SV:<max_skew>:<valid_time>:<validate_nonce>
//     max_skew — H or H.MM, e.g. 0.05 (5 min), 1.30 (90 min); 0 disables the check
//     valid_time — H or H.MM, e.g. 168 (7 days), 0.30 (30 min)
//     validate_nonce   — must be 0 for this example (see note below)
//
// IMPORTANT: this Tauri integration is inline-mode only. The invoke bridge does
// not carry a SciChart-generated client nonce, so the licence must be issued
// with validate_nonce=0. Round-trip mode (validate_nonce=1) is not supported by
// this code path. The replay-defence motivation for round-trip mode is also
// weaker here — the token is minted in a trusted local process and never
// crosses an untrusted network on the way to the webview.
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");

// Instead of a network fetch to /api/license, route through Tauri's invoke bridge
// so the HMAC computation stays in Rust alongside the Server Secret.
// The Server Secret is compiled into the native binary and never reaches the webview.
// The Rust handler returns an inline v2 token: v2:<serverNonce>:<serverNow>:<hmac>
SciChartSurface.setLicenseCallback(async (): Promise<Response> => {
  const token = await invoke<string>("get_license_token");
  return new Response(token);
});

async function initChart(): Promise<void> {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const dataSeries = new XyDataSeries(wasmContext);
  for (let i = 0; i < 100; i++) {
    dataSeries.append(i, Math.sin(i * 0.1));
  }

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, { dataSeries })
  );
}

initChart();
