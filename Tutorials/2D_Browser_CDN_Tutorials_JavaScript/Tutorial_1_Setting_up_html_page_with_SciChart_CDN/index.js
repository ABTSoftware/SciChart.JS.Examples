// #region ExampleA
// Equivalent of imports when using index.min.js is to declare global variables like this
const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries } =
  SciChart;

// This code is syntactically similar to using imports which would look like this:
// import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries } from "scichart";

// Once you have done that, the API is **EXACTLY** the same as when using npm/webpack/react/vue/angular etc.

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

  // Add a series
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: [0, 1, 2, 3, 4],
        yValues: [2, 1, 4, 3, 2],
      }),
    })
  );

  // That's it! You just created your first SciChartSurface!
}

initSciChart();

// #endregion

// #region ExampleB
// Implicitly the following line of code is called when loading SciChart.js via index.min.js
SciChartSurface.useWasmFromCDN();

// This is equivalent to calling SciChartSurface.configure() with the URLs from the CDN for wasm/data files
const libraryVersion = "3.4.662";
SciChartSurface.configure({
  dataUrl: `https://cdn.jsdelivr.net/npm/scichart@3.5.720${libraryVersion}/_wasm/scichart2d.data`,
  wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@3.5.720${libraryVersion}/_wasm/scichart2d.wasm`,
});

// This code doesn't actually need to be called when using index.min.js, however
// its good to be aware that it is happening in the background.

// #endregion
