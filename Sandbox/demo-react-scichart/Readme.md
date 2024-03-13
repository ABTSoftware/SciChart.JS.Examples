# SciChart.js React Demo

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Adding SciChart to your React Application

If you haven't already done so, add SciChart.js to your react application.
Additionally, we recommend using the official [React wrapper for SciChart](https://www.npmjs.com/package/scichart-react)

```javascript
npm install scichart scichart-react
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. The easiest way to do this is to copy the wasm files from the node_modules/scichart/\_wasm folder to your output folder.

e.g. with webpack.config.js:

```
 plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
        { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
      ],
    })
  ],
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/current/webframe.html#Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) are available to simplify getting started

## Step 3: Creating the chart

After that, you can define a config object to create a SciChartSurface like this.

```javascript
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
```

## Step 4: Create a React Component

Charts can be initialized with the SciChartReact Component using the `config` property.

```javascript
function App() {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // to use WebAssembly and Data files from CDN instead of the same origin
  // SciChartSurface.loadWasmFromCDN();

  // Note: for both licensing and WASM configurations - make sure they are set on the client side.

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
```

For alternative initialization and usage refer to the [scichart-react](https://www.npmjs.com/package/scichart-react).  
Or check out [our tutorial on how to build and test your own chart wrapper component](https://www.scichart.com/documentation/js/current/webframe.html#TutorialReusableReactComponent.html).

# Running the example

```
npm install
npm start
```

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
