async function drawLineChartsWithGaps(divElementId) {
  // #region ExampleA
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

  // Gaps are realised by setting Y=NAN
  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yValues = [2.5, 3.5, NaN, 4.0, 5.0, 5.5, NaN, 4.0, 3.0];
  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    // Modes include DiscontinuousLine, PolyLine
    drawNaNAs: ELineDrawMode.DiscontinuousLine
  });

  sciChartSurface.renderableSeries.add(lineSeries);
  // #endregion
};

drawLineChartsWithGaps("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with gaps in SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    ELineDrawMode,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          yValues: [2.5, 3.5, NaN, 4.0, 5.0, 5.5, NaN, 4.0, 3.0]
        },
        options: {
          stroke: "#FF6600",
          strokeThickness: 5,
          drawNaNAs: ELineDrawMode.DiscontinuousLine
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
