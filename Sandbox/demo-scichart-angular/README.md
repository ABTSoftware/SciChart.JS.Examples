# SciChartAngular Boilerplate Demo

This folder provides a boilerplate for creating a chart in Angular with SciChartAngular,
as well as a setup guide.

## Running the example

```bash
npm install
npm start
```

## Setup Guide

### Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

-   From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
-   For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

### Step 1: Adding SciChart to your Angular Application

If you haven't already done so, add SciChart.js to your Angular application.
Additionally, we recommend using the official [Angular wrapper for SciChart](https://www.npmjs.com/package/scichart-angular)

```bash
npm install scichart scichart-angular
```

---

### Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be fetched asynchronously from CDN or your own server.

#### Fetching WASM from CDN

Simply run the following lines on client side once before initializing a chart:

```ts
import { SciChartSurface, SciChart3DSurface } from "scichart";

// ...

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
```

#### Fetching WASM from own server

The way to do this is to copy the wasm files from the node_modules/scichart/\_wasm folder to your output folder.

Angular requires _.data file and wasm file to be in output folder /src/_. This is done using the `copy-files-to-from` npm package:

To do this, we use npm package `copy-files-from-to` and `copy-files-from-to.json` with this config:

```json
{
    "copyFilesSettings": {
        "whenFileExists": "overwrite"
    },
    "copyFiles": [
        {
            "from": "./node_modules/scichart/_wasm/scichart2d.data",
            "to": "./src/scichart2d.data"
        },
        {
            "from": "./node_modules/scichart/_wasm/scichart2d.wasm",
            "to": "./src/scichart2d.wasm"
        },
        {
            "from": "./node_modules/scichart/_wasm/scichart3d.data",
            "to": "./src/scichart3d.data"
        },
        {
            "from": "./node_modules/scichart/_wasm/scichart3d.wasm",
            "to": "./src/scichart3d.wasm"
        }
    ]
}
```

Then this needs to be executed when building. See package.json scripts:

```json
  "scripts": {
    "copyWasm": "copy-files-from-to --config copy-files-from-to.json",
    "start": "npm run copyWasm && ng serve",
    "build": "npm run copyWasm && ng build",
  },
```

And then, it is recommended to specify the URLs of those on the client side accordingly to the location they are hosted from.
For example:

```ts
import { SciChartSurface, SciChart3DSurface } from "scichart";

// ...

SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm",
    dataUrl: "/scichart2d.data",
});

SciChart3DSurface.configure({
    wasmUrl: "/scichart3d.wasm",
    dataUrl: "/scichart3d.data",
});
```

will fetching these dependencies from as following:

```
http://localhost:4200/scichart2d.wasm
http://localhost:4200/scichart2d.data
http://localhost:4200/scichart3d.wasm
http://localhost:4200/scichart3d.data
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/current/webframe.html#Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) are available to simplify getting started

---

### Step 3: Creating the Chart

There are two ways to setup `SciChartAngular`.
The component requires one of `[config]` or `[initChart]` properties to create a chart.

#### With Config

Pass a config object that will be used to generate a chart via the [Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).

`app.component.html`:

```html
<scichart-angular [config]="config"></scichart-angular>
```

`app.component.ts`:

```ts
import { Component } from '@angular/core';
import { ScichartAngularComponent } from 'scichart-angular';

import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
  EChart2DModifierType,
  ESeriesType,
} from "scichart";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SciChartAngular Boilerplate';

  config = {
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
        xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] }
      }
    ],
    modifiers: [
      { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
      { type: EChart2DModifierType.MouseWheelZoom },
      { type: EChart2DModifierType.ZoomExtents }
    ]
  }

```

---

#### With Initialization Function

Alternatively you can pass a function which should create a surface on the provided root element.

`app.component.html`

```html
<scichart-angular [initChart]="drawExample"></scichart-angular>
```

`app.component.ts`

```typescript
import { Component } from "@angular/core";
import { ScichartAngularComponent } from "scichart-angular";

import { SciChartSurface, NumericAxis, XyDataSeries, MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } from "scichart";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "scichart-angular-app";

    drawExample = async function (rootElement) {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

        const xAxis = new NumericAxis(wasmContext);
        const yAxis = new NumericAxis(wasmContext);

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

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

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }), new MouseWheelZoomModifier(), new ZoomExtentsModifier());

        return { sciChartSurface };
    };
}
```

**NOTE** Make sure that in both cases `initChart` and `config` props do not change, as they should be only used for initial chart render.

---

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

-   [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
-   [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
-   [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
-   [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
