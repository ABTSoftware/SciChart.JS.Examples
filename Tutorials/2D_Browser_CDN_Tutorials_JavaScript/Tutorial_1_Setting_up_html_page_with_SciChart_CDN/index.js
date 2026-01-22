// Equivalent of imports when using index.min.js is to declare global variables like this
const {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartDefaults,
} = SciChart;

async function initSciChart() {
  // Example of how to disable SIMD
  // SciChartDefaults.useWasmSimd = 'Never';
  // SciChartSurface.configure({
  //   wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@5.0.0-alpha.135/_wasm/scichart2d.wasm`,
  //   wasmNoSimdUrl: `https://cdn.jsdelivr.net/npm/scichart@5.0.0-alpha.135/_wasm/scichart2d-nosimd.wasm`
  // });
  // Create the SciChartSurface in the div 'scichart-root'
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Add a series
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: [0, 1, 2, 3, 4],
        yValues: [2, 1, 4, 3, 2],
      }),
    })
  );
}

initSciChart();
