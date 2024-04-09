import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

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
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  const dataSeries = new XyDataSeries(wasmContext, {
    xValues: [1, 2, 5, 8, 10],
    yValues: [3, 1, 7, 5, 8],
  });
  const renderableSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries,
    stroke: "steelblue",
  });
  sciChartSurface.renderableSeries.add(renderableSeries);
}

initSciChart();
