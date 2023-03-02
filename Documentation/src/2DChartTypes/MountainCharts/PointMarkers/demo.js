async function simpleMountainChartWithPointMarkers(divElementId) {
  // #region ExampleA
  // Demonstrates how to create a Mountain (Area) chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastMountainRenderableSeries,
    GradientParams,
    XyDataSeries,
    Point,
    EllipsePointMarker,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Create some data
  let yLast = 100.0;
  const xValues = [];
  const yValues = [];
  for (let i = 0; i <= 125; i++) {
    const y = yLast + (Math.random() - 0.48);
    yLast = y;
    xValues.push(i);
    yValues.push(y);
  }

  // Create a mountain series & add to the chart
  const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    stroke: "#4682b4",
    strokeThickness: 3,
    zeroLineY: 0.0,
    // when a solid color is required, use fill
    fill: "rgba(176, 196, 222, 0.7)",
    // when a gradient is required, use fillLinearGradient
    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
      { color: "rgba(70,130,180,0.77)", offset: 0 },
      { color: "rgba(70,130,180,0.0)", offset: 1 },
    ]),
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 7,
      height: 7,
      strokeThickness: 1,
      fill: "rgba(176, 196, 222)",
      stroke: "white"
    })
  });

  sciChartSurface.renderableSeries.add(mountainSeries);
  // #endregion
};

simpleMountainChartWithPointMarkers("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EPointMarkerType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // Create some data
  let yLast = 100.0;
  const xValues = [];
  const yValues = [];
  for (let i = 0; i <= 125; i++) {
    const y = yLast + (Math.random() - 0.48);
    yLast = y;
    xValues.push(i);
    yValues.push(y);
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.MountainSeries,
        xyData: {
          xValues,
          yValues,
        },
        options: {
          stroke: "#4682b4",
          strokeThickness: 3,
          zeroLineY: 0.0,
          fill: "rgba(176, 196, 222, 0.7)", // when a solid color is required, use fill
          fillLinearGradient: {
            gradientStops: [{ color:"rgba(70,130,180,0.77)",offset:0.0 },{ color: "rgba(70,130,180,0.0)", offset:1 }],
            startPoint: { x:0, y:0 },
            endPoint: { x:0, y:1}
          },
          pointMarker: {
            type: EPointMarkerType.Ellipse, options: {
              width: 7,
              height: 7,
              strokeThickness: 1,
              stroke: "white",
              fill: "rgba(176, 196, 222)",
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
