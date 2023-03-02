async function drawDigitalLineChartsWithGaps(divElementId) {
  // Demonstrates how to create a line chart with gaps using SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    ELineDrawMode,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region ExampleA
  // Gaps are realised by setting Y=NAN
  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(i % 10 === 0 ? NaN : Math.sin(i * 0.1));
  }

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    isDigitalLine: true
  });
  // #endregion

  sciChartSurface.renderableSeries.add(lineSeries);
};

drawDigitalLineChartsWithGaps("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to create a line chart with gaps in SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    ELineDrawMode,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // #region ExampleB
  // Gaps are realised by setting Y=NAN
  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(i % 10 === 0 ? NaN : Math.sin(i * 0.1));
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues,
          yValues,
        },
        options: {
          stroke: "#FF6600",
          strokeThickness: 5,
          isDigitalLine: true
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
