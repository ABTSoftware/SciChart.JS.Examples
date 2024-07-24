import React from "react";
import { SciChartReact } from "scichart-react";
import {
  SweepAnimation,
  SciChartJsNavyTheme,
  NumberRange,
  EAxisType,
  EChart2DModifierType,
  ESeriesType,
  EPointMarkerType,
} from "scichart";

const chartConfig = {
  surface: {
    theme: new SciChartJsNavyTheme(),
    title: "SciChart.js First Chart",
    titleStyle: { fontSize: 22 },
  },
  // Create an XAxis and YAxis with growBy padding
  xAxes: [
    {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "X Axis",
        growBy: new NumberRange(0.1, 0.1),
      },
    },
  ],
  yAxes: [
    {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis",
        growBy: new NumberRange(0.1, 0.1),
      },
    },
  ],
  // Create a line series with some initial data
  series: [
    {
      type: ESeriesType.LineSeries,
      xyData: {
        xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        yValues: [
          0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173,
          0.7833,
        ],
      },
      options: {
        stroke: "steelblue",
        strokeThickness: 3,
        pointMarker: {
          type: EPointMarkerType.Ellipse,
          options: {
            width: 11,
            height: 11,
            fill: "#fff",
          },
        },
        animation: new SweepAnimation({
          duration: 300,
          fadeEffect: true,
        }),
      },
    },
  ],
  // Add some interaction modifiers to show zooming and panning
  modifiers: [
    { type: EChart2DModifierType.MouseWheelZoom },
    {
      type: EChart2DModifierType.ZoomPan,
      options: { enableZoom: true },
    },
    { type: EChart2DModifierType.ZoomExtents },
  ],
};

function App() {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // to use WebAssembly and Data files from CDN instead of the same origin
  // SciChartSurface.loadWasmFromCDN();

  // Note: for both licensing and WASM load configurations - make sure that they are set on the client side.

  return (
    <div className="App">
      <header className="App-header">
        <h1>SciChart.js with React hello world!</h1>
        <p>
          In this example we setup webpack, react and use scichart +
          scichart-react to create a simple chart with one X and Y axis
        </p>
      </header>
      <SciChartReact config={chartConfig} style={{ maxWidth: 900 }} />
    </div>
  );
}

export default App;
