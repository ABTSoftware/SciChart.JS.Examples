async function drawLineChartWithPointMarkers(divElementId) {
  // Demonstrates how to create a line chart with pointmarkers using SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    EllipsePointMarker,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  // #region ExampleA
  // Pointmarkers may be applied to most series types. Just declare a marker and pass in options
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    isDigitalLine: true,
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

drawLineChartWithPointMarkers("scichart-root");






// Demonstrates the alternative Builder-API to create a line chart with gaps
async function builderExample(divElementId) {
  const {
    chartBuilder,
    ESeriesType,
    EPointMarkerType,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
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
          isDigitalLine: true,
          // With the Builder API, PointMarkers may be declared only using javascript-objects
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


if (location.search.includes("builder=1"))
builderExample("scichart-root");
