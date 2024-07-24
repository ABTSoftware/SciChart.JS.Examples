import {
    ChartModifierBase2D,
    DpiHelper,
    ECoordinateMode,
    EModifierType,
    EMousePosition,
    EBaseType,
    EChart2DModifierType,
    IChartModifierBaseOptions,
    LineAnnotation,
    ModifierMouseArgs,
    Point,
    SciChartSurface,
    SciChartSurfaceBase,
    SciChartSubSurface,
    translateFromCanvasToSeriesViewRect,
    translateToNotScaled,
    registerType,
    testIsInBounds,
} from "scichart";
import { TFinanceLegendTemplate, FinChartLegendAnnotation } from "./FinChartLegendAnnotation";

/**
 * Optional parameters used to configure a {@link CursorModifier} at construct time
 */
export interface IFinanceLegendModifierOptions extends IChartModifierBaseOptions {
    legendTemplate?: TFinanceLegendTemplate;
    legendOffsetX?: number;
    legendOffsetY?: number;
    legendTitle?: string;
    crosshairStroke?: string;
    crosshairStrokeThickness?: number;
    crosshairStrokeDashArray?: number[];
    showAxisLabels?: boolean;
    axisLabelStroke?: string;
    axisLabelFill?: string;
    parentSurface?: SciChartSurface;
}

class CustomPaneModifier extends ChartModifierBase2D {
    public type = EChart2DModifierType.Custom;
    public callback: () => void;

    constructor(callback: () => void) {
        super();

        this.callback = callback;
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        this.callback();
    }
}

// tslint:disable-next-line: max-classes-per-file
export class FinChartLegendModifier extends ChartModifierBase2D {
    public static customType = "FinChartLegendModifier";
    public type = EChart2DModifierType.Custom;
    public legendTemplate: TFinanceLegendTemplate;
    public crosshairStroke: string = "grey";
    public crosshairStrokeThickness: number = 2;
    public crosshairStrokeDashArray: number[] = [];
    public showAxisLabels: boolean = true;
    public axisLabelStroke: string = "lightgrey";
    public axisLabelFill: string = "#193D4B";

    private readonly xLineAnnotations: Map<string, LineAnnotation> = new Map<string, LineAnnotation>();
    private readonly yLineAnnotations: Map<string, LineAnnotation> = new Map<string, LineAnnotation>();
    private readonly paneModifiers: Map<SciChartSubSurface, CustomPaneModifier> = new Map<
        SciChartSubSurface,
        CustomPaneModifier
    >();
    private mousePosition: EMousePosition = EMousePosition.OutOfCanvas;
    private mousePositionPaneId: string;
    private mousePositionSciChartSurface: SciChartSurfaceBase;
    private translatedMousePoint: Point;
    private readonly legendAnnotations: Map<string, FinChartLegendAnnotation> = new Map<
        string,
        FinChartLegendAnnotation
    >();

    private legendOffsetXProperty: number = 0;
    private legendOffsetYProperty: number = 0;
    private legendTitleProperty: string;

    public constructor(options?: IFinanceLegendModifierOptions) {
        super();
        this.legendTemplate = options?.legendTemplate ?? this.legendTemplate;
        this.legendOffsetXProperty = options?.legendOffsetX ?? this.legendOffsetXProperty;
        this.legendOffsetYProperty = options?.legendOffsetY ?? this.legendOffsetYProperty;
        this.legendTitleProperty = options?.legendTitle ?? this.legendTitleProperty;
        this.crosshairStroke = options?.crosshairStroke ?? this.crosshairStroke;
        this.crosshairStrokeThickness = options?.crosshairStrokeThickness ?? this.crosshairStrokeThickness;
        this.crosshairStrokeDashArray = options?.crosshairStrokeDashArray ?? this.crosshairStrokeDashArray;
        this.showAxisLabels = options?.showAxisLabels ?? this.showAxisLabels;
        this.axisLabelStroke = options?.axisLabelStroke ?? this.axisLabelStroke;
        this.axisLabelFill = options?.axisLabelFill ?? this.axisLabelFill;
    }

    public onAttachSubSurface(subChart: SciChartSubSurface): void {
        const newCustomModifier = new CustomPaneModifier(() => {
            this.updateMousePosition(subChart);
            if (this.mousePosition !== EMousePosition.OutOfCanvas) {
                this.update();
            }
        });
        subChart.chartModifiers.add(newCustomModifier);
        this.paneModifiers.set(subChart, newCustomModifier);
        this.addLineAnnotations(subChart.id);
        this.addLegendAnnotation(subChart.id);
    }

    public onDetachSubSurface(subChart: SciChartSubSurface): void {
        const paneModifier = this.paneModifiers.get(subChart);
        subChart.chartModifiers.remove(paneModifier);
        this.removeLineAnnotations(subChart.id);
        this.removeLegendAnnotation(subChart.id);
    }

    public get modifierType(): EModifierType {
        return EModifierType.Chart2DModifier;
    }

    public get legendOffsetX() {
        return this.legendOffsetXProperty;
    }

    public set legendOffsetX(value) {
        this.legendOffsetXProperty = value;
    }

    public get legendOffsetY() {
        return this.legendOffsetYProperty;
    }

    public set legendOffsetY(value) {
        this.legendOffsetYProperty = value;
    }

    public get legendTitle() {
        return this.legendTitleProperty;
    }

    public set legendTitle(value) {
        this.legendTitleProperty = value;
    }

    private getSciChartSurface(paneId: string) {
        return this.parentSurface.subCharts.find((subChart) => subChart.id === paneId);
    }

    private newLineAnnotation() {
        return new LineAnnotation({
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            strokeThickness: this.crosshairStrokeThickness,
            strokeDashArray: this.crosshairStrokeDashArray,
            stroke: this.crosshairStroke,
            isHidden: true,
            axisLabelFill: this.axisLabelFill,
            axisLabelStroke: this.axisLabelStroke,
        });
    }

    private updateMousePosition(scs: SciChartSubSurface) {
        const { left, right, top, bottom } = scs.getSubChartRect();
        if (testIsInBounds(this.mousePoint.x, this.mousePoint.y, left, bottom, right, top)) {
            this.mousePositionPaneId = scs.id;
            this.mousePositionSciChartSurface = scs;
            if (!this.mousePoint) {
                this.mousePosition = EMousePosition.OutOfCanvas;
            } else {
                this.translatedMousePoint = translateFromCanvasToSeriesViewRect(this.mousePoint, scs.seriesViewRect);
                if (!this.translatedMousePoint) {
                    this.mousePosition = EMousePosition.AxisArea;
                } else {
                    this.mousePosition = EMousePosition.SeriesArea;
                }
            }
        } else {
            this.mousePosition = EMousePosition.OutOfCanvas;
        }
    }

    private update() {
        if (this.mousePosition === EMousePosition.SeriesArea) {
            const { x: scaledX, y: scaledY } = this.translatedMousePoint;
            const x = translateToNotScaled(scaledX);
            const y = translateToNotScaled(scaledY);

            this.parentSurface.subCharts.forEach((scs) => {
                const xLineAnnotation = this.xLineAnnotations.get(scs.id);
                const yLineAnnotation = this.yLineAnnotations.get(scs.id);

                if (scs === this.mousePositionSciChartSurface) {
                    yLineAnnotation.isHidden = false;
                    yLineAnnotation.x1 = 0;
                    yLineAnnotation.x2 = scs.seriesViewRect.right / DpiHelper.PIXEL_RATIO;
                    yLineAnnotation.y1 = y;
                    yLineAnnotation.y2 = y;
                } else {
                    yLineAnnotation.isHidden = true;
                }
                xLineAnnotation.showLabel = scs.getXAxisById(xLineAnnotation.xAxisId).drawLabels;
                xLineAnnotation.isHidden = false;
                xLineAnnotation.y1 = 0;
                xLineAnnotation.y2 = scs.seriesViewRect.bottom / DpiHelper.PIXEL_RATIO;
                xLineAnnotation.x1 = x;
                xLineAnnotation.x2 = x;

                // UPDATE LEGEND
                const legendAnnotation = this.legendAnnotations.get(scs.id);
                legendAnnotation.x1 = x;
                legendAnnotation.y1 = y;
                legendAnnotation.activeSciChartSurface = this.mousePositionSciChartSurface as SciChartSurface;
            });
        } else {
            this.parentSurface.subCharts.forEach((scs) => {
                this.xLineAnnotations.get(scs.id).isHidden = true;
                this.yLineAnnotations.get(scs.id).isHidden = true;

                const legendAnnotation = this.legendAnnotations.get(scs.id);
                legendAnnotation.x1 = undefined;
                legendAnnotation.y1 = undefined;
                legendAnnotation.activeSciChartSurface = undefined;
            });
        }
    }

    private addLineAnnotations(paneId: string) {
        const subChart = this.getSciChartSurface(paneId);
        const xLineAnnotation = this.newLineAnnotation();
        this.xLineAnnotations.set(paneId, xLineAnnotation);
        const yLineAnnotation = this.newLineAnnotation();
        this.yLineAnnotations.set(paneId, yLineAnnotation);
        subChart.annotations.add(xLineAnnotation, yLineAnnotation);
    }

    private removeLineAnnotations(paneId: string) {
        const scs = this.getSciChartSurface(paneId);
        const xLineAnnotation = this.xLineAnnotations.get(paneId);
        xLineAnnotation.delete();
        scs.annotations.remove(xLineAnnotation);
        this.xLineAnnotations.delete(paneId);
        const yLineAnnotation = this.yLineAnnotations.get(paneId);
        yLineAnnotation.delete();
        scs.annotations.remove(yLineAnnotation);
        this.yLineAnnotations.delete(paneId);
    }

    private addLegendAnnotation(paneId: string) {
        const subChart = this.getSciChartSurface(paneId);
        const legendAnnotation = new FinChartLegendAnnotation(this.parentSurface, {
            template: this.legendTemplate,
            offsetX: this.legendOffsetX,
            offsetY: 0,
            paneId,
        });
        this.legendAnnotations.set(paneId, legendAnnotation);
        subChart.annotations.add(legendAnnotation);
    }

    private removeLegendAnnotation(paneId: string) {
        const scs = this.getSciChartSurface(paneId);
        const legendAnnotation = this.legendAnnotations.get(paneId);
        legendAnnotation.delete();
        scs.annotations.remove(legendAnnotation);
        this.legendAnnotations.delete(paneId);
    }
}

registerType(
    EBaseType.Chart2DModifier,
    FinChartLegendModifier.customType,
    (options: any) => new FinChartLegendModifier(options)
);
