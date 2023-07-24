async function annotationLayers(divElementId) {
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
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
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries
  });

  sciChartSurface.renderableSeries.add(lineSeries);

  // #region ExampleA
  // Demonstrates the effect of annotationLayer when adding annotations
  const {
    BoxAnnotation,
    EAnnotationLayer,
  } = SciChart;

  const aboveChart = new BoxAnnotation({
      annotationLayer: EAnnotationLayer.AboveChart,
      fill: "#87ceeb",
      strokeThickness: 0,
      x1: 65,
      x2: 85,
      y1: -0.55,
      y2: -0.7
  });

  const belowChart = new BoxAnnotation({
    annotationLayer: EAnnotationLayer.BelowChart,
    fill: "#98fb98",
    strokeThickness: 0,
    x1: 10,
    x2: 30,
    y1: -0.75,
    y2: -0.9
  });

  const background = new BoxAnnotation({
    annotationLayer: EAnnotationLayer.Background,
    fill: "#dda0dd",
    strokeThickness: 0,
    x1: 50,
    x2: 70,
    y1: -0.85,
    y2: -1.0
  });

  sciChartSurface.annotations.add(aboveChart, belowChart, background);
  // #endregion

  const {
    NativeTextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
  } = SciChart;

  const aboveText = new NativeTextAnnotation({
    text: "EAnnotationLayer.AboveChart\nIn front of Series",
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
    x1: 75,
    y1: -0.55,
  });
  const belowText = new NativeTextAnnotation({
    text: "EAnnotationLayer.BelowChart\nBehind Series",
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
    x1: 20,
    y1: -0.75,
  });
  const backgroundText = new NativeTextAnnotation({
    text: "EAnnotationLayer.Background\nBehind Gridlines",
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
    x1: 60,
    y1: -0.85,
  });
  sciChartSurface.annotations.add(aboveText, belowText, backgroundText);

};

annotationLayers("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EAnnotationType,
    EAnnotationLayer,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Navy } },
    series: [
      {
        type: ESeriesType.SplineLineSeries,
        xyData: {
          xValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          yValues: [-1, -0.9, -0.8, -0.9, -1.1, -1.1, -0.9, -0.6, -0.5, -0.6, -0.7]
        },
        options: {
          stroke: "#FF6600",
          strokeThickness: 5,
        }
      }
    ],
    annotations: [
      { type: EAnnotationType.RenderContextBoxAnnotation, options: {
          annotationLayer: EAnnotationLayer.AboveChart,
          fill: "#87ceeb",
          strokeThickness: 0,
          x1: 65,
          x2: 85,
          y1: -0.55,
          y2: -0.7
      }},
  
      { type: EAnnotationType.RenderContextBoxAnnotation, options: {
        annotationLayer: EAnnotationLayer.BelowChart,
        fill: "#98fb98",
        strokeThickness: 0,
        x1: 10,
        x2: 30,
        y1: -0.75,
        y2: -0.9
      }},
  
      { type: EAnnotationType.RenderContextBoxAnnotation, options: {
          annotationLayer: EAnnotationLayer.Background,
          fill: "#dda0dd",
          strokeThickness: 0,
          x1: 50,
          x2: 70,
          y1: -0.85,
          y2: -1.0
      }},
      { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
        text: "EAnnotationLayer.AboveChart\nIn front of Series",
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        x1: 75,
        y1: -0.55,
      }},
      { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
        text: "EAnnotationLayer.BelowChart\nBehind Series",
        fonstSize: 24,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        x1: 20,
        y1: -0.75,
      }},
      { type: EAnnotationType.RenderContextNativeTextAnnotation, options: {
        text: "EAnnotationLayer.Background\nBehind Gridlines",
        fonstSize: 24,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        x1: 60,
        y1: -0.85,
      }}
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
