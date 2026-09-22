# SciChart.js React + Vite Demo

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Adding SciChart to your React Application with vite

If you haven't already done so, add SciChart.js to your react application.

```javascript
npm install scichart
// we also strongly suggest to install scichart-react for easier integration
npm install scichart-react
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. In vite.config.js, add the following to serve the wasm files:

```javascript
// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy"; // for copying wasm files

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      // for serving wasm files
      targets: [
        {
          // the folder holds the 2D, 3D, nosimd and 64-bit builds, and the
          // runtime picks whichever the browser can run
          src: "node_modules/scichart/_wasm/*",
          dest: "",
          // flatten, so the files land next to index.html
          rename: { stripBase: true },
        },
      ],
    }),
  ],
});
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/v5/2d-charts/surface/deploying-wasm/) are available to simplify getting started

## Step 3: Creating the chart

After that, you can define a config object to create a SciChartSurface like this.

```javascript
import { EAxisType, EChart2DModifierType, ESeriesType } from "scichart";

export const chartConfig = {
  xAxes: [{ type: EAxisType.NumericAxis }],
  yAxes: [{ type: EAxisType.NumericAxis }],
  series: [
    {
      type: ESeriesType.SplineMountainSeries,
      options: {
        fill: "#3ca832",
        stroke: "#eb911c",
        strokeThickness: 4,
        opacity: 0.4,
      },
      xyData: {
        xValues: [1, 2, 3, 4],
        yValues: [1, 4, 7, 3],
      },
    },
  ],
  modifiers: [
    { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
    { type: EChart2DModifierType.MouseWheelZoom },
    { type: EChart2DModifierType.ZoomExtents },
  ],
};
```

## Step 4: Create a React Component

There are two components, and which one you want depends on how you defined the chart. A
function that builds the surface goes to `SciChartReact` via `initChart`; a Builder API config
goes to `SciChartDeclarative` via `config`. (Before `scichart-react@2` both props lived on
`SciChartReact` — passing `config` to it now throws.)

**Give the component an explicit height.** Neither component sizes itself: the root is
`position: relative` with your `style` on top and the inner chart div is `height: 100%`, so
`style={{ width: 900 }}` alone collapses to zero height inside an auto-height parent and no chart
appears.

```jsx
import { SciChartReact } from "scichart-react";

function App() {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // to use WebAssembly files from CDN instead of the same origin
  // SciChartSurface.loadWasmFromCDN();

  // Note: for both licensing and WASM configurations - make sure they are set on the client side.

  return (
    <div>
      <h1>SciChart with React + Vite</h1>
      <SciChartReact
        initChart={drawExample}
        style={{ width: 900, height: 600 }}
      />
    </div>
  );
}
```

To use the `chartConfig` from Step 3 instead, swap the component:

```jsx
import { SciChartDeclarative } from "scichart-react";

<SciChartDeclarative
  config={chartConfig}
  style={{ width: 900, height: 600 }}
/>;
```

# Running the example

```
npm run dev
```

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [SciChart.js Documentation](https://www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
