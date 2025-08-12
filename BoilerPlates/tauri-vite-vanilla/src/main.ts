import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  SciChartJsNavyTheme,
} from "scichart";

// You may need this to configure from where the wasm file is served
// SciChart.SciChartSurface.configure({ wasmUrl: "/other/scichart2d.wasm" });

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root",
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  const renderableSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [1, 2, 5, 8, 10],
      yValues: [3, 1, 7, 5, 8],
    }),
    stroke: "steelblue",
  });
  sciChartSurface.renderableSeries.add(renderableSeries);
}

initSciChart();
