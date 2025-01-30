const {
  TextAnnotation,
  NumericAxis,
  SciChartSurface,
  SciChartJsNavyTheme,
  ECoordinateMode,
  EHorizontalAnchorPoint,
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
  // A TextAnnotation which can be dragged and updates its value on drag

  const textAnnotation = new TextAnnotation({
    x1: 1,
    y1: 3,
    fontSize: 24,
    fontFamily: "Arial",
    text: "{{ DRAG ME! }}",
    isEditable: true,
  });

  textAnnotation.dragDelta.subscribe((args) => {
    textAnnotation.text = `I was dragged to ${textAnnotation.x1.toFixed(
      2
    )}, ${textAnnotation.y1.toFixed(2)}`;
  });

  sciChartSurface.annotations.add(textAnnotation);
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
    "Editable Text Annotations",
    "Drag the text annotation to see the value update"
  );
}

addAnnotationToChart("scichart-root");
