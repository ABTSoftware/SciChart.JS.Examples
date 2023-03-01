async function digitalLineChart(divElementId) {
  // #region ExampleA
  // Demonstrates how to create a digitral line chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(Math.sin(i * 0.1));
  }

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    // set flag isDigitalLine = true to enable a digital (step) line
    isDigitalLine: true
  });

  sciChartSurface.renderableSeries.add(lineSeries);
  // #endregion
};

digitalLineChart("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a digital line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(Math.sin(i * 0.1));
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Navy } },
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues,
          yValues
        },
        options: {
          stroke: "#0066FF",
          strokeThickness: 5,
          // set flag isDigitalLine = true to enable a digital (step) line
          isDigitalLine: true,
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
