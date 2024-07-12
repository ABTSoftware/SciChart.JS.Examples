import {
    IInnerAxisLayoutStrategyOptions,
    IAnnotation,
    RightAlignedInnerAxisLayoutStrategy,
    AxisBase2D,
    getCoordinateWithCoordinateMode,
    Rect,
    layoutAxisParts,
    CustomChartModifier2D,
    EAutoRange,
    NumericAxis,
    EAxisAlignment,
    BoxAnnotation,
    ECoordinateMode,
    EXyDirection,
    EInnerAxisPlacementCoordinateMode,
    DpiHelper,
    NumberRange,
    EChart2DModifierType,
    IChartModifierBaseOptions,
    ModifierMouseArgs,
    EExecuteOn,
    translateFromCanvasToSeriesViewRect,
} from "scichart";

interface IClippedRightInnerAxesLayoutStrategyOptions extends IInnerAxisLayoutStrategyOptions {
    sizeRefAnnotation: IAnnotation;
}

class ClippedRightInnerAxesLayoutStrategy extends RightAlignedInnerAxisLayoutStrategy {
    public isStacked: boolean = true;
    protected sizeRefAnnotation: IAnnotation;

    constructor(options: IClippedRightInnerAxesLayoutStrategyOptions) {
        super(options);
        this.sizeRefAnnotation = options?.sizeRefAnnotation;
    }

    public layoutAxes(left: number, top: number, right: number, bottom: number, axes: AxisBase2D[]): void {
        if (axes.length === 0) {
            return;
        }

        let rightCoord = right;

        // calculate custom axis position
        if (this.axisPosition !== undefined) {
            const horizontalAxis =
                this.sciChartSurface.getXAxisById(this.orthogonalAxisId) ||
                this.sciChartSurface.getYAxisById(this.orthogonalAxisId);
            if (!horizontalAxis || !horizontalAxis.isHorizontalAxis) {
                throw new Error("orthogonalAxisId should be a valid id of horizontal axis on the surface!");
            }

            const coordinateCalculator = horizontalAxis.getCurrentCoordinateCalculator();
            const absoluteAxisPosition = getCoordinateWithCoordinateMode(
                this.axisPosition,
                coordinateCalculator,
                this.coordinateMode
            );
            const offset = horizontalAxis.parentSurface.seriesViewRect.left;
            rightCoord = absoluteAxisPosition + offset;
        }

        this.layoutAxesFromRightToLeft(left, top, rightCoord, bottom, axes);
    }

    protected layoutAxesFromRightToLeft(
        left: number,
        top: number,
        right: number,
        bottom: number,
        axes: AxisBase2D[]
    ): void {
        let rightOffset = right;
        const spaceWithoutBorders = bottom - top;

        axes.forEach((axis) => {
            const {
                axisLayoutState: { axisSize, additionalLeftSize, additionalRightSize },
            } = axis;

            const axisReservedHeight = this.calculateTotalAxisHeight(axis, spaceWithoutBorders);

            const leftOffset = rightOffset - axisSize - additionalLeftSize - additionalRightSize;

            axis.axisLength = axisReservedHeight;
            axis.viewRect = Rect.createWithCoords(
                leftOffset + additionalLeftSize,
                top + axis.offset,
                rightOffset - additionalRightSize,
                top + axis.offset + axisReservedHeight
            );
            rightOffset = leftOffset;
            layoutAxisParts(axis, this.layoutAxisPartsStrategy);
        });
    }
}

export class VerticalYRulerModifier extends CustomChartModifier2D {
    public type = EChart2DModifierType.Custom;

    public ruler: BoxAnnotation;

    private creating: boolean = false;
    private remove: () => void;

    public modifierMouseDown(args: ModifierMouseArgs): void {
        if (args.button === EExecuteOn.MouseLeftButton && !this.ruler) {
            this.creating = true;
            const pt = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            this.createAnnotation(pt.x, pt.y);
        } else if (args.button === EExecuteOn.MouseRightButton && this.ruler) {
            this.remove();
        }
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        if (this.ruler && this.creating) {
            const pt = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
            this.ruler.x1 = pt.x;
            this.ruler.x2 = pt.x - 50;
            this.ruler.y2 = pt.y;
        }
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        this.creating = false;
    }

    private createAnnotation(horizontalAxisPosition: number, verticalAxisPosition: number) {
        const sciChartSurface = this.parentSurface;
        const wasmContext = sciChartSurface.webAssemblyContext2D;
        const mainXAxis = sciChartSurface.xAxes.get(0);
        const mainYAxis = sciChartSurface.yAxes.get(0);

        const rulerColor = "white";

        const commonOptions = {
            isInnerAxis: true,
            stackedAxisLength: 100,
            keepLabelsWithinAxis: true,
            autoRange: EAutoRange.Never,
            axisTitleStyle: { color: rulerColor },
            majorTickLineStyle: { tickSize: 6, strokeThickness: 2, color: rulerColor },
            minorTickLineStyle: { tickSize: 4, strokeThickness: 1, color: rulerColor },
            labelStyle: { color: rulerColor },
        };

        const rulerXAxis = new NumericAxis(wasmContext, {
            ...commonOptions,
            id: "rulerXAxis",
            axisAlignment: EAxisAlignment.Top,
        });

        const rulerYAxis = new NumericAxis(wasmContext, {
            ...commonOptions,
            id: "rulerYAxis",
            axisAlignment: EAxisAlignment.Right,
        });

        const rulerBoxAnnotation = new BoxAnnotation({
            xAxisId: mainXAxis.id,
            yAxisId: mainYAxis.id,
            x1: horizontalAxisPosition,
            x2: horizontalAxisPosition - 50,
            y1: verticalAxisPosition,
            y2: verticalAxisPosition + 100,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            isEditable: true,
            fill: "transparent",
            resizeDirections: EXyDirection.YDirection,
        });
        this.ruler = rulerBoxAnnotation;

        sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy = new ClippedRightInnerAxesLayoutStrategy({
            coordinateMode: EInnerAxisPlacementCoordinateMode.Pixel,
            axisPosition: verticalAxisPosition * DpiHelper.PIXEL_RATIO,
            sizeRefAnnotation: rulerBoxAnnotation,
        });

        // sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.coordinateMode =
        // EInnerAxisPlacementCoordinateMode.Pixel;
        // sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.axisPosition = horizontalAxisPosition;

        // sciChartSurface.xAxes.add(rulerXAxis);
        sciChartSurface.yAxes.add(rulerYAxis);

        const adjustRuler = () => {
            const { x1, y1, x2, y2 } = rulerBoxAnnotation;
            rulerBoxAnnotation.x2 = rulerBoxAnnotation.x1 - rulerYAxis.viewRect.width;
            sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.axisPosition = x1 * DpiHelper.PIXEL_RATIO;
            rulerYAxis.offset = y1 * DpiHelper.PIXEL_RATIO;
            rulerYAxis.stackedAxisLength = Math.abs(y2 - y1) * DpiHelper.PIXEL_RATIO;
            const rangePerDimensionUnit = mainYAxis.visibleRange.diff / mainYAxis.viewRect.height;
            const rulerHeight = rulerBoxAnnotation.y2 - rulerBoxAnnotation.y1;
            const rulerVisibleRange = new NumberRange(0, rulerHeight * rangePerDimensionUnit * DpiHelper.PIXEL_RATIO);
            rulerYAxis.visibleRange = rulerVisibleRange;
        };

        sciChartSurface.rendered.subscribe(adjustRuler);
        this.remove = () => {
            sciChartSurface.rendered.unsubscribe(adjustRuler);
            sciChartSurface.annotations.remove(rulerBoxAnnotation, true);
            sciChartSurface.yAxes.remove(rulerYAxis, true);
            this.ruler = undefined;
        };
        sciChartSurface.annotations.add(rulerBoxAnnotation);
    }

    public toJSON() {
        const json = super.toJSON();
        return { type: "VerticalYRulerModifier", options: json.options };
    }
}
