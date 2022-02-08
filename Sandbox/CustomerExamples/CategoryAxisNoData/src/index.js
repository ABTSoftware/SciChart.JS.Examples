import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";

// You may need this to configure from where wasm and data files are served
// SciChart.SciChartSurface.configure({ dataUrl: "/custom/scichart2d.data" wasmUrl: "/other/scichart2d.wasm" });

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new CategoryAxis(wasmContext, {
    defaultXStart: 1643673600, // Unix timestamp for 1st Feb 2022 00:00 UTC
    defaultXStep: 3600, // Unix time for 1 hour per category
  });
  const yAxis = new NumericAxis(wasmContext);
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Add some interaction
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

initSciChart();
