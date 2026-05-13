import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { invoke } from "@tauri-apps/api/core";

// Runtime license key with SV (SimpleValidation) feature flag.
// Replace with your own key from SciChart MyAccount.
SciChartSurface.setRuntimeLicenseKey("YOUR_CLIENT_LICENSE_KEY_HERE");

// Instead of a network fetch to /api/license, route through Tauri's invoke bridge
// so the HMAC computation stays in Rust alongside the Server Secret.
// The Server Secret is compiled into the native binary and never reaches the webview.
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
