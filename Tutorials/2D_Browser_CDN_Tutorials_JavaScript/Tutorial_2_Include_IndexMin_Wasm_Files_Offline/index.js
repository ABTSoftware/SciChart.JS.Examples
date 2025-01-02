// #region ExampleA
// Equivalent of imports when using index.min.js is to declare global variables like this
const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries } =
  SciChart;

async function initSciChart() {
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

// #endregion

// #region Configure_SciChartjs_to_Load_Wasm

// To load files locally, we can specify the path to the wasm and data files on the local file system
// This can also be a URL or path if your files are served by a web server

// Note that SciChartSurface.configure must be called once before any SciChartSurface is instantiated

SciChartSurface.configure({
  dataUrl: `scichart/v3.4.662/scichart2d.data`,
  wasmUrl: `scichart/v3.4.662/scichart2d.wasm`,
});

// #endregion

initSciChart();
