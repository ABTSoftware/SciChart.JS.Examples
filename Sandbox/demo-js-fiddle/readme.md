# SciChart.js JSFiddle demo

SciChart.js can be loaded in https://jsfiddle.net using the browser bundle. This short demo shows you how.

> Visit this [JSFiddle here](https://jsfiddle.net/gh/get/library/pure/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-js-fiddle/)

- You need to include the Browser bundle script served by JSDelivr into jsfiddle.

- Do this by clicking +Resources and adding this link: https://cdn.jsdelivr.net/npm/scichart/index.min.js

_**Note:** link above will always return the latest version. For a specific version you can do https://cdn.jsdelivr.net/npm/scichart@3.3.577/index.min.js, or https://cdn.jsdelivr.net/npm/scichart@3.3.577/index.min.js to get latest for version 3. You can see the latest version at [jsdelivr.com/package/npm/scichart](https://www.jsdelivr.com/package/npm/scichart). A list of historical versions is available at [npmjs.com/package/scichart](https://www.npmjs.com/package/scichart?activeTab=versions)_

- Next, you are using the Browser Bundle version of scichart which works without npm, so there are no imports. To declare or get types from the SciChart library, you need to 'import' them like this:

```javascript
const { SciChartSurface, NumericAxis, FastLineRenderableSeries } = SciChart;
```

- Lastly declare your chart using the SciChart.js API. Here's a quick example

```javascript
const { SciChartSurface, chartBuilder } = SciChart;

async function initSciChart() {
  // Create the SciChartSurface
  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(
    "scichart-root",
    {
      series: {
        type: "LineSeries",
        xyData: {
          xValues: [1, 2, 3, 4],
          yValues: [1, 4, 2, 6],
        },
      },
    }
  );

  // That's it! You now have a SciChartSurface!
}

initSciChart();
```

_**Note:** in v3.0.269 or below you'll need to call `sciChartSurface.useWasmFromCDN();` and also set a license key or have the SciChart Licensing Wizard open. However in v3.0.280 or above this restriction has been removed for JSFiddle, codepen and similar sandboxes._
