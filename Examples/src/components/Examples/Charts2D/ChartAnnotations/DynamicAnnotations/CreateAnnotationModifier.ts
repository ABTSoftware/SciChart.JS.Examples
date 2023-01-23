import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import {Point} from "scichart/Core/Point";
import { AnnotationBase, ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { translateFromCanvasToSeriesViewRect } from "scichart/utils/translate";
import { AnnotationClickEventArgs } from "scichart/Charting/Visuals/Annotations/AnnotationClickEventArgs";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { EExecuteOn } from "scichart/types/ExecuteOn";

// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class CreateAnnotationModifier extends ChartModifierBase2D {
    public readonly type: string = "CreateAnnotationModifier";

    private editingAnnotation: AnnotationBase;
    private startPoint: Point;

    constructor() {
        super();
    }

    // The annotation to be created
    public createAnnotation(): AnnotationBase {
        return new BoxAnnotation({
            // Make the created annotation editable 
            isEditable: true,
            // Make it removable on right click
            onClick: (args: AnnotationClickEventArgs) => {
                if (args.mouseArgs.button !== EExecuteOn.MouseRightButton) return;             
                args.sender.parentSurface.annotations.remove(args.sender);
                args.sender.delete();
            }
        });
    }

    // Called when mouse-down on the chart
    public modifierMouseDown(args: ModifierMouseArgs): void{
        super.modifierMouseDown(args);
        const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
        if (!this.editingAnnotation) {
            // If no editingAnnotation, then add one
            this.addAnnotation(point);
            this.editingAnnotation.isSelected = true;
            this.startPoint = args.mousePoint;
        }
    }

    //Called when mouse-move on the chart
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        // Update the annotation
        if (this.editingAnnotation) {
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            this.updateAnnotation(point);
        }
    }

    // Called when mouse-up on the chart
    public modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);
        if (this.editingAnnotation) {
            // If already editingAnnotation, then end the creation and reset flags
            const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            this.updateAnnotation(point);
            // Remove the annotation if it is below a minimum size
            if (Math.abs(args.mousePoint.x - this.startPoint.x) < 5 && Math.abs(args.mousePoint.y - this.startPoint.y) < 5) {
                this.parentSurface.annotations.remove(this.editingAnnotation);
                this.editingAnnotation.delete();
            }
            this.editingAnnotation.isSelected = false;
            this.editingAnnotation = undefined;
        }
    }

    private addAnnotation(mousePoint: Point) {
        // Create an annotation and assign X,Y axis id
        // Use builder api to create annotations based on a type
        this.editingAnnotation = this.createAnnotation();
        this.editingAnnotation.xAxisId = this.xAxisId;
        this.editingAnnotation.yAxisId = this.yAxisId;

        let xCoord = mousePoint.x;
        let yCoord = mousePoint.y;
        // Set the X,Y coords of the annotation. Note that the pixel coordinates of the mouse-down
        // event must be translated to data-coordinates if ECoordinateMode.DataValue
        if (this.editingAnnotation.xCoordinateMode == ECoordinateMode.DataValue) {
            const xAxis = this.parentSurface.xAxes.getById(this.xAxisId);
            xCoord = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        }
        this.editingAnnotation.x1 = xCoord;
        this.editingAnnotation.x2 = xCoord;

        if (this.editingAnnotation.yCoordinateMode == ECoordinateMode.DataValue) {
            const yAxis = this.parentSurface.yAxes.getById(this.yAxisId);
            yCoord = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);
        }
        this.editingAnnotation.y1 = yCoord;
        this.editingAnnotation.y2 = yCoord;

        // Add the annotation to the surface
        this.parentSurface.annotations.add(this.editingAnnotation);
    }

    private updateAnnotation(mousePoint: Point) {
        // Update the position of an annotation using its X,Y Axis and the
        // coordinate calculator to transform to coordinate
        if (this.editingAnnotation.xCoordinateMode == ECoordinateMode.DataValue) {
            const xAxis = this.parentSurface.getXAxisById(this.editingAnnotation.xAxisId);
            this.editingAnnotation.x2 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        } else {
            this.editingAnnotation.x2 = mousePoint.x;
        }
        if (this.editingAnnotation.yCoordinateMode == ECoordinateMode.DataValue) {
            const yAxis = this.parentSurface.getYAxisById(this.editingAnnotation.yAxisId);
            this.editingAnnotation.y2 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);
        } else {
            this.editingAnnotation.y2 = mousePoint.y;
        }  
    }
}
