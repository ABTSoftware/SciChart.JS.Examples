import { ChartModifierBase2D } from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import { ModifierMouseArgs } from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import { Point } from "scichart/Core/Point";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { translateFromCanvasToSeriesViewRect } from "scichart/utils/translate";
import { ENearestPointLogic } from "scichart/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider";

type TDataPoint = {
  index: number;
  xValue: number;
  yValue: number;
};

// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class HeatMapSeriesSelectionModifier extends ChartModifierBase2D {
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
    // Pixel COORDINATE MODE EXAMPLE
    // this.selectionAnnotation = new BoxAnnotation({
    //   yCoordinateMode: ECoordinateMode.Pixel,
    //   xCoordinateMode: ECoordinateMode.Pixel,
    //   fill: "#ffffff33",
    //   strokeThickness: 0
    // });

    // DataValue COORDINATE MODE EXAMPLE
    this.selectionAnnotation = new BoxAnnotation({
      yCoordinateMode: ECoordinateMode.DataValue,
      xCoordinateMode: ECoordinateMode.DataValue,
      fill: "#ffffff33",
      strokeThickness: 0
    });
  }

  // Called when mouse-down on the chart
  public modifierMouseDown(args: ModifierMouseArgs): void {
    super.modifierMouseDown(args);

    if (this.executeOn !== args.button) {
      return;
    }

    // Point coordinates relative to series view rectangle.
    const translatedPoint = translateFromCanvasToSeriesViewRect(
      args.mousePoint,
      this.parentSurface.seriesViewRect
    );
    this.startPoint = args.mousePoint;
    this.endPoint = args.mousePoint;
    if (translatedPoint) {
      // Pixel COORDINATE MODE EXAMPLE
      // this.selectionAnnotation.x1 = translatedPoint.x;
      // this.selectionAnnotation.x2 = translatedPoint.x;
      // this.selectionAnnotation.y1 = translatedPoint.y;
      // this.selectionAnnotation.y2 = translatedPoint.y;

      // DataValue COORDINATE MODE EXAMPLE
      const { xCalc, yCalc } = this.getDefaultCoordCalculators();
      if (!xCalc) {
        return;
      }
      this.selectionAnnotation.x1 = xCalc.getDataValue(translatedPoint.x);
      this.selectionAnnotation.x2 = xCalc.getDataValue(translatedPoint.x);
      this.selectionAnnotation.y1 = yCalc.getDataValue(translatedPoint.y);
      this.selectionAnnotation.y2 = yCalc.getDataValue(translatedPoint.y);

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

    this.endPoint = args.mousePoint;
    if (translatedPoint && this.isSelecting) {
      // Pixel COORDINATE MODE EXAMPLE
      // this.selectionAnnotation.x2 = translatedPoint.x;
      // this.selectionAnnotation.y2 = translatedPoint.y;

      // DataValue COORDINATE MODE EXAMPLE
      const { xCalc, yCalc } = this.getDefaultCoordCalculators();
      if (!xCalc) {
        return;
      }
      this.selectionAnnotation.x2 = xCalc.getDataValue(translatedPoint.x);
      this.selectionAnnotation.y2 = yCalc.getDataValue(translatedPoint.y);
    }
  }

  // Called when mouse-up on the chart
  public modifierMouseUp(args: ModifierMouseArgs) {
    super.modifierMouseUp(args);

    if (this.executeOn !== args.button) {
      return;
    }

    this.isSelecting = false;
    this.performSelection();
    this.startPoint = undefined;
    this.endPoint = undefined;
  }

  private performSelection() {
    this.selectedPoints = [];
    if (!(this.startPoint && this.endPoint)) {
      return;
    }
    const firstRendSeries = this.parentSurface.renderableSeries.get(0);

    const startPointInfo = firstRendSeries.hitTestProvider.hitTest(
      this.startPoint,
      ENearestPointLogic.NearestPoint2D,
      0,
      false
    );
    const endPointInfo = firstRendSeries.hitTestProvider.hitTest(
      this.endPoint,
      ENearestPointLogic.NearestPoint2D,
      0,
      false
    );

    console.log(firstRendSeries.dataSeries.dataSeriesName);
    console.log("startPointInfo", startPointInfo.hitTestPointValues);
    console.log("xIndex start", Math.floor(startPointInfo.hitTestPointValues.x));
    console.log("yIndex start", Math.floor(startPointInfo.hitTestPointValues.y));
    console.log("endPointInfo", endPointInfo.hitTestPointValues);
    console.log("xIndex end", Math.floor(endPointInfo.hitTestPointValues.x));
    console.log("yIndex end", Math.floor(endPointInfo.hitTestPointValues.y));
  }

  private getDefaultCoordCalculators() {
    const xAxis = this.parentSurface.xAxes.get(0);
    const yAxis = this.parentSurface.yAxes.get(0);
    if (!xAxis || !yAxis) {
      return { xCalc: undefined, yCalc: undefined };
    }

    const xCalc = xAxis.getCurrentCoordinateCalculator();
    const yCalc = yAxis.getCurrentCoordinateCalculator();

    return { xCalc, yCalc };
  }
}
