async function simpleColumnChartWithGaps(divElementId) {
  // Demonstrates how to create a Column chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastColumnRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    TextAnnotation,
    LineAnnotation
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region ExampleA
  // Create some data
  const xValues = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
  const yValues = [0.1, 0.2, 0.4, 0.8, NaN, 1.5, 2.4, 4.6, 8.1, NaN, 14.4,
    16.0, 13.7, 10.1, NaN, 3.5, 2.5, 1.4, 0.4, 0.1];

  // Create and add a column series
  const columnSeries = new FastColumnRenderableSeries(wasmContext, {
    fill: "rgba(176, 196, 222, 0.5)",
    stroke: "rgba(176, 196, 222, 1)",
    strokeThickness: 2,
    dataPointWidth: 0.7,
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues})
  });

  sciChartSurface.renderableSeries.add(columnSeries);
  // #endregion

  sciChartSurface.annotations.add(new TextAnnotation({ x1: 1, y1: 12, text: "Gaps occur where Y = NaN", textColor: "#EC0F6C", fontSize: 16 }));
  sciChartSurface.annotations.add(new LineAnnotation({ x1: 4, x2: 9, y1: 11, y2: 2, stroke: "#EC0F6C", strokeThickness: 2 }));
};

simpleColumnChartWithGaps("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EAnnotationType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  // Create some data
  const xValues = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
  const yValues = [0.1, 0.2, 0.4, 0.8, NaN, 1.5, 2.4, 4.6, 8.1, NaN, 14.4,
    16.0, 13.7, 10.1, NaN, 3.5, 2.5, 1.4, 0.4, 0.1];

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
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
          dataPointWidth: 0.7,
        }
      }
    ],
    annotations: [
      { type: EAnnotationType.SVGTextAnnotation, options: { x1: 1, y1: 9, text: "Gaps occur where Y = NaN", textColor: "LightSteelBlue", fontSize: 16 }},
      { type: EAnnotationType.RenderContextLineAnnotation, options: { x1: 2, x2: 4, y1: 8, y2: 2, stroke: "LightSteelBlue", strokeThickness: 2 }}
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
