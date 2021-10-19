# Server Side Chart Definitions using SciChart.JS

One of the big new features in SciChart.js v2 is the Builder Api.  This lets you define everything about a chart in a single JSON definition, and create a chart from that.  One of the many possibilities this opens up is the ability to move your code that defines charts from the client to the server.  This means you can have a very simple client that is capable of showing almost any kind of chart.  It means you can store, edit and manage charts as pure data, rather than code, which makes it easy to support user customization of charts.

We are going to walk though the process of creating a bare bones example that demonstrates this, and then extend it in a few interesting ways.

# Basic setup

Initially we are going to create a very simple node.js server using express and typescript.  Create a folder for the project and enter it then initialize it as follows:
```
npm init
npm install express
```
We want to use typescript on the server, so install these for development
```
npm install --save-dev typescript @types/express ts-node nodemon
```
We are going to install scichart as a development dependency only.  We are only going to use the types on the server, and on the client we will reference it from CDN, which avoids having to use webpack
```
npm install --save-dev scichart@2.0.0-beta.2084
```
For typescript we need a tsconfig.json.  Here is a minimal config that works for this example.
``` Json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "./build",
    "typeRoots": ["./node_modules/@types"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
  },
  "include": [
      "server/*.ts"
  ],
  "exclude": [
      "node_modules"
  ]
}
```

Add these scripts to package.json.  The dev script will give you hot reload of the server whenever you make changes.
``` Json
"scripts": {
    "dev": "nodemon --watch server/** --ext ts --exec ts-node server/server.ts",
    "start": "ts-node server/server.ts"
}
```

Add a folder called server containing server.ts with the following code:
```  Typescript
import express from "express";

const app = express();
const port = 3000;

app.use(express.static("client"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

Create a folder called client containing index.html
``` Javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Chart from Server with SciChart.js</title>
  </head>
  <body>
    <h1>Chart from Server with SciChart.js</h1>

    <div id="scichart-root" style="width: 800px; height: 600px;"></div>

  </body>
</html>
```
Run the server with **npm run dev** then browse to http://localhost:3000 and you should see a page with just a heading.

# Creating Chart Definitions on the Server
It is tempting to try and create a SciChartSurface on the server, but it turns out this is difficult (due to the dependency on webgl and the browser) and for our purposes, unnecessary.  Instead we are going to create an [ISciChart2DDefinition](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iscichart2ddefinition.html) which is a plain javascript object.  We want to return this object in response to a call from the client.

Add the following to server.ts

``` Typescript
import { ISciChart2DDefinition } from "scichart/Builder/buildSurface";
import { ESeriesType } from "scichart/types/SeriesType";

app.get("/chart", async (req, res) => {
    const definition: ISciChart2DDefinition = {
      series: {
        type: ESeriesType.LineSeries,
        options: {},
        xyData: { xValues: [1, 2, 3], yValues: [1, 3, 2] },
      },
    };
    res.send(definition);
});
```
This is enough to display some kind of chart. We'll come back and make this more interesting once the client it working.

# Rendering the Chart on the Client
To keep life simple for this example, we are going to reference SciChart using the browser bundle so we don't have to deal with webpack.  However, everything here could be done very similarly with SciChart referenced via npm and built with webpack as descripted in the [Tutorials](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html). 

Add the following script tag within the <head> of index.html
``` javascript
<script src="https://cdn.jsdelivr.net/npm/scichart@2.0.0-beta.2084/_wasm/scichart.browser.js" crossorigin="anonymous" ></script>
```
Before the closing </body> tag add the following 
``` javascript
<script>
  // In order to load data file from the CDN we need to set dataUrl
  SciChart.SciChartSurface.configure({
    dataUrl: "https://cdn.jsdelivr.net/npm/scichart@2.0.0-beta.2084/_wasm/scichart2d.data",
    wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@2.0.0-beta.2084/_wasm/scichart2d.wasm"
  });

  async function loadChart() {
    // Fetch the definition from the server
    const definition = await fetch("/chart").then(response => response.json());
    if (definition) {
      // Build the chart
      const { sciChartSurface, wasmContext } = await SciChart.chartBuilder.build2DChart("scichart-root", definition);
      scs = sciChartSurface;
    }
  }

  loadChart();
</script>
```
That's it!  Refresh the page and you should see a chart with a simple line.  Now let's create a more interesting chart.  Because we are using Typescript and we have said that definition is an ISciChart2DDefinition, we can use intelliense to find out everything that is possible in this definition.  Feel free to experiment.

# Realistic Chart
To make this more realistic, lets bring in some crypto data from binance.  Start by
``` 
npm install binance-api-node 
```
In server.ts we're going to fetch candles for a given symbol and interval and return a candlestick chart
``` Typescript
import Binance, { CandleChartInterval_LT, CandleChartResult } from "binance-api-node";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";

const binance = Binance();

app.get("/chart/:symbol/:interval", async (req, res) => {
  // get the requested symbol
  const symbol = req.params.symbol;
  const interval = req.params.interval as CandleChartInterval_LT; 
  let candles: CandleChartResult[] = []; 
  // Fetch the data, with some error handling
  try {
     candles = await binance.candles({ symbol, interval });
  } catch (err) {
    res.status(400).send("Invalid Symbol or interval");
    return;
  }
  const xValues: number[] = [];
  const openValues: number[] = [];
  const highValues: number[] = [];
  const lowValues: number[] = [];
  const closeValues: number[] = [];
  // Convert the data to arrays
  for (const candle of candles) {
    // SciChart default date parsing expects times in seconds
    xValues.push(candle.openTime / 1000);
    openValues.push(Number(candle.open));
    highValues.push(Number(candle.high));
    lowValues.push(Number(candle.low));
    closeValues.push(Number(candle.close));
  }
  const definition: ISciChart2DDefinition = {
    series: {
      type: ESeriesType.CandlestickSeries,
      options: {  },
      ohlcData: { xValues, openValues, highValues, lowValues, closeValues }
    },
    // SmartDate labelProvider will give nice date labels, regardless of the range
    xAxes: { type: EAxisType.CategoryAxis, options: { labelProvider: { type: ELabelProviderType.SmartDate } } },
    // Format using significant figures to get sensible labels for very large and very small values
    yAxes: { type: EAxisType.NumericAxis, options: { labelFormat: ENumericFormat.SignificantFigures, labelPrecision: 3 }},
    // Interactivity!
    modifiers: [
      { type: EChart2DModifierType.MouseWheelZoom },
      { type: EChart2DModifierType.ZoomPan },
      { type: EChart2DModifierType.ZoomExtents },
      { type: EChart2DModifierType.Cursor }
    ]
  };
  res.send(definition);
});
```
We also need to update our client with a bit of UI to allow inputing the symbol and interval, and to deal with possible error responses
