# Angular SciChart Boilerplate with scichart-angular

This boilerplate uses Angular 20 and SciChart.js 4.0.

This project provides a boilerplate for creating charts in Angular with SciChart.js, as well as a setup guide.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Running the example

```bash
npm install
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## SciChart Setup Guide

### Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initializes with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

### Step 1: Adding SciChart to your Angular Application

If you haven't already done so, add SciChart.js to your Angular application.
Additionally, we recommend using the official [Angular wrapper for SciChart](https://www.npmjs.com/package/scichart-angular)

```bash
npm install scichart scichart-angular
```

### Step 2: WASM File Deployment

SciChart.js uses WebAssembly files which must be fetched asynchronously from CDN or your own server.

#### Fetching WASM from CDN

Simply run the following lines on client side once before initializing a chart:

```ts
import { SciChartSurface, SciChart3DSurface } from "scichart";

// ...

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
```

#### Fetching WASM from your own server

In this project, we've configured Angular to copy the WASM files from the `node_modules/scichart/_wasm` folder to the output folder during build. This is done by adding the following to the `angular.json` file:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  },
  {
    "glob": "*.wasm",
    "input": "node_modules/scichart/_wasm",
    "output": "/"
  }
]
```

Then, in your application code, use the `loadWasmLocal()` method to load the WASM files:

```ts
import { SciChartSurface, SciChart3DSurface } from "scichart";

// ...

SciChartSurface.loadWasmLocal();
SciChart3DSurface.loadWasmLocal();
```

> Note: other methods to [load WASM from CDN](https://www.scichart.com/documentation/js/v4/2d-charts/surface/deploying-wasm/) are available to simplify getting started

### Step 3: Creating the Chart

There are two ways to setup `SciChartAngular`.
The component requires one of `[config]` or `[initChart]` properties to create a chart.

#### With Config

The SecondChartGroup component demonstrates how to use the config approach to create both 2D and 3D charts using the [Builder API](https://www.scichart.com/documentation/js/v4/2d-charts/builder-api/builder-api-overview/).

`second-chart-group.component.html`:

```html
<div class="second-chart-container">
  <h3>Charts with Config Approach</h3>
  <div>
    <label> <input type="checkbox" [(ngModel)]="showChart" /> Show Charts </label>
  </div>
  <div class="charts-grid" *ngIf="showChart">
    <div class="chart-wrapper">
      <h4>2D Chart</h4>
      <scichart-angular 
        [config]="config"
        (onInit)="onInit2DHandler($event)"
        (onDelete)="onDelete2DHandler($event)"
      ></scichart-angular>
    </div>
    <div class="chart-wrapper">
      <h4>3D Chart</h4>
      <scichart-angular 
        [config]="config3D"
        (onInit)="onInit3DHandler($event)"
        (onDelete)="onDelete3DHandler($event)"
      ></scichart-angular>
    </div>
  </div>
</div>
```

`second-chart-group.component.ts`:

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScichartAngularComponent } from 'scichart-angular';
import {
  EAxisType,
  EChart2DModifierType,
  EChart3DModifierType,
  EPointMarker3DType,
  ESciChartSurfaceType,
  ESeriesType,
  ESeriesType3D,
  EThemeProviderType,
  NumberRange,
  SciChart3DSurface,
  SciChartSurface,
  Vector3,
} from 'scichart';

@Component({
  selector: 'app-second-chart-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './second-chart-group.component.html',
  styleUrl: './second-chart-group.component.css'
})
export class SecondChartGroupComponent {
  showChart = true;

  // 2D Chart Configuration
  config = {
    xAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: 'X Axis' } }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: 'Y Axis' } }],
    series: [
      {
        type: ESeriesType.SplineMountainSeries,
        options: {
          fill: '#3ca832',
          stroke: '#eb911c',
          strokeThickness: 4,
          opacity: 0.4
        },
        xyData: { xValues: [1, 2, 3, 4, 5, 6, 7, 8], yValues: [1, 4, 7, 3, 6, 2, 5, 8] }
      }
    ],
    modifiers: [
      { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
      { type: EChart2DModifierType.MouseWheelZoom },
      { type: EChart2DModifierType.ZoomExtents }
    ]
  };

  // 3D Chart Configuration
  config3D = {
    type: ESciChartSurfaceType.Default3D,
    surface: {
      theme: { type: EThemeProviderType.Navy },
      cameraOptions: {
        position: new Vector3(230, 300, 380),
        target: new Vector3(0, 70, 0),
        fieldOfView: 50,
      },
      isZYPlaneVisible: false,
    },
    xAxis: {
      type: EAxisType.NumericAxis3D,
      options: {
        labelPrecision: 0,
        visibleRange: new NumberRange(-5, 5),
      },
    },
    yAxis: {
      type: EAxisType.NumericAxis3D,
      options: {
        labelPrecision: 0,
        visibleRange: new NumberRange(0, 8),
        axisTitle: 'Y Axis',
      },
    },
    zAxis: {
      type: EAxisType.NumericAxis3D,
      options: {
        labelPrecision: 0,
        visibleRange: new NumberRange(-5, 5),
      },
    },
    series: [
      {
        type: ESeriesType3D.ColumnRenderableSeries3D,
        options: {
          stroke: '#AA0000FF',
        },
        xyzData: {
          xValues: [0, 1, 2, 3, 4],
          zValues: [0, -1, -2, -3, -4],
          yValues: [1, 4, 2, 3, 0.5],
        },
      },
      {
        type: ESeriesType3D.PointLineRenderableSeries3D,
        options: {
          stroke: '#88aaFFFF',
          strokeThickness: 5,
          pointMarker: {
            type: EPointMarker3DType.Ellipse,
            options: {
              size: 5,
              fill: '#00FF66',
            },
          },
        },
        xyzData: {
          xValues: [0, -1, -2, -3, -4],
          zValues: [0, 1, 2, 3, 4],
          yValues: [1, 4, 2, 3, 0.5],
        },
      },
      // Additional series omitted for brevity
    ],
    modifiers: [
      { type: EChart3DModifierType.MouseWheelZoom },
      { type: EChart3DModifierType.Orbit },
      { type: EChart3DModifierType.PinchZoom },
      { type: EChart3DModifierType.Tooltip },
      { type: EChart3DModifierType.ZoomExtents },
    ],
  };

  // Event handlers
  onInit2DHandler = (initResult: { sciChartSurface: SciChartSurface }) => {
    console.log('onInit2DHandler', initResult);
  };

  onDelete2DHandler = (initResult: { sciChartSurface: SciChartSurface }) => {
    console.log('onDelete2DHandler', initResult);
  };

  onInit3DHandler = (initResult: { sciChartSurface: SciChart3DSurface }) => {
    console.log('onInit3DHandler', initResult);
  };

  onDelete3DHandler = (initResult: { sciChartSurface: SciChart3DSurface }) => {
    console.log('onDelete3DHandler', initResult);
  };
}
```

#### With Initialization Function

The FirstChartGroup component demonstrates how to use the initialization function approach to create charts.

`first-chart-group.component.html`:

```html
<div>
  <label> <input type="checkbox" [(ngModel)]="showCharts" /> Show Charts </label>
</div>
<div>
  <button class="test-button" (click)="logDebugInfo()">Log Debug Info</button>
</div>
<div class="flex-container">
  <div *ngIf="showCharts" class="chart-container">
    <scichart-angular
      [initChart]="drawChart2D"
      (onInit)="onInit2DHandler($event)"
      (onDelete)="onDelete2DHandler($event)"
    ></scichart-angular>
  </div>
  <div *ngIf="showCharts" class="chart-container">
    <scichart-angular
      [initChart]="drawChart3D"
      (onInit)="onInit3DHandler($event)"
      (onDelete)="onDelete3DHandler($event)"
    ></scichart-angular>
  </div>
</div>
```

`first-chart-group.component.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemoryUsageHelper, SciChart3DSurface, SciChartSurface } from 'scichart';
import { ScichartAngularComponent } from 'scichart-angular';
import { drawExample2D } from '../drawExample2D';
import { drawExample3D } from '../drawExample3D';

@Component({
  selector: 'app-first-chart-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './first-chart-group.component.html',
  styleUrl: './first-chart-group.component.css'
})
export class FirstChartGroupComponent {
  showCharts = true;

  public drawChart2D = drawExample2D;
  public drawChart3D = drawExample3D;

  onInit2DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample2D>>
  ) => {
    console.log('onInit2DHandler', initResult);
  };

  onDelete2DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample2D>>
  ) => {
    console.log('onDelete2DHandler', initResult);
  };

  onInit3DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample3D>>
  ) => {
    console.log('onInit3DHandler', initResult);
  };

  onDelete3DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample3D>>
  ) => {
    console.log('onDelete3DHandler', initResult);
  };

  public logDebugInfo() {
    // try forcing garbage collection (if it has been enabled in Chromium)
    window.gc?.();

    // some delay may be required here

    // output info about SciChart-related deletable object to console
    MemoryUsageHelper.objectRegistry.log();
  }
}
```

**NOTE** Make sure that in both cases `initChart` and `config` props do not change, as they should be only used for initial chart render. The component also provides `onInit` and `onDelete` events that you can use to handle chart initialization and cleanup.

The FirstChartGroup component uses the following chart initialization functions:

`drawExample2D.ts`:

```typescript
import {
    FastBandRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartJsNavyTheme,
    SciChartSurface,
    SweepAnimation,
    XyyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from 'scichart';

export const drawExample2D = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
        rootElement,
        {
            theme: new SciChartJsNavyTheme(),
        }
    );

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: 'X Axis' })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.4, 0.4),
            axisTitle: 'Y Axis',
        })
    );

    // Create some data for the example. We need X, Y and Y1 values
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 50;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
        const k = 1 - i / 100;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues,
                y1Values,
            }),
            strokeThickness: 3,
            fill: '#ff5f00',
            fillY1: '#87CEEB',
            stroke: '#ff5f00',
            strokeY1: '#87CEEB',
            animation: new SweepAnimation({ delay: 1000, duration: 800 }),
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier()
    );

    return { wasmContext, sciChartSurface };
};
```

`drawExample3D.ts`:

```typescript
import {
    CameraController,
    EDrawMeshAs,
    GradientColorPalette,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SciChartJsNavyTheme,
    SurfaceMeshRenderableSeries3D,
    TooltipModifier3D,
    UniformGridDataSeries3D,
    Vector3,
    zeroArray2D,
} from 'scichart';

export const drawExample3D = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChart3DSurface
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(
        rootElement,
        {
            theme: new SciChartJsNavyTheme(),
        }
    );

    // Create and position the camera in the 3D world
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-200, 150, 200),
        target: new Vector3(0, 50, 0),
    });
    // Set the worlddimensions, which defines the Axis cube size
    sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

    // Add an X,Y and Z Axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: 'X Axis',
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: 'Y Axis',
        visibleRange: new NumberRange(0, 0.3),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: 'Z Axis',
    });

    // Create a 2D array using the helper function zeroArray2D
    // and fill this with data
    const zSize = 25;
    const xSize = 25;
    const heightmapArray = zeroArray2D([zSize, xSize]);
    for (let z = 0; z < zSize; z++) {
        for (let x = 0; x < xSize; x++) {
            const xVal = (x / xSize) * 25.0;
            const zVal = (z / zSize) * 25.0;
            const y = Math.sin(xVal * 0.2) / ((zVal + 1) * 2);
            heightmapArray[z][x] = y;
        }
    }

    // Create a UniformGridDataSeries3D
    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: heightmapArray,
        xStep: 1,
        zStep: 1,
        dataSeriesName: 'Uniform Surface Mesh',
    });

    // Create the color map
    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 1, color: 'pink' },
            { offset: 0.9, color: '#FF5E01 ' },
            { offset: 0.7, color: 'red' },
            { offset: 0.5, color: 'green' },
            { offset: 0.3, color: '#87CEEB' },
            { offset: 0.15, color: 'indigo' },
            { offset: 0, color: '#1F0954' },
        ],
    });

    // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries,
        minimum: 0,
        maximum: 0.5,
        opacity: 0.9,
        cellHardnessFactor: 1.0,
        shininess: 0,
        lightingFactor: 0.0,
        highlight: 1.0,
        stroke: 'blue',
        strokeThickness: 2.0,
        contourStroke: 'blue',
        contourInterval: 2,
        contourOffset: 0,
        contourStrokeThickness: 2,
        drawSkirt: false,
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
        meshColorPalette: colorMap,
        isVisible: true,
    });

    sciChart3DSurface.renderableSeries.add(series);

    // Optional: Add some interactivity modifiers
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());
    sciChart3DSurface.chartModifiers.add(
        new TooltipModifier3D({ tooltipContainerBackground: '#B3EBF2' })
    );

    return { sciChartSurface: sciChart3DSurface, wasmContext };
};
```


## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/v4/get-started/tutorials-js-npm-webpack/tutorial-02-adding-series-and-data/): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/v4/get-started/tutorials-cdn/tutorial-01-using-cdn/): using only vanilla javascript and HTML
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
