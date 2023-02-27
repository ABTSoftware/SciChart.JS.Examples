const {
  chartBuilder,
  ESeriesType,
} = SciChart;

async function simpleLineChartWithBuilderApi(divElementId) {
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
        },
        options: {
          stroke: "#FF6600",
          strokeThickness: 5,
        }
      }
    ]
  });
};

simpleLineChartWithBuilderApi("scichart");
