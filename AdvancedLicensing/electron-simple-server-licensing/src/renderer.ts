import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";

// Runtime license key with SV (SimpleValidation) feature flag.
// Replace with your own key from SciChart MyAccount.
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
