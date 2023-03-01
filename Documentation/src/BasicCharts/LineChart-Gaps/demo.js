const {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  ELineDrawMode
} = SciChart;


// Demonstrates how to create a line chart with gaps using SciChart.js
async function drawLineChartsWithGaps(divElementId) {
  // #region Code-API
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

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
    drawNaNAs: ELineDrawMode.DiscontinuousLine
  });

  sciChartSurface.renderableSeries.add(lineSeries);
  // #endregion
};

const {
  chartBuilder,
  ESeriesType
} = SciChart;

// Demonstrates the alternative Builder-API to create a line chart with gaps
async function drawLineChartsWithGapsBuilderApi(divElementId) {
  // #region Builder-API
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
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


drawLineChartsWithGaps("scichart-root");
// drawLineChartsWithGapsBuilderApi("scichart-root"); // uncomment to choose this version
