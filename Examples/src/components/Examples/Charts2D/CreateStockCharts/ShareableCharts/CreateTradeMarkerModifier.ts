import { ChartModifierBase2D } from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import { ModifierMouseArgs } from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import { Point } from "scichart/Core/Point";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { IAnnotation } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import {
    CustomAnnotation,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    EExecuteOn,
    translateFromCanvasToSeriesViewRect,
    AnnotationClickEventArgs,
    registerFunction,
    EBaseType,
} from "scichart";
import { appTheme } from "../../../theme";

const deleteOnClick = (args: AnnotationClickEventArgs) => {
    if (args.sender.isSelected && args.mouseArgs.ctrlKey) {
        args.sender.parentSurface.annotations.remove(args.sender, true);
    }
};

registerFunction(EBaseType.OptionFunction, "deleteOnClick", deleteOnClick);

// Returns a CustomAnnotation that represents a buy marker arrow
const buyMarkerAnnotation = (): CustomAnnotation => {
    return new CustomAnnotation({
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        isEditable: true,
        onClick: "deleteOnClick",
        svgString: `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-54.867218,-75.091687)">
                    <path style="fill:${appTheme.VividGreen};fill-opacity:0.77;stroke:${appTheme.VividGreen};stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                        d="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,-7.408333 7.158904,-7.408333 l 7.158906,7.408333 H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"
                    "/>
                </g>
            </svg>`,
    });
};

// Returns a CustomAnnotation that represents a sell marker arrow
const sellMarkerAnnotation = (): CustomAnnotation => {
    return new CustomAnnotation({
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        isEditable: true,
        onClick: "deleteOnClick",
        svgString: `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-54.616083,-75.548914)">
                    <path style="fill:${appTheme.VividRed};fill-opacity:0.77;stroke:${appTheme.VividRed};stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                    d="m 55.47431,87.025547 c 7.158904,7.408333 7.158904,7.408333 7.158904,7.408333 L 69.79212,87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"
                    />
                </g>
            </svg>`,
    });
};

// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class CreateTradeMarkerModifier extends ChartModifierBase2D {
    public readonly type: string = "CreateTradeMarkerModifier";
    private editingAnnotation: IAnnotation;

    public createAnnotation(isBuy: boolean) {
        return isBuy ? buyMarkerAnnotation() : sellMarkerAnnotation();
    }

    // Called when mouse-down on the chart
    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        if (!this.editingAnnotation && !args.ctrlKey) {
            // If no editingAnnotation, then begin create one
            this.editingAnnotation = this.createAnnotation(args.button === EExecuteOn.MouseLeftButton);

            const hitTestInfo = this.parentSurface.renderableSeries
                .get(0)
                .hitTestProvider.hitTestXSlice(args.mousePoint.x, args.mousePoint.y);

            this.beginCreateAnnotation(new Point(hitTestInfo.xCoord, hitTestInfo.yCoord));
        }
    }

    // Called when mouse-move on the chart
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);

        // Update the annotation
        if (this.editingAnnotation) {
            const hitTestInfo = this.parentSurface.renderableSeries
                .get(0)
                .hitTestProvider.hitTestXSlice(args.mousePoint.x, args.mousePoint.y);
            this.updateAnnotation(new Point(hitTestInfo.xCoord, hitTestInfo.yCoord));
        }
    }

    // Called when mouse-up on the chart
    public modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);
        if (this.editingAnnotation) {
            // If already editingAnnotation, then end the creation and reset flags
            const hitTestInfo = this.parentSurface.renderableSeries
                .get(0)
                .hitTestProvider.hitTestXSlice(args.mousePoint.x, args.mousePoint.y);
            this.updateAnnotation(new Point(hitTestInfo.xCoord, hitTestInfo.yCoord));
            this.editingAnnotation = undefined;
        }
    }

    private beginCreateAnnotation(mousePoint: Point) {
        // Assumes that the parent chart has a single x & y axis.
        // You will need to include more logic here for multi axis surfaces
        const xAxis = this.parentSurface.xAxes.get(0);
        const yAxis = this.parentSurface.yAxes.get(0);

        // assign X,Y axis id
        this.editingAnnotation.xAxisId = xAxis.id;
        this.editingAnnotation.yAxisId = yAxis.id;
        // Set the X,Y coords of the annotation. Note that the pixel coordinates of the mouse-down
        // event must be translated to data-coordinates so that the annotation is placed on the chart
        this.editingAnnotation.x1 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        //this.editingAnnotation.x2 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        this.editingAnnotation.y1 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);
        //this.editingAnnotation.y2 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);

        // Add the annotation to the surface
        this.parentSurface.annotations.add(this.editingAnnotation);
    }

    private updateAnnotation(mousePoint: Point) {
        // Update the position of an annotation using its X,Y Axis and the
        // coordinate calculator to transform to coordinate
        const xAxis = this.parentSurface.getXAxisById(this.editingAnnotation.xAxisId);
        const yAxis = this.parentSurface.getYAxisById(this.editingAnnotation.yAxisId);
        this.editingAnnotation.x1 = xAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.x);
        this.editingAnnotation.y1 = yAxis.getCurrentCoordinateCalculator().getDataValue(mousePoint.y);
    }
}
