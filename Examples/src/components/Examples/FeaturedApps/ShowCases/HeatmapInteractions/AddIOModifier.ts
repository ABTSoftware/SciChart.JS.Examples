import {
    ChartModifierBase2D,
    TextAnnotation,
    Point,
    ECoordinateMode,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    EDraggingGripPoint,
    ModifierMouseArgs,
    translateFromCanvasToSeriesViewRect,
    DpiHelper,
} from "scichart";

export class AddIOModifier extends ChartModifierBase2D {
    public readonly type = "AddIOModifier";
    private addInputAnnotation: TextAnnotation;
    private addOutputAnnotation: TextAnnotation;
    private originalPoint: Point;

    public onAttach(): void {
        super.onAttach();
        this.addInputAnnotation = new TextAnnotation({
            text: "Add Input",
            textColor: "#FFFFFF",
            isHidden: true,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            yCoordShift: -5,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        });
        this.addInputAnnotation.canDragPoint = (draggingPoint: EDraggingGripPoint) => false;
        this.addOutputAnnotation = new TextAnnotation({
            text: "Add Output",
            textColor: "#FFFFFF",
            isHidden: true,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            yCoordShift: 5,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        });
        this.addOutputAnnotation.canDragPoint = (draggingPoint: EDraggingGripPoint) => false;
        this.parentSurface.modifierAnnotations.add(this.addInputAnnotation, this.addOutputAnnotation);
    }

    public onDetach(): void {
        super.onDetach();
        this.parentSurface.modifierAnnotations.remove(this.addInputAnnotation);
        this.parentSurface.modifierAnnotations.remove(this.addOutputAnnotation);
    }

    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        if (args.button !== this.executeOn) return;

        const currentPoint = translateFromCanvasToSeriesViewRect(
            args.mousePoint,
            this.parentSurface.seriesViewRect,
            false
        );
        if (!currentPoint) return;
        const scaledPoint = new Point(currentPoint.x / DpiHelper.PIXEL_RATIO, currentPoint.y / DpiHelper.PIXEL_RATIO);
        this.addInputAnnotation.x1 = scaledPoint.x;
        this.addInputAnnotation.y1 = scaledPoint.y;
        this.addInputAnnotation.isHidden = false;
        this.addOutputAnnotation.x1 = scaledPoint.x;
        this.addOutputAnnotation.y1 = scaledPoint.y;
        this.addOutputAnnotation.isHidden = false;
        this.originalPoint = currentPoint;

        args.handled = true;
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        if (!this.originalPoint) return;
        this.addInputAnnotation.isSelected = this.addInputAnnotation.clickToSelect(args);
        this.addOutputAnnotation.isSelected = this.addOutputAnnotation.clickToSelect(args);
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        if (this.addInputAnnotation.isSelected) {
            const x = this.parentSurface.xAxes
                .get(0)
                .getCurrentCoordinateCalculator()
                .getDataValue(this.originalPoint.x);
            const y = this.parentSurface.yAxes
                .get(0)
                .getCurrentCoordinateCalculator()
                .getDataValue(this.originalPoint.y);
            this.onAddInput(x, y);
        } else if (this.addOutputAnnotation.isSelected) {
            const x = this.parentSurface.xAxes
                .get(0)
                .getCurrentCoordinateCalculator()
                .getDataValue(this.originalPoint.x);
            const y = this.parentSurface.yAxes
                .get(0)
                .getCurrentCoordinateCalculator()
                .getDataValue(this.originalPoint.y);
            this.onAddOutput(x, y);
        }
        this.addInputAnnotation.isSelected = false;
        this.addOutputAnnotation.isSelected = false;
        this.addInputAnnotation.isHidden = true;
        this.addOutputAnnotation.isHidden = true;
        this.originalPoint = undefined;
    }

    public onAddInput(x: number, y: number) {}

    public onAddOutput(x: number, y: number) {}

    public onRemoveSelected() {}
}
