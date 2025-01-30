// #region ExampleB
import {
  SciChartSurface,
  SciChartJsNavyTheme,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  WaveAnimation,
  SweepAnimation,
} from "scichart";

// Called to initialize the chart. rootElement is passed in which is the <div> that will host the char
// Create the SciChartSurface, add axis, series, data, annotations etc.
// return { sciChartSurface } to <SciChartReact /> to be used in onInit, onDelete
const initChart = async (rootElement) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      id: "New SciChart Chart",
      theme: new SciChartJsNavyTheme(),
      title: "SciChart-React with initChart",
      titleStyle: { fontSize: 16, color: "White " },
    }
  );
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "X Axis" })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "Y Axis" })
  );

  // Add some series and data
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        yValues: [
          0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173,
          0.7833,
        ],
      }),
      stroke: "SteelBlue",
      pointMarker: new EllipsePointMarker(wasmContext, {
        fill: "LightSteelBlue",
        stroke: "White",
        size: 9,
      }),
      animation: new SweepAnimation({ duration: 750 }),
    })
  );

  // Add some interactivity modifiers
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ enableZoom: true }),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier()
  );

  return { sciChartSurface };
};

const onInit = (initResult) => {
  // You can get the sciChartSurface, wasmContext here to perform any initialization
  const sciChartSurface = initResult.sciChartSurface;
  const wasmContext = sciChartSurface.webAssemblyContext2D;

  console.log(
    `SciChartSurface has been initialized: id=${sciChartSurface.id}, divElementId=${sciChartSurface.domChartRoot.id}`
  );
};

const onDelete = (initResult) => {
  // You can get the sciChartSurface, wasmContext here to perform any cleanup
  const sciChartSurface = initResult.sciChartSurface;
  const wasmContext = sciChartSurface.webAssemblyContext2D;

  console.log(
    `SciChartSurface with id=${sciChartSurface.id} is deleted = ${sciChartSurface.isDeleted}`
  );
};
// #endregion ExampleB

// #region ExampleA
import React from "react";
import { SciChartReact } from "scichart-react";

function App() {
  // SciChart.js will work out of the box with a community license.

  // For commercial licenses (to remove the watermark), set your license code here
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // to use WebAssembly and Data files from CDN instead of the same origin
  // SciChartSurface.loadWasmFromCDN();

  return (
    <div className="App">
      <header className="App-header">
        <h1>&lt;SciChartReact/&gt; with initChart Tutorial</h1>
      </header>
      <SciChartReact
        initChart={initChart}
        onInit={onInit}
        onDelete={onDelete}
        innerContainerProps={{ style: { width: "100%" } }}
        style={{ maxWidth: 900, height: 600 }}
      />
    </div>
  );
}

export default App;
// #endregion ExampleA
