async function simpleScatterChartWithGaps(divElementId) {
  // Demonstrates how to create a scatter chart with SciChart.js with NAN Gaps
  const {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    SciChartJsNavyTheme,
    LineAnnotation,
    TextAnnotation
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region ExampleA
  const xValues = [];
  const yValues = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(i % 5 === 0 ? NaN : 0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 7,
      height: 7,
      strokeThickness: 2,
      fill: "steelblue",
      stroke: "LightSteelBlue",
    }),
  });

  sciChartSurface.renderableSeries.add(scatterSeries);
  // #endregion

  sciChartSurface.annotations.add(new LineAnnotation({ x1: 50, x2: 64, y1: -0.7, y2: -0.75, stroke: "LightSteelBlue", strokeThickness: 2 }));
  sciChartSurface.annotations.add(new TextAnnotation({ x1: 30, y1: -0.65, text: "Gaps occur where Y = NaN", textColor: "LightSteelBlue", fontSize: 16 }));
};

simpleScatterChartWithGaps("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to create a scatter with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EPointMarkerType,
    EThemeProviderType,
    EAnnotationType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const xValues = [];
  const yValues = [];
  for( let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(i % 5 === 0 ? NaN : 0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.ScatterSeries,
        xyData: {
          xValues,
          yValues
        },
        options: {
          pointMarker: {
            type: EPointMarkerType.Ellipse,
            options: {
              width: 7,
              height: 7,
              strokeThickness: 1,
              fill: "steelblue",
              stroke: "LightSteelBlue",
            }
          },
        }
      }
    ],
    annotations: [
      { type: EAnnotationType.SVGTextAnnotation, options: { x1: 30, y1: -0.65, text: "Gaps occur where Y = NaN", textColor: "LightSteelBlue", fontSize: 16 }},
      { type: EAnnotationType.RenderContextLineAnnotation, options: { x1: 50, x2: 64, y1: -0.7, y2: -0.75, stroke: "LightSteelBlue", strokeThickness: 2 }}
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
