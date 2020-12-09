import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import {Point} from "scichart/Core/Point";
import {LineAnnotation} from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import {IAnnotation} from "scichart/Charting/Visuals/Annotations/IAnnotation";

// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class CreateAnnotationModifier extends ChartModifierBase2D {
    private editingAnnotation: IAnnotation;

    constructor() {
        super();
    }

    // Called when mouse-down on the chart
    public modifierMouseDown(args: ModifierMouseArgs): void{
        super.modifierMouseDown(args);

        if (!this.editingAnnotation) {
            // If no editingAnnotation, then begin create one
            this.beginCreateAnnotation(args.mousePoint);
        } else {
            // If already editingAnnotation, then end the creation and reset flags
            this.updateAnnotation(args.mousePoint);
            this.editingAnnotation = undefined;
        }
    }

    // Called when mouse-move on the chart
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);

        // Update the annotation
        if (this.editingAnnotation) {
            this.updateAnnotation(args.mousePoint);
        }
    }

    // Called when mouse-up on the chart
    public modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);
    }

    private beginCreateAnnotation(mousePoint: Point) {

        // Assumes that the parent chart has a single x & y axis.
        // You will need to include more logic here for multi axis surfaces
        const xAxis = this.parentSurface.xAxes.get(0);
        const yAxis = this.parentSurface.yAxes.get(0);

        // Create an annotation and assign X,Y axis id
        // If you want to dynamically select which type of annotation to create, consider
        // adding a property to CreateAnnotationModifier to allow you to select type, and a switch statement here.
        this.editingAnnotation = new LineAnnotation();
        this.editingAnnotation.xAxisId = xAxis.id;
        this.editingAnnotation.yAxisId = yAxis.id;

        // Set the X,Y coords of the annotation. Note that the pixel coordinates of the mouse-down
        // event must be translated to data-coordinates so that the annotation is placed on the chart
        this.editingAnnotation.x1 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        this.editingAnnotation.x2 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        this.editingAnnotation.y1 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);
        this.editingAnnotation.y2 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);

        // Add the annotation to the surface
        this.parentSurface.annotations.add(this.editingAnnotation);
    }

    private updateAnnotation(mousePoint: Point) {
        // Update the position of an annotation using its X,Y Axis and the
        // coordinate calculator to transform to coordinate
        const xAxis = this.parentSurface.getXAxisById(this.editingAnnotation.xAxisId);
        const yAxis = this.parentSurface.getYAxisById(this.editingAnnotation.yAxisId);

        this.editingAnnotation.x2 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        this.editingAnnotation.y2 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);
    }
}
