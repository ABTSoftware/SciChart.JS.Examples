import {
    CoordinateCalculatorBase,
    deleteSafe,
    EAnnotationClippingMode,
    EBaseType,
    ETextAlignment,
    EVerticalTextPosition,
    IRenderContext2D,
    Rect,
    registerType,
    SciChartSurface,
    Thickness,
} from "scichart";
import { 
    MultiPointAnnotationPlacementModifier, 
    EAnnotationVisibilityMode, 
    EMultiPointLabelAnchorMode,
    ESegmentLabelRotationMode,
    ESnapMode,
    PolyLineAnnotation,
    IPolyLineAnnotationOptions,
} from "scichart-financial-tools";
import {
    addDefaultFinancialModifiers,
    createFinancialChart,
    createTradingAnnotationOptions,
    TRADING_ANNOTATION_COLORS,
} from "../_shared/tradingAnnotationExampleUtils";

const PAIRED_DASHED_POLYLINE = "PairedDashedPolylineAnnotation";

interface IPairedDashedPolylineAnnotationOptions extends IPolyLineAnnotationOptions {
    pairStroke?: string;
    pairStrokeThickness?: number;
    pairStrokeDashArray?: number[];
    showPairConnectors?: boolean;
    placementPointCount?: number;
}

class PairedDashedPolylineAnnotation extends PolyLineAnnotation {
    public readonly type = PAIRED_DASHED_POLYLINE as any;

    private pairStrokeProperty = TRADING_ANNOTATION_COLORS.connector;
    private pairStrokeThicknessProperty = 2;
    private pairStrokeDashArrayProperty = [7, 5];
    private showPairConnectorsProperty = true;
    private customPlacementPointCount = 6;
    private pairStrokePenCache: any;

    constructor(options?: IPairedDashedPolylineAnnotationOptions) {
        super(options);
        this.pairStrokeProperty = options?.pairStroke ?? this.pairStrokeProperty;
        this.pairStrokeThicknessProperty = options?.pairStrokeThickness ?? this.pairStrokeThicknessProperty;
        this.pairStrokeDashArrayProperty = options?.pairStrokeDashArray ?? this.pairStrokeDashArrayProperty;
        this.showPairConnectorsProperty = options?.showPairConnectors ?? this.showPairConnectorsProperty;
        this.customPlacementPointCount = Math.max(4, Math.floor(options?.placementPointCount ?? this.customPlacementPointCount));
    }

    public get showPairConnectors(): boolean {
        return this.showPairConnectorsProperty;
    }

    public set showPairConnectors(value: boolean) {
        this.showPairConnectorsProperty = !!value;
        this.notifyPropertyChanged("showPairConnectors");
    }

    public override onAttach(scs: SciChartSurface): void {
        super.onAttach(scs);
        this.pairStrokePenCache = this.updatePenCache(
            this.pairStrokePenCache,
            this.pairStrokeProperty,
            this.pairStrokeThicknessProperty,
            this.opacity,
            this.pairStrokeDashArrayProperty
        );
    }

    public override delete(): void {
        this.pairStrokePenCache = deleteSafe(this.pairStrokePenCache);
        super.delete();
    }

    public override drawWithContext(
        renderContext: IRenderContext2D,
        xCalc: CoordinateCalculatorBase,
        yCalc: CoordinateCalculatorBase,
        seriesViewRect: Rect,
        surfaceViewRect: Rect,
        chartViewRect: Rect
    ): void {
        super.drawWithContext(renderContext, xCalc, yCalc, seriesViewRect, surfaceViewRect, chartViewRect);

        if (!this.showPairConnectorsProperty || this.points.length < 4) {
            return;
        }

        const pixelPoints = this.getPixelPoints(xCalc, yCalc);
        const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
        const pairPen = this.resolvePenFromCache(
            this.pairStrokePenCache,
            this.pairStrokeThicknessProperty,
            true
        );
        if (!pairPen) return;

        this.getConnectorPairs().forEach(([startIndex, endIndex]) => {
            const start = pixelPoints[startIndex];
            const end = pixelPoints[endIndex];
            if (!start || !end) return;
            renderContext.drawLines([start.x, start.y, end.x, end.y], pairPen, seriesViewRect, clipRect);
        });
    }

    private getConnectorPairs(): Array<readonly [number, number]> {
        const lastPointIndex = this.points.length - 1;
        const pairs: Array<readonly [number, number]> = [];
        for (let startIndex = 1; startIndex + 2 <= lastPointIndex; startIndex += 2) {
            pairs.push([startIndex, startIndex + 2]);
        }
        if (lastPointIndex > 0) {
            pairs.push([0, lastPointIndex]);
        }
        return pairs;
    }

    public override toJSON() {
        const json = super.toJSON();
        Object.assign(json.options, {
            pairStroke: this.pairStrokeProperty,
            pairStrokeThickness: this.pairStrokeThicknessProperty,
            pairStrokeDashArray: this.pairStrokeDashArrayProperty,
            showPairConnectors: this.showPairConnectorsProperty,
            placementPointCount: this.customPlacementPointCount,
        });
        return json;
    }

    protected override getPlacementPointCountInternal(): number {
        return this.customPlacementPointCount;
    }

    protected override notifyPropertyChanged(propertyName: string): void {
        super.notifyPropertyChanged(propertyName);
        if (["pairStroke", "pairStrokeThickness", "pairStrokeDashArray", "opacity"].includes(propertyName)) {
            this.pairStrokePenCache = this.updatePenCache(
                this.pairStrokePenCache,
                this.pairStrokeProperty,
                this.pairStrokeThicknessProperty,
                this.opacity,
                this.pairStrokeDashArrayProperty
            );
        }
    }
}

registerType(
    EBaseType.Annotation,
    PAIRED_DASHED_POLYLINE,
    (options?: IPairedDashedPolylineAnnotationOptions) => new PairedDashedPolylineAnnotation(options),
    true
);

const createConnectorLabels = (pointCount: number, prefix: string) => {
    const lastPointIndex = pointCount - 1;
    const labels: any[] = [];

    for (let startIndex = 1; startIndex + 2 <= lastPointIndex; startIndex += 2) {
        labels.push({
            id: `${prefix}-peak-${startIndex + 1}-${startIndex + 3}`,
            anchorMode: EMultiPointLabelAnchorMode.Segment,
            segmentStartIndex: startIndex,
            segmentEndIndex: startIndex + 2,
            segmentRatio: 0.5,
            segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
            verticalTextPosition: EVerticalTextPosition.Above,
            alignment: ETextAlignment.Center,
            text: `Peak ${startIndex + 1} -> ${startIndex + 3}`,
            fontSize: 12,
            fontWeight: "800",
            padding: new Thickness(2, 8, 2, 8),
        });
    }

    labels.push({
        id: `${prefix}-odd-1-${pointCount}`,
        anchorMode: EMultiPointLabelAnchorMode.Segment,
        segmentStartIndex: 0,
        segmentEndIndex: lastPointIndex,
        segmentRatio: 0.5,
        segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
        verticalTextPosition: EVerticalTextPosition.Below,
        alignment: ETextAlignment.Center,
        text: `Odd 1 -> ${pointCount}`,
        fontSize: 12,
        fontWeight: "800",
        padding: new Thickness(2, 8, 2, 8),
    });

    labels.push(
        {
            id: `${prefix}-axis-1`,
            anchorMode: EMultiPointLabelAnchorMode.Axis,
            pointIndex: 0,
        },
        {
            id: `${prefix}-axis-${pointCount}`,
            anchorMode: EMultiPointLabelAnchorMode.Axis,
            pointIndex: lastPointIndex,
        }
    );

    return labels;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, xAt, yAt, candlestickSeries } = await createFinancialChart(rootElement, {
        volatility: 0.0022,
        title: "BTC / USDT - Custom Paired Polyline",
    });

    const placementModifier = new MultiPointAnnotationPlacementModifier();
    addDefaultFinancialModifiers(sciChartSurface);
    sciChartSurface.chartModifiers.add(placementModifier);

    const createDemoAnnotation = () =>
        new PairedDashedPolylineAnnotation({
            ...createTradingAnnotationOptions("PAIR", 6),
            isEditable: true,
            stroke: TRADING_ANNOTATION_COLORS.snappedPolyline,
            strokeThickness: 2,
            fill: `${TRADING_ANNOTATION_COLORS.snappedPolyline}33`,
            pairStroke: TRADING_ANNOTATION_COLORS.connector,
            pairStrokeThickness: 2,
            pairStrokeDashArray: [8, 5],
            snapMode: ESnapMode.DataPoint,
            snapToSeriesId: candlestickSeries.id,
            snapToDataPointRadius: 35,
            points: [
                { x: xAt(166), y: yAt(166, -0.08) },
                { x: xAt(176), y: yAt(176, 0.09) },
                { x: xAt(190), y: yAt(190, -0.06) },
                { x: xAt(204), y: yAt(204, 0.11) },
                { x: xAt(220), y: yAt(220, -0.05) },
                { x: xAt(236), y: yAt(236, 0.07) },
            ],
            labels: createConnectorLabels(6, "PAIR"),
            pointLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
            clipping: EAnnotationClippingMode.SeriesViewRect,
        });

    const reset = () => {
        sciChartSurface.annotations.clear(true);
        sciChartSurface.annotations.add(
            createDemoAnnotation(),
            new PairedDashedPolylineAnnotation({
                ...createTradingAnnotationOptions("LAD", 5),
                isEditable: true,
                stroke: TRADING_ANNOTATION_COLORS.freePolyline,
                strokeThickness: 2,
                fill: `${TRADING_ANNOTATION_COLORS.freePolyline}33`,
                pairStroke: TRADING_ANNOTATION_COLORS.warning,
                pairStrokeDashArray: [4, 4],
                points: [
                    { x: xAt(244), y: yAt(244, -0.05) },
                    { x: xAt(256), y: yAt(256, 0.08) },
                    { x: xAt(270), y: yAt(270, -0.1) },
                    { x: xAt(286), y: yAt(286, 0.09) },
                    { x: xAt(302), y: yAt(302, -0.04) },
                ],
                labels: createConnectorLabels(5, "LAD"),
                pointLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
                segmentLabelVisibility: EAnnotationVisibilityMode.Always,
                axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
            })
        );
    };

    reset();

    return {
        sciChartSurface,
        startPlacement: (pointCount = 6) => {
            const safePointCount = Math.max(4, Math.min(12, Math.floor(pointCount)));
            placementModifier.startPlacement({
                type: PAIRED_DASHED_POLYLINE as any,
                options: {
                    ...createTradingAnnotationOptions("NEW", safePointCount),
                    isEditable: true,
                    stroke: TRADING_ANNOTATION_COLORS.flatChannel,
                    strokeThickness: 2,
                    fill: `${TRADING_ANNOTATION_COLORS.flatChannel}33`,
                    pairStroke: TRADING_ANNOTATION_COLORS.connector,
                    pairStrokeDashArray: [8, 5],
                    showPairConnectors: true,
                    placementPointCount: safePointCount,
                    labels: createConnectorLabels(safePointCount, "NEW"),
                    pointLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
                    segmentLabelVisibility: EAnnotationVisibilityMode.Always,
                } as any,
            });
        },
        stopPlacement: () => placementModifier.stopPlacement(true),
        reset,
        togglePairConnectors: () => {
            sciChartSurface.annotations.asArray().forEach((annotation) => {
                if (annotation instanceof PairedDashedPolylineAnnotation) {
                    annotation.showPairConnectors = !annotation.showPairConnectors;
                }
            });
        },
    };
};
