const {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker
} = SciChart;


// Demonstrates how to create a line chart with pointmarkers using SciChart.js
async function drawLineChartWithPointMarkers(divElementId) {
  // #region Code-API
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 11,
      height: 11,
      fill: "#FF6600",
      stroke: "white",
      strokeThickness: 2
    })
  });

  sciChartSurface.renderableSeries.add(lineSeries);
  // #endregion
};

const {
  chartBuilder,
  ESeriesType,
  EPointMarkerType
} = SciChart;

// Demonstrates the alternative Builder-API to create a line chart with gaps
async function drawLineChartWithPointMarkersBuilderApi(divElementId) {
  // #region Builder-API
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
          pointMarker: {
            type: EPointMarkerType.Ellipse,
            options: {
              width: 11,
              height: 11,
              fill: "#FF6600",
              stroke: "white",
              strokeThickness: 2,
            }
          }
        }
      }
    ]
  });
  // #endregion
};


drawLineChartWithPointMarkers("scichart-root");
// drawLineChartWithPointMarkersBuilderApi("scichart-root"); // uncomment to choose this version
