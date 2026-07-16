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
    EAxisLabelDrawMode,
    ESegmentLabelRotationMode,
    PolyLineAnnotation,
    IPolyLineAnnotationOptions,
    IMultiPointLabelStyleFormatParams
} from "scichart-financial-tools";
import {
    addDefaultFinancialModifiers,
    createFinancialChart,
    createTradingAnnotationOptions,
} from "../_shared/tradingAnnotationExampleUtils";

const PAIRED_DASHED_POLYLINE = "PairedDashedPolylineAnnotation";

const PAIRED_POLYLINE_COLORS = {
    primaryStroke: "#4F8EF7",
    primaryFill: "#4F8EF724",
    primaryConnector: "#A7C7FF",

    secondaryStroke: "#B77AF7",
    secondaryFill: "#B77AF720",
    secondaryConnector: "#F8FAFC",

    placementStroke: "#16A34A",
    placementFill: "#16A34A24",
    placementConnector: "#86EFAC",
};

const DEFAULT_PAIR_STROKE_DASH_ARRAY = [6, 4];

const normalizePlacementPointCount = (pointCount = 5) => {
    const safeNumber = Number.isFinite(pointCount) ? Math.floor(pointCount) : 5;

    return Math.max(3, Math.min(9, safeNumber));
};

interface IPairedDashedPolylineAnnotationOptions extends IPolyLineAnnotationOptions {
    pairStroke?: string;
    pairStrokeThickness?: number;
    pairStrokeDashArray?: number[];
    showPairConnectors?: boolean;
    placementPointCount?: number;
}

// @ts-ignore - placementPointCountProperty is private in `PolyLineAnnotation`
class PairedDashedPolylineAnnotation extends PolyLineAnnotation {
    public readonly type = PAIRED_DASHED_POLYLINE as any;

    private pairStrokeProperty = PAIRED_POLYLINE_COLORS.primaryConnector;
    private pairStrokeThicknessProperty = 1.5;
    private pairStrokeDashArrayProperty = DEFAULT_PAIR_STROKE_DASH_ARRAY;
    private showPairConnectorsProperty = true;
    // @ts-ignore - placementPointCountProperty is private in `PolyLineAnnotation`
    private placementPointCountProperty = 5;
    private pairStrokePenCache: any;

    constructor(options?: IPairedDashedPolylineAnnotationOptions) {
        super(options);

        this.pairStrokeProperty = options?.pairStroke ?? this.pairStrokeProperty;
        this.pairStrokeThicknessProperty = options?.pairStrokeThickness ?? this.pairStrokeThicknessProperty;
        this.pairStrokeDashArrayProperty = options?.pairStrokeDashArray ?? this.pairStrokeDashArrayProperty;
        this.showPairConnectorsProperty = options?.showPairConnectors ?? this.showPairConnectorsProperty;
        this.placementPointCountProperty = normalizePlacementPointCount(
            options?.placementPointCount ?? this.placementPointCountProperty
        );
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
            this.opacity,
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
            placementPointCount: this.placementPointCountProperty,
        });

        return json;
    }

    protected override getPlacementPointCountInternal(): number {
        return this.placementPointCountProperty;
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

const createConnectorLabels = (pointCount: number, prefix: string, drawPointLabels: boolean = true) => {
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
        padding: new Thickness(2, 8, 2, 8),
    });

    labels.push(
        {
            id: `${prefix}-axis-1`,
            anchorMode: EMultiPointLabelAnchorMode.Axis,
            axisLabelDrawMode: EAxisLabelDrawMode.Both,
            pointIndex: 0,
        },
        {
            id: `${prefix}-axis-${pointCount}`,
            anchorMode: EMultiPointLabelAnchorMode.Axis,
            axisLabelDrawMode: EAxisLabelDrawMode.Both,
            pointIndex: lastPointIndex,
        }
    );

    // also add point labels:
    if (drawPointLabels) {
        for (let i = 0; i <= lastPointIndex; i++) {
            labels.push({
                id: `${prefix}-point-${i}`,
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: i,
                verticalTextPosition: i % 2 === 0 ? EVerticalTextPosition.Below : EVerticalTextPosition.Above,
                alignment: ETextAlignment.Center,
                yOffset: i % 2 === 0 ? 5 : -5, // add more spacing between labels and grips
                text: `(${i + 1})`,
            });
        }
    }

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

    const createPrimaryDemoAnnotation = () =>
        new PairedDashedPolylineAnnotation({
            ...createTradingAnnotationOptions("PAIR", 5),
            isEditable: true,
            stroke: PAIRED_POLYLINE_COLORS.primaryStroke,
            strokeThickness: 2,
            fill: PAIRED_POLYLINE_COLORS.primaryFill,
            pairStroke: PAIRED_POLYLINE_COLORS.primaryConnector,
            pairStrokeThickness: 1.5,
            pairStrokeDashArray: [6, 4],
            placementPointCount: 5,
            points: [
                { x: xAt(226), y: yAt(226, -0.1) },
                { x: xAt(245), y: yAt(245, 0.1) },
                { x: xAt(278), y: yAt(278, -0.12) },
                { x: xAt(304), y: yAt(304, 0.1) },
                { x: xAt(324), y: yAt(324, -0.1) },
            ],
            labels: createConnectorLabels(5, "PAIR", false),
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
            clipping: EAnnotationClippingMode.SeriesViewRect,
        });

    const createSecondaryDemoAnnotation = () =>
        new PairedDashedPolylineAnnotation({
            ...createTradingAnnotationOptions("LAD", 7),
            isEditable: true,
            stroke: PAIRED_POLYLINE_COLORS.secondaryStroke,
            strokeThickness: 2,
            fill: PAIRED_POLYLINE_COLORS.secondaryFill,
            pairStroke: PAIRED_POLYLINE_COLORS.secondaryConnector,
            pairStrokeThickness: 1.5,
            pairStrokeDashArray: [4, 3],
            placementPointCount: 7,
            points: [
                { x: xAt(336), y: yAt(336, -0.1) },
                { x: xAt(358), y: yAt(358, 0.1) },
                { x: xAt(380), y: yAt(380, -0.1) },
                { x: xAt(404), y: yAt(404, 0.1) },
                { x: xAt(428), y: yAt(428, -0.1) },
                { x: xAt(452), y: yAt(452, 0.1) },
                { x: xAt(476), y: yAt(476, -0.1) },
            ],
            labels: createConnectorLabels(7, "LAD"),
            formatLabelStyle: ({ label, defaultStyle, ...rest }: IMultiPointLabelStyleFormatParams) => {
                if (label.anchorMode === EMultiPointLabelAnchorMode.Point) {
                    return { ...defaultStyle, color: "#FFF"};
                }
                return { ...defaultStyle };
            },
            segmentLabelVisibility: EAnnotationVisibilityMode.Always,
            axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
            clipping: EAnnotationClippingMode.SeriesViewRect,
        });

    const reset = () => {
        sciChartSurface.annotations.clear(true);
        sciChartSurface.annotations.add(createPrimaryDemoAnnotation(), createSecondaryDemoAnnotation());
    };

    reset();

    return {
        sciChartSurface,

        startPlacement: (pointCount = 5) => {
            const safePointCount = normalizePlacementPointCount(pointCount);

            placementModifier.startPlacement({
                type: PAIRED_DASHED_POLYLINE as any,
                options: {
                    ...createTradingAnnotationOptions("NEW", safePointCount),
                    isEditable: true,
                    stroke: PAIRED_POLYLINE_COLORS.placementStroke,
                    strokeThickness: 2,
                    fill: PAIRED_POLYLINE_COLORS.placementFill,
                    pairStroke: PAIRED_POLYLINE_COLORS.placementConnector,
                    pairStrokeThickness: 1.5,
                    pairStrokeDashArray: [7, 4],
                    showPairConnectors: true,
                    placementPointCount: safePointCount,
                    labels: createConnectorLabels(safePointCount, "NEW"),
                    pointLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
                    segmentLabelVisibility: EAnnotationVisibilityMode.Always,
                    axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
                    clipping: EAnnotationClippingMode.SeriesViewRect,
                } as any,
            });
        },

        stopPlacement: () => placementModifier.stopPlacement(true),

        reset,

        deleteAllAnnotations: () => {
            placementModifier.stopPlacement(true);
            sciChartSurface.annotations.clear(true);
        },

        togglePairConnectors: () => {
            sciChartSurface.annotations.asArray().forEach((annotation) => {
                if (annotation instanceof PairedDashedPolylineAnnotation) {
                    annotation.showPairConnectors = !annotation.showPairConnectors;
                }
            });
        },
    };
};
