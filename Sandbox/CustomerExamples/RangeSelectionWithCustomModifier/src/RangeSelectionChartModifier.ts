import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import {Point} from "scichart/Core/Point";
import {BoxAnnotation} from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";

// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class RangeSelectionChartModifier extends ChartModifierBase2D {

    private startPoint: Point;
    private endPoint: Point;
    private readonly selectionAnnotation: BoxAnnotation;
    private isSelecting: boolean;

    constructor() {
        super();

        // Create an annotation with YCoordinateMode Relative, and Y1, Y2 = 0,1
        // This stretches the annotation to fit the viewport in the Y-direction
        // Below in modifierMouseMove we will be updating the annotation X-values as the mouse is moved.
        this.selectionAnnotation = new BoxAnnotation({
            yCoordinateMode: ECoordinateMode.Relative,
            y1: 0,
            y2: 1,
            xCoordinateMode: ECoordinateMode.Pixel,
            fill: "#ffffff33",
            stroke: "#333333ff",
        });
    }

    // Called when mouse-down on the chart
    public modifierMouseDown(args: ModifierMouseArgs): void{
        super.modifierMouseDown(args);
        this.startPoint = args.mousePoint;
        this.endPoint = args.mousePoint;

        this.selectionAnnotation.x1 = this.startPoint.x;
        this.selectionAnnotation.x2 = this.endPoint.x;
        this.isSelecting = true;

        this.parentSurface.annotations.add(this.selectionAnnotation);
    }

    // Called when mouse-move on the chart
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);

        if (this.isSelecting) {
            this.endPoint = args.mousePoint;
            this.selectionAnnotation.x2 = this.endPoint.x;
        }
    }

    // Called when mouse-up on the chart
    public modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);

        this.isSelecting = false;
        this.parentSurface.annotations.remove(this.selectionAnnotation);
    }
}
