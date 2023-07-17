# SciChart.js Vue Sample

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).


## Step 1: Adding SciChart to your React Application

If you haven't already done so, add SciChart.js to your react application
```javascript
npm install scichart 
```

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. The easiest way to do this is to copy the wasm files from the node_modules/scichart/_wasm folder to your output folder.

Vue.js requires *.data file to be in the /public output folder, and *.wasm files to be in the /public/js folder. This is done using the `copy-files-to-from` npm package:

```
 // copy-files-to-from.json
 {
  "copyFilesSettings": {
    "whenFileExists": "overwrite"
  },
  "copyFiles": [
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.data",
      "to": "./public/scichart2d.data"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.wasm",
      "to": "./public/js/scichart2d.wasm"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart3d.data",
      "to": "./public/scichart3d.data"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart3d.wasm",
      "to": "./public/js/scichart3d.wasm"
    }
  ]
}

 // package.json
 {
  // ...
  "scripts": {
    "copyWasm": "copy-files-from-to --config copy-files-from-to.json",
    "dev": "npm run copyWasm && vue-cli-service serve",
    "build": "npm run copyWasm && vue-cli-service build",
    // ... 
  },
  // ... 
  "devDependencies": {
    "copy-files-from-to": "^3.2.1",
  }
```

## Step 3: Creating the chart

Next, create a function to initialize a SciChartSurface like this:

```javascript
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJsNavyTheme,
  NumberRange
} from "scichart";

async function initSciChart() {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // Initialize SciChartSurface. Don't forget to await!
  const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root", {
    theme: new SciChartJsNavyTheme(),
    title: "SciChart.js First Chart",
    titleStyle: { fontSize: 22 }
  });

  // Create an XAxis and YAxis with growBy padding
  const growBy = new NumberRange(0.1, 0.1);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis", growBy }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis", growBy }));

  // Create a line series with some initial data
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "steelblue",
    strokeThickness: 3,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [0,1,2,3,4,5,6,7,8,9],
      yValues: [0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173, 0.7833]
    }),
    pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#fff" }),
    animation: new SweepAnimation({ duration: 300, fadeEffect: true })
  }));

  return sciChartSurface;
}
```

## Step 4: Create a Vue Component

Charts can be initialized in a Vue Component and placed in a `<div>` element. Make sure to delete the chart on component unmount.

```javascript
export default defineComponent({
  // Best practise in Vue.js is to ensure that sciChartSurface is deleted on component unmount.
  // Here's one way to do this
  data() {
    return {
      chartInitializationPromise: undefined,
    };
  },
  mounted() {
    console.log("SciChart2d.vue onMounted");
    this.chartInitializationPromise = initSciChart();
  },
  beforeUnmount() {
    console.log("SciChart2d.vue beforeUnmount");
    this.chartInitializationPromise.then((sciChartSurface) => {
      console.log("..deleting sciChartSurface");
      sciChartSurface.delete();
    });
  },
  name: "scichart2d",
  props: {
    msg: String
  }
});
```

## Using this Project 
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
npm start
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

* [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
* [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
* [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
* [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
