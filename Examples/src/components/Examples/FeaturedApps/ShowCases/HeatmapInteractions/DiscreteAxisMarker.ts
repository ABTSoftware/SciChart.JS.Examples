import { AxisMarkerAnnotation, ModifierMouseArgs, Point, AnnotationDragDeltaEventArgs } from "scichart";

export class DiscreteAxisMarker extends AxisMarkerAnnotation {
    public stepSize = 500;
    public minValue = 0;
    public maxValue = 30000;

    public onDragAdorner(args: ModifierMouseArgs): void {
        const xyValues = this.getValuesFromCoordinates(args.mousePoint, true);
        if (xyValues) {
            let { x, y } = xyValues;
            if (this.x1 !== undefined) {
                x = Math.floor(x / this.stepSize) * this.stepSize;
            } else if (this.y1 !== undefined) {
                y = Math.floor(y / this.stepSize) * this.stepSize;
            }
            this.calcDragDistance(new Point(x, y));
            if (this.x1 !== undefined) {
                this.x1 = Math.min(Math.max(this.x1, this.minValue), this.maxValue);
            } else if (this.y1 !== undefined) {
                this.y1 = Math.min(Math.max(this.y1, this.minValue), this.maxValue);
            }
        }
        this.dragDelta.raiseEvent(new AnnotationDragDeltaEventArgs());
    }
}
