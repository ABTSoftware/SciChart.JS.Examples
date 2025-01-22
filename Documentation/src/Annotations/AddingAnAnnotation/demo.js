// #region ExampleA
const {
  BoxAnnotation,
  NumericAxis,
  SciChartSurface,
  NumberRange,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  ECoordinateMode,
  SciChartJsNavyTheme,
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Add a selection of annotations to the chart
  sciChartSurface.annotations.add(
    new LineAnnotation({
      stroke: "#FF6600",
      strokeThickness: 3,
      x1: 2.0,
      x2: 8.0,
      y1: 3.0,
      y2: 7.0,
    }),
    new BoxAnnotation({
      stroke: "#FF3333",
      strokeThickness: 1,
      fill: "rgba(255,50,50,0.3)",
      x1: 2.0,
      x2: 8.0,
      y1: 3.0,
      y2: 7.0,
    }),
    new BoxAnnotation({
      stroke: "#33FF33",
      strokeThickness: 1,
      fill: "rgba(50, 255, 50, 0.3)",
      x1: 3.0,
      x2: 9.0,
      y1: 4.0,
      y2: 8.0,
    }),
    new TextAnnotation({
      x1: 100,
      y1: 0.5,
      xCoordinateMode: ECoordinateMode.Pixel,
      yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
      verticalAnchorPoint: EVerticalAnchorPoint.Center,
      textColor: "yellow",
      fontSize: 26,
      fontFamily: "Arial",
      text: "TEXT ANNOTATION",
    })
  );
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
  // #region ExampleB
  const { chartBuilder, EAnnotationType, ECoordinateMode } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      annotations: [
        {
          type: EAnnotationType.RenderContextBoxAnnotation,
          options: {
            stroke: "#FF3333",
            strokeThickness: 1,
            fill: "rgba(255,50,50,0.3)",
            x1: 2.0,
            x2: 8.0,
            y1: 3.0,
            y2: 7.0,
          },
        },
        {
          type: EAnnotationType.RenderContextBoxAnnotation,
          options: {
            stroke: "#33FF33",
            strokeThickness: 1,
            fill: "rgba(50,255,50,0.3)",
            x1: 3.0,
            x2: 9.0,
            y1: 4.0,
            y2: 8.0,
          },
        },
        {
          type: EAnnotationType.SVGTextAnnotation,
          options: {
            x1: 100,
            y1: 0.5,
            xCoordinateMode: "Pixel",
            yCoordinateMode: "Relative",
            horizontalAnchorPoint: "Left",
            verticalAnchorPoint: "Center",
            textColor: "yellow",
            fontSize: 26,
            fontFamily: "Times New Roman",
            text: "TEXT ANNOTATION",
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
