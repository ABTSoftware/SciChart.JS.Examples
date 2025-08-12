# SciChart.js in Tauri + JavaScript + Vite Demo

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Adding SciChart to your JavaScript Application with vite

If you haven't already done so, add SciChart.js to your JavaScript application.

```javascript
npm install scichart

npm install vite-plugin-static-copy // needed for copying wasm files
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. In `vite.config.js`, add the following to serve the wasm files:

```javascript
// vite.config.js

import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/scichart/_wasm/scichart2d.wasm",
          dest: "",
        },
        // same for 3d if needed:
        {
          src: "node_modules/scichart/_wasm/scichart3d.wasm",
          dest: "",
        },
      ],
      watch: {},
    }),
  ],

  // ... other options
}));
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/current/webframe.html#Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) are available to simplify getting started

## Step 3: Creating the chart

After that, you can define a config object to create a SciChartSurface like this.

```javascript
import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  SciChartJsNavyTheme,
} from "scichart";

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
```

## Step 4: Add the HTML element to draw the chart on

```html
<main class="container">
  <h1>Hello SciChart.js world!</h1>
  <!-- the Div where the SciChartSurface will reside -->
  <div id="scichart-root" style="width: 90%; height: 70%"></div>
</main>
```

# Running the example

```bash
npm run tauri dev
```

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
