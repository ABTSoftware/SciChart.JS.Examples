# SciChart.js JavaScript Chart Examples Suite

Examples, showcase applications and tutorials for **SciChart.js: Ultra High Performance Realtime [JavaScript Chart Library](https://www.scichart.com/javascript-chart-features/)**.

[![SciChart.js Ultra High Performance Realtime JavaScript Chart library](Sandbox/scichart-js-javascript-chart-collage-1485.jpg)](https://www.scichart.com/javascript-chart-features)

[SciChart](https://www.scichart.com) has the _**only viable solution for mission-critical charting applications**_, with our ultra-fast 2D/3D graphics technology codenamed _Visual Xccelerator&reg;_ now ported to JavaScript/TypeScript using WebGL and WebAssembly. We have cross-platform technology and provide solutions to enterprise around the world for Windows, Mobile, macOS and now JavaScript apps.

## Insane performance

[SciChart's](https://www.scichart.com) Ultra High performance [JavaScript Charts](https://www.scichart.com/javascript-chart-features/) can draw many millions of data-points, allowing you to zoom, pan, or browse big-data sets with ease. [SciChart](https://www.scichart.com) enables next-generation JavaScript &amp; TypeScript chart applications by allowing previously impossible datarates and update-rates. After all, we make 'Impossible projects possible'!

## Online Demo

An online demo version of scichart.js.examples can be seen at https://demo.scichart.com. 

**Check out the demos below:**

#### [JavaScript Chart - Load 500 Series x 500 Points Performance Demo](https://demo.scichart.com/javascript-chart-load-500-series-by-500-points)

Click **Load** in the demo to create 500 series, each with 500 points (250,000 points total) and watch the JavaScript Chart draw instantly!

[![Javascript Chart Performance Demo](Sandbox/scichart-js-javascript-chart-performance-demo500.jpg)](https://demo.scichart.com/javascript-chart-load-500-series-by-500-points)

#### [Realtime JavaScript Chart Performance Demo](https://demo.scichart.com/javascript-chart-realtime-performance-demo)

Click **Start** in the demo to create three series and append 100k points per second to each, with a total point count in the millions.

[![Javascript Chart Performance Demo](Sandbox/scichart-js-javascript-chart-performance-demomillions.jpg)](https://demo.scichart.com/javascript-chart-realtime-performance-demo)

#### [Realtime Ghosted Traces](https://demo.scichart.com/javascript-realtime-ghosted-traces-chart)

Click **Start** to watch 10 series with thousands of points animating, while applying a glow WebGL Shader effect.

[![Javascript Chart Performance Demo](Sandbox/scichart-js-javascript-chart-performance-demoghosted.jpg)](https://demo.scichart.com/javascript-realtime-ghosted-traces-chart)

#### [JavaScript Chart Types](https://demo.scichart.com/javascript-bubble-chart)

The demo includes many JavaScript Chart Types including [JavaScript Bubble Chart](https://demo.scichart.com/javascript-bubble-chart), a real-time [JavaScript heatmap chart](https://demo.scichart.com/javascript-heatmap-chart), a [JavaScript Candlestick Chart](https://demo.scichart.com/javascript-candlestick-chart) and many more!

SciChart.js also includes 3D Charts, and has a [JavaScript UAV LiDAR 3D Point-Cloud demo](https://demo.scichart.com/javascript-3d-lidar-visualization), a [JavaScript 3D Bubble Chart](https://demo.scichart.com/javascript-3d-bubble-chart) and a [JavaScript 3D Surface Mesh Chart](https://demo.scichart.com/javascript-3d-surface-mesh-chart).   

## Documentation

We've taken the time to create hundreds of documentation pages for our JavaScript Charts, which you can find over at https://www.scichart.com/javascript-chart-documentation. Take a look here for tutorials, getting-started guides, API Docs (TypeDoc) and more.

[![JavaScript Chart Documentation](Sandbox/scichart-js-javascript-chart-documentation.PNG)](https://www.scichart.com/javascript-chart-documentation).

## Developer Quick-Start

### Run application in dev mode

To start the application locally you will need to npm-install and npm run dev. This will run a development server locally and you should be able to view the examples in browser at http://localhost:8080 
> `npm install`   
> `npm run dev`

### Run application in production mode

To start the application in production mode, run the following scripts. Note in production mode google analytics will be enabled.

> `npm run build`  
> `npm start`

### How to add examples to Examples App

**For SciChart Developers and partners only**

To add an example to the SciChart.js Examples Suite, use the following steps:

* **Create folder** for your example, (e.g. `Examples/src/components/Examples/Charts2D/BasicChartTypes/BandSeriesChart/`)
* **Place example code**. In the example folder create `index.tsx` file and put code for your example into it.
* **Add metadata**. In the example folder create metadata file `exampleInfo.ts` 
```ts
import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

...

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBandChart,
    path: ExampleStrings.urlBandChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
```
* **Generate GENERATED_SRC.ts, GENERATED_GITHUB_URL.ts files** - run `npm run generateExampleSrc` to generate `GENERATED_SRC.ts`. Note if you modify any of index.tsx in the examples folder, you also need to run the script.

* **Add example to menu**

Edit `Examples/src/components/AppRouter/examplePages.ts` to add new example

```ts
import { bandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo";
...

export const EXAMPLES_PAGES = asRecord({
    ...
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        ...bandSeriesChartExampleInfo
    }
    ...
})
```

And this file `Examples/src/components/AppRouter/examples.ts`
```ts
import BandSeriesChart from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart";

...

export const MENU_ITEMS_2D: TMenuItem[] = [
    {
        item: { id: "chart2D_basicCharts", name: "JavaScript Chart Types" },
        submenu: [
            ...
            EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart,
            ...
        ]
    }
]

...

export const getExampleComponent = (exampleId: string): (() => JSX.Element) => {
    switch (exampleId) {
        ...
        case EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.id:
            return BandSeriesChart;
        ...
}

```
* **Add example to search** - edit `Examples/src/components/Search/searchItems.ts`
```ts
...
export const searchItems: TSearchItem[] = [
    ...
    { title: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.title, link: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.path }
];

...
```

* **Update sitemap**
`npm run generateSitemap`
