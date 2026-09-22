# SciChart.js in Tauri + React + Vite Demo

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Adding SciChart to your React Application with vite

If you haven't already done so, add SciChart.js to your react application.

```bash
npm install scichart

# needed for copying the wasm files into the build output
npm install -D vite-plugin-static-copy
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. In `vite.config.js`, add the following to serve the wasm files:

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
        },
      ],
    }),
  ],
});
```

> Note: other methods to [Deploying Wasm with your app](https://www.scichart.com/documentation/js/v5/2d-charts/surface/deploying-wasm/) are available to simplify getting started

## Step 3: Creating the chart

This boilerplate builds the chart programmatically — no `scichart-react` wrapper — so it is just a
function that takes the root element:

```tsx
import {
  SciChartSurface,
  XyDataSeries,
  NumericAxis,
  NumberRange,
  SplineMountainRenderableSeries,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
} from "scichart";

SciChartSurface.UseCommunityLicense();

async function drawExample(rootElement: string | HTMLDivElement) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement
  );

  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "X Axis",
      growBy: new NumberRange(0.1, 0.1),
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Y Axis",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  sciChartSurface.renderableSeries.add(
    new SplineMountainRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4],
        yValues: [1, 4, 7, 3],
      }),
      fill: "#3ca832",
      stroke: "#eb911c",
      strokeThickness: 4,
      opacity: 0.4,
    })
  );

  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier()
  );

  return { sciChartSurface, wasmContext };
}
```

## Step 4: Create a React Component

Mount it on a div ref and delete the surface on unmount. Give the div a **resolved height** —
SciChart cannot size itself into a zero-height container:

```tsx
function App() {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // to use WebAssembly files from CDN instead of the same origin
  // SciChartSurface.loadWasmFromCDN();

  // Note: for both licensing and WASM configurations - make sure they are set on the client side.

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartPromise = drawExample(chartRef.current!);
    return () => {
      chartPromise.then(({ sciChartSurface }) => sciChartSurface.delete());
    };
  }, []);

  return (
    <div>
      <h1>SciChart with Tauri + React + Vite</h1>
      <div ref={chartRef} style={{ width: "90%", height: "60vh" }} />
    </div>
  );
}
```

> If you prefer the `scichart-react` wrapper, install `scichart-react@^2` and render
> `<SciChartReact initChart={drawExample} style={{ width: 900, height: 600 }} />`. Use
> `<SciChartDeclarative config={...} />` for the Builder API config style — as of v6 those are two
> separate components.

# Running the example

```bash
npm run tauri dev
```

That builds the Rust side and opens the desktop window. To iterate on just the web layer in a
browser, `npm run dev` serves it on [localhost:1420](http://localhost:1420).

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [SciChart.js Documentation](https://www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
