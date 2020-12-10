import { ChartModifierBase2D } from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import { ModifierMouseArgs } from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import { Point } from "scichart/Core/Point";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { translateFromCanvasToSeriesViewRect } from "scichart/utils/translate";
import { testIsInBounds } from "scichart/utils/pointUtil";

type TDataPoint = {
  index: number;
  xValue: number;
  yValue: number;
};

// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class SimpleDataPointSelectionModifier extends ChartModifierBase2D {
  private startPoint: Point;
  private endPoint: Point;
  private readonly selectionAnnotation: BoxAnnotation;
  private isSelecting: boolean;
  private selectedPoints: TDataPoint[][] = [];

  constructor() {
    super();

    // Create an annotation with YCoordinateMode Relative, and Y1, Y2 = 0,1
    // This stretches the annotation to fit the viewport in the Y-direction
    // Below in modifierMouseMove we will be updating the annotation X-values as the mouse is moved.
    this.selectionAnnotation = new BoxAnnotation({
      yCoordinateMode: ECoordinateMode.Pixel,
      xCoordinateMode: ECoordinateMode.Pixel,
      fill: "#ffffff33",
      strokeThickness: 0
    });
  }

  // Called when mouse-down on the chart
  public modifierMouseDown(args: ModifierMouseArgs): void {
    super.modifierMouseDown(args);
    // Point coordinates relative to series view rectangle.
    const translatedPoint = translateFromCanvasToSeriesViewRect(
      args.mousePoint,
      this.parentSurface.seriesViewRect
    );
    if (translatedPoint) {
      this.startPoint = translatedPoint;
      this.endPoint = translatedPoint;

      this.selectionAnnotation.x1 = translatedPoint.x;
      this.selectionAnnotation.x2 = translatedPoint.x;
      this.selectionAnnotation.y1 = translatedPoint.y;
      this.selectionAnnotation.y2 = translatedPoint.y;
      this.isSelecting = true;

      this.parentSurface.annotations.remove(this.selectionAnnotation);
      this.parentSurface.annotations.add(this.selectionAnnotation);
    }
  }

  // Called when mouse-move on the chart
  public modifierMouseMove(args: ModifierMouseArgs): void {
    super.modifierMouseMove(args);
    const translatedPoint = translateFromCanvasToSeriesViewRect(
      args.mousePoint,
      this.parentSurface.seriesViewRect
    );

    if (translatedPoint && this.isSelecting) {
      this.endPoint = args.mousePoint;
      this.selectionAnnotation.x2 = translatedPoint.x;
      this.selectionAnnotation.y2 = translatedPoint.y;
    }
  }

  // Called when mouse-up on the chart
  public modifierMouseUp(args: ModifierMouseArgs) {
    super.modifierMouseUp(args);
    this.isSelecting = false;
    this.performSelection();
    console.log("selectedPoints", this.selectedPoints);
    document.getElementById("result").innerText = JSON.stringify(
      this.selectedPoints,
      null,
      4
    );
    this.startPoint = undefined;
    this.endPoint = undefined;
  }

  private performSelection() {
    this.selectedPoints = [];
    if (!(this.startPoint && this.endPoint)) {
      return;
    }

    this.parentSurface.renderableSeries
      .asArray()
      .filter(rs => rs.isVisible)
      .forEach((rs, index) => {
        this.selectedPoints[index] = [];
        const dataSeries = rs.dataSeries;
        if (!dataSeries) {
          return;
        }

        const xCalc = rs.xAxis.getCurrentCoordinateCalculator();
        const yCalc = rs.yAxis.getCurrentCoordinateCalculator();

        // Find the bounds of the data inside the rectangle
        let leftXData, rightXData;
        if (
          xCalc.getDataValue(this.startPoint.x) <=
          xCalc.getDataValue(this.endPoint.x)
        ) {
          leftXData = xCalc.getDataValue(this.startPoint.x);
          rightXData = xCalc.getDataValue(this.endPoint.x);
        } else {
          leftXData = xCalc.getDataValue(this.endPoint.x);
          rightXData = xCalc.getDataValue(this.startPoint.x);
        }
        let bottomYData, topYData;
        if (
          yCalc.getDataValue(this.startPoint.y) <=
          yCalc.getDataValue(this.endPoint.y)
        ) {
          bottomYData = yCalc.getDataValue(this.startPoint.y);
          topYData = yCalc.getDataValue(this.endPoint.y);
        } else {
          bottomYData = yCalc.getDataValue(this.endPoint.y);
          topYData = yCalc.getDataValue(this.startPoint.y);
        }

        for (let i = 0; i < dataSeries.count(); i++) {
          const x = dataSeries.getNativeXValues().get(i);
          const y = dataSeries.getNativeYValues().get(i);
          if (
            testIsInBounds(x, y, leftXData, topYData, rightXData, bottomYData)
          ) {
            this.selectedPoints[index].push({
              index: i,
              xValue: x,
              yValue: y
            });
          }
        }
      });
  }
}
