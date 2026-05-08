import { buildAnnotations, ERenderLayer, Thickness, IAnnotation } from "scichart";
import {
    EAnnotationVisibilityMode,
    EFibonacciLabelColorMode,
    EFibonacciLabelPlacement,
    ETradingAnnotationType,
    ChannelAnnotation,
    FibonacciRetracementAnnotation,
    ExtendedLineAnnotation,
    MultiPointAnnotationPlacementModifier,
    TFibonacciLevelLabelFormatParams,
    FreehandDrawingAnnotation,
    FreehandDrawingModifier,
    IMultiPointAnnotationBaseOptions,
    EMultiPointLabelAnchorMode,
    EAxisLabelDrawMode,
} from "scichart-financial-tools";
import {
    addDefaultFinancialModifiers,
    createFinancialChart,
    createTradingAnnotationOptions,
    defaultSnapToCandleOptions,
    FIB_REGION_COLORS,
    TRADING_ANNOTATION_COLORS,
} from "../_shared/tradingAnnotationExampleUtils";

type TStartToolOptions = {
    snapToCandle?: boolean;
    extendStart?: boolean;
    extendEnd?: boolean;
    verticalOnly?: boolean;
    lockedAspect?: boolean;
};

const CHANNEL_LABEL_PAIRS = [
    [0, 1],
    [2, 3],
] as const;

const PITCH_LABEL_PAIRS = [[1, 2]] as const;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const ctx = await createFinancialChart(rootElement, {
        volatility: 0.0028,
        title: "BTC / USDT - Drawing Tools",
        startDate: new Date("2024-01-01T00:00:00Z"),
        dataSeed: 133337,
    });
    const { sciChartSurface, candlestickSeries, xAt, yAt } = ctx;

    const placementModifier = new MultiPointAnnotationPlacementModifier({
        isPlacing: false,
        keepPlacingAfterComplete: false,
    });
    const freehandDrawingModifier = new FreehandDrawingModifier({
        isDrawing: false,
        keepDrawingAfterComplete: true,
        pointSamplingDistancePx: 0.5,
        simplifyTolerancePx: 1,
        maxPoints: 5000,
    });

    addDefaultFinancialModifiers(sciChartSurface);
    sciChartSurface.chartModifiers.add(freehandDrawingModifier, placementModifier);

    const preparePlacementOptions = <T extends IMultiPointAnnotationBaseOptions>(options: T): T => options;

    const stopActiveTools = () => {
        placementModifier.stopPlacement(true);
        freehandDrawingModifier.stopDrawing(true);
    };

    const startFreehand = (lockedAspect = false) => {
        placementModifier.stopPlacement(true);
        freehandDrawingModifier.startDrawing({
            isEditable: true,
            stroke: lockedAspect ? TRADING_ANNOTATION_COLORS.lockedFreehand : TRADING_ANNOTATION_COLORS.freehand,
            strokeThickness: 2,
            showBoxOutline: true,
            showBoxOutlineOnlyWhenSelected: true,
            boxOutlineStrokeDashArray: [6, 4],
            keepAspectRatioOnResize: lockedAspect,
            forcedAspectRatio: lockedAspect ? 1 : undefined,
            allowMove: true,
            annotationsGripsRadius: 4,
            annotationsGripsStroke: lockedAspect
                ? TRADING_ANNOTATION_COLORS.lockedFreehand
                : TRADING_ANNOTATION_COLORS.freehand,
            gripSvgTemplate: (annotation: any, x: number, y: number) => {
                const ann = annotation as FreehandDrawingAnnotation;
                return `<circle cx="${x}" cy="${y}" r="${ann.annotationsGripsRadius}" fill="${ann.parentSurface.background}" stroke="${ann.annotationsGripsStroke}" stroke-width="${ann.strokeThickness}" />`;
            },
        });
    };

    const startTool = (tool: ETradingAnnotationType, options: TStartToolOptions = {}) => {
        stopActiveTools();

        switch (tool) {
            case ETradingAnnotationType.PolyLineAnnotation: {
                const color = options.snapToCandle
                    ? TRADING_ANNOTATION_COLORS.snappedPolyline
                    : TRADING_ANNOTATION_COLORS.freePolyline;

                placementModifier.startPlacement({
                    type: ETradingAnnotationType.PolyLineAnnotation,
                    options: {
                        ...createTradingAnnotationOptions(options.snapToCandle ? "SNP" : "PLY", 5),
                        ...(options.snapToCandle ? defaultSnapToCandleOptions(candlestickSeries.id) : {}),
                        isEditable: true,
                        stroke: color,
                        strokeThickness: 2,
                        fill: `${color}33`,
                        placementPointCount: 5,
                    } as any,
                });
                return;
            }
            case ETradingAnnotationType.ExtendedLineAnnotation: {
                const extendStart = options.extendStart ?? true;
                const extendEnd = options.extendEnd ?? true;

                placementModifier.startPlacement({
                    type: ETradingAnnotationType.ExtendedLineAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("RAY", 2),
                        isEditable: true,
                        stroke:
                            extendStart && extendEnd
                                ? TRADING_ANNOTATION_COLORS.extendedLine
                                : TRADING_ANNOTATION_COLORS.ray,
                        strokeThickness: 2,
                        extendStart,
                        extendEnd,
                    }),
                });
                return;
            }
            case ETradingAnnotationType.ChannelAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.ChannelAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("CHN", 4, undefined, { includeSegmentLabels: false }),
                        isEditable: true,
                        stroke: TRADING_ANNOTATION_COLORS.channel,
                        fill: `${TRADING_ANNOTATION_COLORS.channel}33`,
                        strokeThickness: 2,
                        midLineStrokeDashArray: [4, 3],
                        showMidLine: true,
                        showMidPointGrips: true,
                    } as any),
                });
                return;
            case ETradingAnnotationType.FlatBottomChannelAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.FlatBottomChannelAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FLT", 4, undefined, { segmentPairs: CHANNEL_LABEL_PAIRS }),
                        isEditable: true,
                        stroke: TRADING_ANNOTATION_COLORS.flatChannel,
                        fill: `${TRADING_ANNOTATION_COLORS.flatChannel}33`,
                        strokeThickness: 2,
                        midLineStrokeDashArray: [4, 3],
                        showMidLine: true,
                        showMidPointGrips: false,
                    } as any),
                });
                return;
            case ETradingAnnotationType.DisjointChannelAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.DisjointChannelAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("DSJ", 4, undefined, { segmentPairs: CHANNEL_LABEL_PAIRS }),
                        isEditable: true,
                        stroke: TRADING_ANNOTATION_COLORS.disjointChannel,
                        fill: `${TRADING_ANNOTATION_COLORS.disjointChannel}33`,
                        strokeThickness: 2,
                        midLineStrokeDashArray: [4, 3],
                    } as any),
                });
                return;
            case ETradingAnnotationType.PitchforkAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.PitchforkAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("PFK", 3, undefined, { segmentPairs: PITCH_LABEL_PAIRS }),
                        isEditable: true,
                        stroke: TRADING_ANNOTATION_COLORS.pitchfork,
                        strokeThickness: 2,
                        showFullWidthZone: true,
                        fullWidthZoneFill: `${TRADING_ANNOTATION_COLORS.pitchZone}66`,
                        fullWidthZoneStroke: TRADING_ANNOTATION_COLORS.pitchZone,
                        showHalfWidthZone: true,
                        halfWidthZoneFill: "#33ff3366",
                        halfWidthZoneStroke: "#33ff33",
                        renderLayer: ERenderLayer.First,
                    } as any),
                });
                return;
            case ETradingAnnotationType.PitchfanAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.PitchfanAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FAN", 3, undefined, {
                            segmentPairs: [...PITCH_LABEL_PAIRS, [0, 1]],
                        }),
                        isEditable: true,
                        stroke: TRADING_ANNOTATION_COLORS.pitchfan,
                        strokeThickness: 2,
                        showShoulderLine: true,
                        showFullWidthZone: true,
                        fullWidthZoneFill: `${TRADING_ANNOTATION_COLORS.pitchZone}66`,
                        fullWidthZoneStroke: TRADING_ANNOTATION_COLORS.pitchZone,
                        showHalfWidthZone: true,
                        halfWidthZoneFill: `${TRADING_ANNOTATION_COLORS.halfPitchZone}66`,
                        halfWidthZoneStroke: TRADING_ANNOTATION_COLORS.halfPitchZone,
                    } as any),
                });
                return;
            case ETradingAnnotationType.FibonacciRetracementAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.FibonacciRetracementAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FIB", 3, undefined, {
                            includeSegmentLabels: false,
                            extraLabels: options.verticalOnly // note that "extraLabels" is not a library prop, these are just additional utils
                                ? [
                                    // extra axis labels to show extended Fibonacci using "segmentRatio"
                                    // for labels at thresholds "-0.618" and "2.618"
                                    {
                                        id: `FIB-pt-extended-1`,
                                        anchorMode: EMultiPointLabelAnchorMode.Axis,
                                        axisLabelDrawMode: EAxisLabelDrawMode.Y,
                                        segmentStartIndex: 1,
                                        segmentEndIndex: 2,
                                        segmentRatio: 2.618,
                                    },
                                    {
                                        id: `FIB-pt-extended-2`,
                                        anchorMode: EMultiPointLabelAnchorMode.Axis,
                                        axisLabelDrawMode: EAxisLabelDrawMode.Y,
                                        segmentStartIndex: 1,
                                        segmentEndIndex: 2,
                                        segmentRatio: -0.618,
                                    },
                                ]
                                : [
                                    {
                                        id: `FIB-pt-extended-1`,
                                        anchorMode: EMultiPointLabelAnchorMode.Axis,
                                        axisLabelDrawMode: EAxisLabelDrawMode.Y,
                                        segmentStartIndex: 1,
                                        segmentEndIndex: 2,
                                        segmentRatio: 4.236,
                                    },
                                ],
                        }),
                        isEditable: true,
                        strokeThickness: 2,
                        regionColors: options.verticalOnly
                            ? ["#F85161", "#FB8B62", "#D2E26F", "#70CEA5", "#7FAECE"]
                            : FIB_REGION_COLORS,
                        fillOpacity: 0.25,
                        opacity: 1,
                        showConnectorLine: true,
                        connectorLineStrokeDashArray: options.verticalOnly ? [16, 4] : [6, 4],
                        thresholds: options.verticalOnly ? [-0.618, -0.236, 0, 0.618, 1, 2.618] : undefined, // use defaults
                        verticalOnly: options.verticalOnly,
                        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
                        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
                        formatFibonacciLabel: (params: TFibonacciLevelLabelFormatParams) => {
                            const percentage = `${(params.threshold * 100).toFixed(1)}%`;
                            return `${percentage}\n${params.valueLabel}`;
                        },
                    } as any),
                });
                return;
            case ETradingAnnotationType.MeasureAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.MeasureAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("MSR", 2, undefined, { includeSegmentLabels: false }),
                        ...defaultSnapToCandleOptions(candlestickSeries.id),
                        isEditable: true,
                        strokeThickness: 2,
                        growingColor: TRADING_ANNOTATION_COLORS.measureUp,
                        decliningColor: TRADING_ANNOTATION_COLORS.measureDown,
                        fillOpacity: 0.15,
                        labelCornerRadius: 6,
                        labelOffset: 6,
                        labelPadding: new Thickness(4, 8, 4, 8),
                        yValueScaleFactor: 100,
                    }),
                });
                return;
            case ETradingAnnotationType.StopLossTakeProfitAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.StopLossTakeProfitAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("RISK", 2),
                        isEditable: true,
                        strokeThickness: 2,
                        strokeDashArray: [6, 3],
                        takeProfitColor: "#16A34A",
                        stopLossColor: TRADING_ANNOTATION_COLORS.measureDown,
                        fillOpacity: 0.18,
                        axisSpanFillOpacity: 0.2,
                        axisLabelVisibility: EAnnotationVisibilityMode.Always,
                        axisLabelStroke: "#FFFFFF",
                        annotationsGripsRadius: 4,
                        annotationsGripsStroke: TRADING_ANNOTATION_COLORS.foreground,
                    } as any),
                });
                return;
            case ETradingAnnotationType.FreehandDrawingAnnotation:
                startFreehand(options.lockedAspect);
                return;
        }
    };

    const addSeedAnnotations = () => {
        sciChartSurface.annotations.clear(true);
        sciChartSurface.annotations.add(
            new ChannelAnnotation({
                ...createTradingAnnotationOptions("", 4, undefined, { includeSegmentLabels: false }),
                isEditable: true,
                stroke: TRADING_ANNOTATION_COLORS.channel,
                fill: `${TRADING_ANNOTATION_COLORS.channel}26`,
                strokeThickness: 2,
                midLineStrokeDashArray: [4, 3],
                showMidLine: true,
                showMidPointGrips: true,
                points: [
                    { x: 1705049596, y: 62895 },
                    { x: 1705259865, y: 64864 },
                    { x: 1705049596, y: 61731 },
                    { x: 1705259865, y: 63699 },
                ],
            } as any),
            new FibonacciRetracementAnnotation({
                ...createTradingAnnotationOptions("Fib", 3, undefined, {
                    includeSegmentLabels: false,
                    extraLabels: [
                        {
                            id: "Fib-extended-1",
                            anchorMode: EMultiPointLabelAnchorMode.Axis,
                            axisLabelDrawMode: EAxisLabelDrawMode.Y,
                            segmentStartIndex: 1,
                            segmentEndIndex: 2,
                            segmentRatio: 2.618,
                        },
                        {
                            id: "Fib-extended-2",
                            anchorMode: EMultiPointLabelAnchorMode.Axis,
                            axisLabelDrawMode: EAxisLabelDrawMode.Y,
                            segmentStartIndex: 1,
                            segmentEndIndex: 2,
                            segmentRatio: -0.618,
                        },
                    ],
                }),
                isEditable: true,
                strokeThickness: 2,
                regionColors: ["#F85161", "#FB8B62", "#D2E26F", "#70CEA5", "#7FAECE"],
                fillOpacity: 0.25,
                opacity: 1,
                fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
                fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
                showConnectorLine: true,
                connectorLineStrokeDashArray: [16, 4],
                thresholds: [-0.618, -0.236, 0, 0.618, 1, 2.618],
                verticalOnly: true,
                formatFibonacciLabel: (params: TFibonacciLevelLabelFormatParams) => {
                    const percentage = `${(params.threshold * 100).toFixed(1)}%`;
                    return `${percentage}\n${params.valueLabel}`;
                },
                points: [
                    {x: 1705587439, y: 63110},
                    {x: 1705782618, y: 63110},
                    {x: 1705782618, y: 64283}
                ],
            }),
            new ExtendedLineAnnotation({
                ...createTradingAnnotationOptions("", 2, undefined),
                isEditable: true,
                strokeThickness: 2,
                stroke: TRADING_ANNOTATION_COLORS.ray,
                points: [
                    {x: 1705291231, y: 62131},
                    {x: 1705459018, y: 63495}
                ],
            })
        );
    };

    const removeSelectedAnnotations = () => {
        sciChartSurface.annotations
            .asArray()
            .filter((annotation: IAnnotation) => annotation.isSelected)
            .forEach((annotation: IAnnotation) => sciChartSurface.annotations.remove(annotation, true));
    };

    const duplicateSelectedAnnotation = () => {
        const selectedAnnotation = sciChartSurface.annotations
            .asArray()
            .find((annotation: IAnnotation) => annotation.isSelected);
        if (!selectedAnnotation) return;

        const json = JSON.parse(JSON.stringify(selectedAnnotation.toJSON()));
        json.options.isSelected = true;
        delete json.options.id;
        if (Array.isArray(json.options.points)) {
            json.options.points = json.options.points.map((point: { x: number; y: number }) => ({
                x: point.x + 8 * 60 * 60,
                y: point.y + 350,
            }));
        }
        const [duplicate] = buildAnnotations(json);
        if (duplicate) {
            selectedAnnotation.isSelected = false;
            sciChartSurface.annotations.add(duplicate);
        }
    };
    addSeedAnnotations();

    const disposeKeyboard = addKeyboardShortcuts(removeSelectedAnnotations, duplicateSelectedAnnotation);

    return {
        sciChartSurface,
        startTool,
        stopActiveTools,
        resetAnnotations: addSeedAnnotations,
        removeSelectedAnnotations,
        duplicateSelectedAnnotation,
        setKeepPlacingAfterComplete: (enabled: boolean) => {
            (placementModifier as any).keepPlacingAfterCompleteProperty = enabled;
            (freehandDrawingModifier as any).keepDrawingAfterCompleteProperty = enabled;
        },
        dispose: disposeKeyboard,
    };
};

const addKeyboardShortcuts = (removeSelected: () => void, duplicateSelected: () => void) => {
    const isTypingTarget = (target: EventTarget | null) => {
        if (!(target instanceof HTMLElement)) return false;
        return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (isTypingTarget(event.target)) return;
        if (event.key === "Backspace" || event.key === "Delete") {
            removeSelected();
            event.preventDefault();
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
            duplicateSelected();
            event.preventDefault();
        }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
};
