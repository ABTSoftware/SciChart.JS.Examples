
const {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  SciChartJsNavyTheme,
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function dataSeriesApi(divElementId) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));


  // import { SciChartSurface, XyDataSeries, FastLineRenderableSeries ... } from "scichart"

  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  // Create a DataSeries
  // #region ExampleA
  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
    // Data distribution flags are calculated automatically as you update data.
    // Providing them in advance can improve performance for big-data
    // Note: undefined behaviour will occur if these flags are set incorrectly
    dataIsSortedInX: true,
    dataIsEvenlySpaced: true,
    dataContainsNaN: false,
  });
  // #endregion

  // Create a renderableSeries and assign the dataSeries
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries: xyDataSeries
  });

  // add to the chart
  sciChartSurface.renderableSeries.add(lineSeries);

}

dataSeriesApi("scichart-root");




async function builderExample(divElementId) {
  // Demonstrates how to create and assign a dataSeries with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    XyDataSeries
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.LineSeries,
        // This section creates a DataSeries with X,Y values
        // IDataSeriesOptions are valid here
        xyData: {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0],
          dataIsSortedInX: true,
          dataEvenlySpacedInX: true,
          dataContainsNaN: false,
        },
        options: {
          stroke: "#FF6600",
          strokeThickness: 2,
        }
      }
    ]
  });

  // However this is also valid (either xyData, or onew XyDataSeries)
  // sciChartSurface.renderableSeries.get(0).dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
