const {
  BoxAnnotation,
  TextAnnotation,
  EXyDirection,
  ECoordinateMode,
  EHorizontalAnchorPoint,
  NumericAxis,
  SciChartSurface,
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
  // A box annotation which can only be dragged in the X-direction
  const boxAnnotation = new BoxAnnotation({
    x1: 3,
    x2: 7,
    y1: 3,
    y2: 7,
    isEditable: true,
    isSelected: true,
    // Restricts resize direction in the X-direction only
    resizeDirections: EXyDirection.XDirection,
  });
  // Restricts drag direction in the X-direction only
  boxAnnotation.dragDelta.subscribe((arg) => {
    boxAnnotation.y1 = 3;
    boxAnnotation.y2 = 7;
  });
  sciChartSurface.annotations.add(boxAnnotation);
  // #endregion

  const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
    sciChartSurface.annotations.add(
      new TextAnnotation({
        text: titleText,
        x1: 0.5,
        y1: 0.5,
        yCoordShift: -50,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.5,
        fontSize: 32,
        fontWeight: "Bold",
        textColor: "White",
      })
    );
    sciChartSurface.annotations.add(
      new TextAnnotation({
        text: subTitleText,
        x1: 0.5,
        y1: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.4,
        fontSize: 17,
        textColor: "White",
      })
    );
  };

  addChartTitle(
    sciChartSurface,
    "Restricting Resize Direction",
    "Resize the Box in the X-Direction only"
  );
}

addAnnotationToChart("scichart-root");

async function builderExample(divElementId) {
  // #region ExampleB
  const { chartBuilder, EAnnotationType } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      annotations: [
        {
          type: EAnnotationType.RenderContextBoxAnnotation,
          options: {
            x1: 3,
            x2: 7,
            y1: 3,
            y2: 7,
            isEditable: true,
            isSelected: true,
            // custom resize direction
            resizeDirections: EXyDirection.XDirection,
          },
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
