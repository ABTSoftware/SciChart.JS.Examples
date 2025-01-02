# SciChart.js Svelte + Rollup Demo

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Installing SciChart

If you haven't already done so, add SciChart.js to your application.

```bash
npm install scichart
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. The easiest way to do this is to copy the wasm files from the node_modules/scichart/\_wasm folder to your public folder.

### rollup.config.js:

```javascript
export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js", // change this, so that everything is served at "public", not "build"
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // Serve WASM files from SciChart into the bundle
    // scichart2d.wasm
    {
      name: "wasm",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "scichart2d.wasm",
          source: fs.readFileSync(
            "node_modules/scichart/_wasm/scichart2d.wasm"
          ),
        });
      },
    },
    // scichart2d.data
    {
      name: "wasm",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "scichart2d.data",
          source: fs.readFileSync(
            "node_modules/scichart/_wasm/scichart2d.data"
          ),
        });
      },
    },
    // if needed, do the same for 3d .wasm/.data files
  ],
};
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/current/webframe.html#Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) are available to simplify getting started

## Step 3: Creating the chart configuration

### drawExample.js:

```javascript
import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  StackedColumnRenderableSeries,
  StackedColumnCollection,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
} from "scichart";

export const drawExample = async (divId) => {
  // Create a SciChartSurface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Data for the example
  const xValues = [1992, 1993, 1994, 1995];
  const yValues1 = [10, 13, 7, 16];
  const yValues2 = [12, 17, 21, 15];

  // Create some RenderableSeries - for each part of the stacked column
  const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues1,
      dataSeriesName: "EU",
    }),
    fill: "#2277CC",
    stackedGroupId: "StackedGroupId",
  });

  const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
      dataSeriesName: "Asia",
    }),
    fill: "#EC5F6C",
    stackedGroupId: "StackedGroupId2",
  });

  // To add the series to the chart, put them in a StackedColumnCollection
  const stackedColumnCollection = new StackedColumnCollection(wasmContext);

  // Add the series to the StackedColumnCollection
  stackedColumnCollection.add(rendSeries1, rendSeries2);

  // Add the Stacked Column collection to the chart
  sciChartSurface.renderableSeries.add(stackedColumnCollection);

  // Add zooming and panning behaviour
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

  return { sciChartSurface, wasmContext };
};
```

## Step 4: Using the chart in your Svelte app

```html
<script>
  import { onMount } from "svelte";
  import { drawExample } from "./drawExample";

  const divID = "scichart-root";
  let sciChartSurface;

  // recommended way to initialize SciChart, and delete on cleanup to avoid memory leaks
  onMount(() => {
    let chartInitializationPromise = drawExample(divID).then((res) => {
      sciChartSurface = res.sciChartSurface;
    });

    return () => {
      // Check if chart is already initialized
      if (sciChartSurface) {
        sciChartSurface.delete();
        return;
      }

      // Else postpone deletion
      chartInitializationPromise.then(() => {
        sciChartSurface.delete();
      });
    };
  });
</script>

<main>
  <h1>Hello SciChart!</h1>
  <div id="{divID}" style="width: 100%; height: 500px;"></div>
</main>
```

## Step 5: Running the app

Start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
