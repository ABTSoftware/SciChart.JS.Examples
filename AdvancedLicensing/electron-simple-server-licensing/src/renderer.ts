import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";

// Runtime license key carrying an SV:H:V:N feature flag (SimpleValidation v2).
// Replace with your own key from SciChart MyAccount.
//
// The feature string encodes the v2 parameters:
//   SV:<max_skew>:<valid_time>:<validate_nonce>
//     max_skew — H or H.MM, e.g. 0.05 (5 min), 1.30 (90 min); 0 disables the check
//     valid_time — H or H.MM, e.g. 168 (7 days), 0.30 (30 min)
//     validate_nonce  — must be 0 for this Electron example
//
// Electron-bridge integrations are inline-mode only. The IPC dependency
// callback signature is (orderId) => string | null with no client nonce, so
// the licence must have validate_nonce=0. Round-trip mode is unavailable on
// this path; for the threat model see the README.
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");

// Instead of a network fetch to /api/license, route through IPC so the HMAC
// computation stays in the main process alongside the Server Secret.
SciChartSurface.setLicenseCallback(async (): Promise<Response> => {
  const token = await window.electronAPI.getLicenseToken();
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
