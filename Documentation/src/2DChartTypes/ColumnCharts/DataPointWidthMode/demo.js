async function simpleColumnChart(divElementId) {
  // #region ExampleA
  // Demonstrates how to create a Column chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastColumnRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    EDataPointWidthMode,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Create some data with gaps
  const xValues = [0, 10, 30, 70, 80, 90, 110, 120, 150, 180, 190];
  const yValues = [0.2, 0.4, 0.8, 1.5, 2.4, 8.1, 13.7, 6.4, 3.5, 1.4, 0.4];

  // Create and add a column series
  const columnSeries = new FastColumnRenderableSeries(wasmContext, {
    // When solid fill required, use fill
    fill: "rgba(176, 196, 222, 0.5)",
    stroke: "#FFFFFF77",
    strokeThickness: 2,
    // Use this with sparse data
    dataPointWidthMode: EDataPointWidthMode.Range,
    // This is now "x range per column"
    dataPointWidth: 8,
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
  });

  sciChartSurface.renderableSeries.add(columnSeries);
  // #endregion
}

simpleColumnChart("scichart-root");

async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a Column chart with SciChart.js using the Builder API
  const { chartBuilder, ESeriesType, EThemeProviderType, EDataPointWidthMode } =
    SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // Create some data with gaps
  const xValues = [0, 10, 30, 70, 80, 90, 110, 120, 150, 180, 190];
  const yValues = [0.2, 0.4, 0.8, 1.5, 2.4, 8.1, 13.7, 6.4, 3.5, 1.4, 0.4];

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: { theme: { type: EThemeProviderType.Dark } },
      series: [
        {
          type: ESeriesType.ColumnSeries,
          xyData: {
            xValues,
            yValues,
          },
          options: {
            fill: "rgba(176, 196, 222, 0.5)",
            stroke: "rgba(176, 196, 222, 1)",
            strokeThickness: 2,
            // Use this with sparse data
            dataPointWidthMode: EDataPointWidthMode.Range,
            // This is now "x range per column"
            dataPointWidth: 8,
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
