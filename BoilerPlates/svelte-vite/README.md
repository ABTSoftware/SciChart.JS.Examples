# SciChart.js React Demo

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Adding SciChart to your React Application with vite

If you haven't already done so, add SciChart.js to your react application.

```javascript
npm install scichart
// we strongly suggest to install scichart-react for easier integration
npm install scichart-react
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. In vite.config.js, add the following to serve the wasm files:

```javascript
// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy' // for copying wasm files

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({ // for serving wasm files
            targets: [
                {
                    src: 'node_modules/scichart/_wasm/scichart2d.data',
                    dest: '/'
                },
                {
                    src: 'node_modules/scichart/_wasm/scichart2d.wasm',
                    dest: '/'
                },
                // do the same for 3d if needed
            ]
        }),
    ],
})
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/current/webframe.html#Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) are available to simplify getting started

## Step 3: Creating the chart

After that, you can define a config object to create a SciChartSurface like this.

```javascript
import {
    EAxisType,
    EChart2DModifierType,
    ESeriesType,
} from "scichart";

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
                opacity: 0.4
            },
            xyData: { 
                xValues: [1, 2, 3, 4], 
                yValues: [1, 4, 7, 3] 
            }
        }
    ],
    modifiers: [
        { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
        { type: EChart2DModifierType.MouseWheelZoom },
        { type: EChart2DModifierType.ZoomExtents }
    ]
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
    <div>
      <h1>SciChart with React + Vite</h1>
      <SciChartReact config={chartConfig} style={{ width: 900 }} />
    </div>
  );
}
```

# Running the example

```
npm install
npm run dev
```

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)