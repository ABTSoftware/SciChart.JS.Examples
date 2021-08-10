import { ModifierMouseArgs } from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { translateFromCanvasToSeriesViewRect } from "scichart/utils/translate";

const DELTA = 100;

export class MouseButtonZoomChartModifier extends MouseWheelZoomModifier {
  constructor() {
    super();
  }

  public modifierMouseWheel(args: ModifierMouseArgs): void {
    // Do nothing
  }

  public modifierMouseDown(args: ModifierMouseArgs) {
    super.modifierMouseDown(args);
    args.handled = true;

    const zoomPoint = translateFromCanvasToSeriesViewRect(
      args.mousePoint,
      this.parentSurface.seriesViewRect
    );
    if (zoomPoint) {
      if (args.button === 0) {
        this.performZoom(zoomPoint, DELTA);
      } else if (args.button === 2) {
        this.performZoom(zoomPoint, -DELTA);
      }
    }
  }
}
