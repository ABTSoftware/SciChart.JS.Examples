const {
  BoxAnnotation,
  CustomAnnotation,
  LineAnnotation,
  TextAnnotation,
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

  // #region ExampleA
  // Add LineAnnotations with Horizontal and Vertical Stretching
  sciChartSurface.annotations.add(
    new TextAnnotation({
      text: "Horizontally Stretched Line uses xCoordinateMode.Relative",
      x1: 0.1,
      y1: 2.5,
    }),

    new LineAnnotation({
      stroke: "#279B27",
      strokeThickness: 3,
      xCoordinateMode: ECoordinateMode.Relative,
      x1: 0,
      x2: 1,
      yCoordinateMode: ECoordinateMode.DataValue,
      y1: 2,
      y2: 2,
    }),

    new TextAnnotation({
      text: "Vertically Stretched Line uses yCoordinateMode.Relative",
      x1: 2.1,
      y1: 9.2,
    }),

    new LineAnnotation({
      stroke: "#FF1919",
      strokeThickness: 3,
      xCoordinateMode: ECoordinateMode.DataValue,
      x1: 2,
      x2: 2,
      yCoordinateMode: ECoordinateMode.Relative,
      y1: 0.0,
      y2: 1.0,
    })
  );
  // #endregion
}

addAnnotationToChart("scichart-root");

async function builderExample(divElementId) {
  const { chartBuilder, EAnnotationType } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      annotations: [
        {
          type: EAnnotationType.SVGTextAnnotation,
          options: {
            text: "Horizontally Stretched Line uses xCoordinateMode.Relative",
            x1: 0.1,
            y1: 2.5,
          },
        },
        {
          type: EAnnotationType.RenderContextLineAnnotation,
          options: {
            stroke: "#279B27",
            strokeThickness: 3,
            xCoordinateMode: ECoordinateMode.Relative,
            x1: 0,
            x2: 1,
            yCoordinateMode: ECoordinateMode.DataValue,
            y1: 2,
            y2: 2,
          },
        },
        {
          type: EAnnotationType.SVGTextAnnotation,
          options: {
            text: "Vertically Stretched Line uses yCoordinateMode.Relative",
            x1: 2.1,
            y1: 9.2,
          },
        },
        {
          type: EAnnotationType.RenderContextLineAnnotation,
          options: {
            stroke: "#FF1919",
            strokeThickness: 3,
            xCoordinateMode: ECoordinateMode.DataValue,
            x1: 2,
            x2: 2,
            yCoordinateMode: ECoordinateMode.Relative,
            y1: 0.0,
            y2: 1.0,
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
