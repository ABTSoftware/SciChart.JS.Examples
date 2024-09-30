# SciChart.js Angular Demo

## Step 1: Adding SciChart to your Angular Application

If you haven't already done so, add SciChart.js to your Angular application.
Additionally, we recommend using the official [Angular wrapper for SciChart](https://www.npmjs.com/package/scichart-angular)

```Angular
npm install scichart scichart-angular
```

## Step 2: Wasm file deployment

Loading the required WASM dependencies:

SciChart.js requires additional WASM modules to function properly: scichart2d.wasm and scichart2d.data for instantiating SciChartSurface, and scichart3d.wasm and scichart3d.data for SciChart3DSurface.

SciChartSurface.configure({
wasmUrl: "/scichart2d.wasm",
dataUrl: "/scichart2d.data"
});

SciChart3DSurface.configure({
wasmUrl: "/scichart3d.wasm",
dataUrl: "/scichart3d.data"
});

## Step 3: Creating the chart

Sure! Here’s a revised version of your README.md with grammar corrections and slight improvements for clarity:

SciChart.js Angular Demo
Step 1: Adding SciChart to Your Angular Application
If you haven't already done so, add SciChart.js to your Angular application. Additionally, we recommend using the official Angular wrapper for SciChart.

bash
Copy code
npm install scichart scichart-angular
Step 2: WASM File Deployment
Loading the required WASM dependencies:

SciChart.js requires additional WASM modules to function properly: scichart2d.wasm and scichart2d.data for instantiating SciChartSurface, and scichart3d.wasm and scichart3d.data for SciChart3DSurface.

typescript
Copy code
SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm",
    dataUrl: "/scichart2d.data"
});

SciChart3DSurface.configure({
    wasmUrl: "/scichart3d.wasm",
    dataUrl: "/scichart3d.data"
});

## Step 3: Creating the Chart
Add the drawExampleAnimation3D function in app.component.ts.

Then, include the SciChart Angular selector in app.component.html:
    <scichart-angular [initChart]="drawExampleAnimation3D"></scichart-angular>

    
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
