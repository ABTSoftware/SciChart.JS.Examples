import { buildAnnotations, ERenderLayer, Thickness, IAnnotation, EVerticalTextPosition, NumberRange } from "scichart";
import {
    AnnotationEraserModifier,
    ESnapMode,
    EAnnotationVisibilityMode,
    EFibonacciLabelColorMode,
    EFibonacciLabelPlacement,
    ETradingAnnotationType,
    FibonacciExtensionAnnotation,
    PolyLineAnnotation,
    MultiPointAnnotationPlacementModifier,
    TFibonacciLevelLabelFormatParams,
    FreehandDrawingAnnotation,
    FreehandDrawingModifier,
    IMultiPointAnnotationBaseOptions,
    EMultiPointLabelAnchorMode,
    EAxisLabelDrawMode,
    MultiPointAnnotationBase,
    FibonacciAnnotationBase,
    MeasureAnnotation,
    AngleLineAnnotation,
    FibonacciTimeZoneAnnotation,
} from "scichart-financial-tools";
import {
    addDefaultFinancialModifiers,
    createFinancialChart,
    createTradingAnnotationOptions as createDefaultTradingAnnotationOptions,
    defaultSnapToCandleOptions,
    FIB_REGION_COLORS,
    TRADING_ANNOTATION_COLORS,
} from "../_shared/tradingAnnotationExampleUtils";
import { appTheme } from "../../../theme";

export type TStartToolOptions = {
    snapToCandle?: boolean;
    extendStart?: boolean;
    extendEnd?: boolean;
    verticalOnly?: boolean;
    lockedAspect?: boolean;
    highlighter?: boolean;
    isEditable?: boolean;
    labels?: string[];
    basicPitchfork?: boolean;
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
    const { sciChartSurface, candlestickSeries } = ctx;
    const candleInterval = ctx.xValues[1] - ctx.xValues[0];
    ctx.xAxis.visibleRange = new NumberRange(
        ctx.xValues[ctx.xValues.length - 200],
        ctx.xValues[ctx.xValues.length - 1] + 16 * candleInterval
    );
    let labelTextColor = appTheme.ForegroundColor;

    const createTradingAnnotationOptions = (...args: Parameters<typeof createDefaultTradingAnnotationOptions>) => ({
        ...createDefaultTradingAnnotationOptions(...args),
        axisLabelStroke: labelTextColor,
        formatLabelStyle: () => ({ color: labelTextColor }),
        fibonacciLabelColorMode: EFibonacciLabelColorMode.SingleColor,
        fibonacciLabelColor: labelTextColor,
        labelTextColor,
    });

    const placementModifier = new MultiPointAnnotationPlacementModifier({
        isPlacing: false,
        keepPlacingAfterComplete: false,
    });
    const freehandDrawingModifier = new FreehandDrawingModifier({
        isDrawing: false,
        keepDrawingAfterComplete: false,
        pointSamplingDistancePx: 0.5,
        simplifyTolerancePx: 1,
        maxPoints: 5000,
    });

    const eraserModifier = new AnnotationEraserModifier({ keepErasingAfterComplete: true });

    addDefaultFinancialModifiers(sciChartSurface);
    sciChartSurface.chartModifiers.add(freehandDrawingModifier, placementModifier, eraserModifier);

    const preparePlacementOptions = <T extends IMultiPointAnnotationBaseOptions>(options: T): T => options;

    const stopActiveTools = () => {
        placementModifier.stopPlacement(true);
        freehandDrawingModifier.stopDrawing(true);
        eraserModifier.stopErasing(true);
        sciChartSurface.invalidateElement();
    };

    const startFreehand = (options: TStartToolOptions) => {
        const { lockedAspect = false, highlighter = false, isEditable = true } = options;
        placementModifier.stopPlacement(true);
        freehandDrawingModifier.startDrawing({
            isEditable,
            opacity: highlighter ? 0.3 : 1,
            stroke: highlighter
                ? "#FACC15"
                : lockedAspect
                ? TRADING_ANNOTATION_COLORS.lockedFreehand
                : TRADING_ANNOTATION_COLORS.freehand,
            strokeThickness: highlighter ? 18 : 2,
            showBoxOutline: true,
            showBoxOutlineOnlyWhenSelected: true,
            boxOutlineStrokeDashArray: [6, 4],
            selectionBoxThickness: 1,
            keepAspectRatioOnResize: lockedAspect,
            forcedAspectRatio: lockedAspect ? 1 : undefined,
            allowMove: true,
            annotationsGripsRadius: 4,
            annotationsGripsStroke: lockedAspect
                ? TRADING_ANNOTATION_COLORS.lockedFreehand
                : TRADING_ANNOTATION_COLORS.freehand,
            gripSvgTemplate: (annotation: any, x: number, y: number) => {
                const ann = annotation as FreehandDrawingAnnotation;
                return `<circle cx="${x}" cy="${y}" r="${ann.annotationsGripsRadius}" fill="${ann.parentSurface.background}" stroke="${ann.annotationsGripsStroke}" stroke-width="1.5" />`;
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
                        ...createTradingAnnotationOptions(
                            options.snapToCandle ? "SNP" : "PLY",
                            options.labels?.length ?? 5
                        ),
                        ...(options.labels
                            ? {
                                  pointLabelVisibility: EAnnotationVisibilityMode.Always,
                                  labels: options.labels.map((text, pointIndex) => ({
                                      anchorMode: EMultiPointLabelAnchorMode.Point,
                                      pointIndex,
                                      text,
                                      yOffset: 10,
                                      verticalTextPosition: EVerticalTextPosition.Below,
                                  })),
                              }
                            : {}),
                        ...(options.snapToCandle ? defaultSnapToCandleOptions(candlestickSeries.id) : {}),
                        isEditable: true,
                        stroke: color,
                        strokeThickness: 2,
                        fill: `${color}33`,
                        placementPointCount: options.labels?.length ?? 5,
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
                        showFullWidthZone: !options.basicPitchfork,
                        fullWidthZoneFill: `${TRADING_ANNOTATION_COLORS.pitchZone}66`,
                        fullWidthZoneStroke: TRADING_ANNOTATION_COLORS.pitchZone,
                        showHalfWidthZone: !options.basicPitchfork,
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
                        //thresholds: options.verticalOnly ? [-0.618, -0.236, 0, 0.618, 1, 2.618] : undefined, // use defaults
                        verticalOnly: options.verticalOnly,
                        // fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
                        // fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
                        // formatFibonacciLabel: (params: TFibonacciLevelLabelFormatParams) => {
                        // const percentage = `${(params.threshold * 100).toFixed(1)}%`;
                        // return `${percentage}\n${params.valueLabel}`;
                        // },
                    } as any),
                });
                return;
            case ETradingAnnotationType.FibonacciExtensionAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.FibonacciExtensionAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FBE", 3, undefined, { includeSegmentLabels: false }),
                        isEditable: true,
                        strokeThickness: 2,
                        regionColors: FIB_REGION_COLORS,
                        fillOpacity: 0.25,
                        opacity: 1,
                        showConnectorLine: true,
                        connectorLineStrokeDashArray: [6, 4],
                    } as any),
                });
                return;
            case ETradingAnnotationType.FibonacciCirclesAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.FibonacciCirclesAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FBC", 2, undefined, { includeSegmentLabels: false }),
                        isEditable: true,
                        strokeThickness: 2,
                        regionColors: FIB_REGION_COLORS,
                        fillOpacity: 0.2,
                        opacity: 1,
                        showConnectorLine: true,
                        connectorLineStrokeDashArray: [6, 4],
                    } as any),
                });
                return;
            case ETradingAnnotationType.FibonacciSpeedResistanceArcsAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.FibonacciSpeedResistanceArcsAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FSR", 2, undefined, { includeSegmentLabels: false }),
                        isEditable: true,
                        strokeThickness: 2,
                        regionColors: FIB_REGION_COLORS,
                        fillOpacity: 0.2,
                        opacity: 1,
                        showConnectorLine: true,
                        connectorLineStrokeDashArray: [6, 4],
                    } as any),
                });
                return;
            case ETradingAnnotationType.FibonacciWedgeAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.FibonacciWedgeAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("FBW", 3, undefined, { includeSegmentLabels: false }),
                        isEditable: true,
                        strokeThickness: 2,
                        regionColors: FIB_REGION_COLORS,
                        fillOpacity: 0.2,
                        opacity: 1,
                        showConnectorLine: true,
                        connectorLineStrokeDashArray: [6, 4],
                    } as any),
                });
                return;
            case ETradingAnnotationType.MeasureAnnotation:
                placementModifier.startPlacement({
                    type: ETradingAnnotationType.MeasureAnnotation,
                    options: preparePlacementOptions({
                        ...createTradingAnnotationOptions("MSR", 2, undefined, { includeSegmentLabels: false }),
                        ...(options.snapToCandle
                            ? defaultSnapToCandleOptions(candlestickSeries.id)
                            : { snapMode: ESnapMode.None }),
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
                        axisLabelStroke: labelTextColor,
                        annotationsGripsRadius: 4,
                        annotationsGripsStroke: TRADING_ANNOTATION_COLORS.foreground,
                    } as any),
                });
                return;
            case ETradingAnnotationType.HorizontalTrendLineAnnotation:
            case ETradingAnnotationType.VerticalTrendLineAnnotation:
            case ETradingAnnotationType.CrossLineAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: {
                        isEditable: true,
                        stroke: "#FBA55A",
                        strokeThickness: 2,
                        axisLabelStroke: labelTextColor,
                    },
                });
                return;
            case ETradingAnnotationType.AngleLineAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: {
                        isEditable: true,
                        stroke: "#F472B6",
                        strokeThickness: 2,
                        guideDashArray: [2, 4],
                        angleGuideLength: 100,
                        labelColor: labelTextColor,
                        formatAngleLabel: ({ angle }) => `${angle.toFixed(1)}°`,
                    },
                });
                return;
            case ETradingAnnotationType.InsidePitchforkAnnotation:
            case ETradingAnnotationType.SchiffPitchforkAnnotation:
            case ETradingAnnotationType.ModifiedSchiffPitchforkAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: {
                        ...createTradingAnnotationOptions("", 3, undefined, { includeSegmentLabels: false }),
                        isEditable: true,
                        stroke: TRADING_ANNOTATION_COLORS.pitchfork,
                        strokeThickness: 2,
                        showFullWidthZone: true,
                        fullWidthZoneFill: "#3B82F633",
                        showHalfWidthZone: true,
                        halfWidthZoneFill: "#22C55E33",
                    },
                });
                return;
            case ETradingAnnotationType.FibonacciTimeZoneAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: {
                        isEditable: true,
                        stroke: "#60A5FA",
                        strokeThickness: 2,
                        labelColor: labelTextColor,
                        axisLabelStroke: labelTextColor,
                    },
                });
                return;
            case ETradingAnnotationType.CyclicLineAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: {
                        isEditable: true,
                        stroke: "#34D399",
                        strokeThickness: 2,
                        showConnectorLine: true,
                        connectorLineStrokeDashArray: [6, 4],
                    },
                });
                return;
            case ETradingAnnotationType.CyclicArcAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: { isEditable: true, stroke: "#34D399", strokeThickness: 2, fill: "#34D39933" },
                });
                return;
            case ETradingAnnotationType.SectorAnnotation:
                placementModifier.startPlacement({
                    type: tool,
                    options: {
                        isEditable: true,
                        strokeThickness: 2,
                        fillOpacity: 0.18,
                        regionColors: FIB_REGION_COLORS,
                    },
                });
                return;
            case ETradingAnnotationType.FreehandDrawingAnnotation:
                startFreehand(options);
                return;
        }
    };

    const addSeedAnnotations = () => {
        // Keep the initial drawings in the same proportions as the reference layout.
        const { min, max } = ctx.xAxis.visibleRange;
        const x = (position: number) => min + (max - min) * position;
        sciChartSurface.annotations.add(
            new FibonacciExtensionAnnotation({
                ...createTradingAnnotationOptions("FBE", 3, undefined, {
                    includePointLabels: false, // Set to true to show FBE point names and prices.
                    includeSegmentLabels: false,
                }),
                isEditable: true,
                strokeThickness: 2,
                thresholds: [0, 0.382, 0.618, 1, 1.618, 2.618, 3.618],
                regionColors: [0, 2, 4, 6, 7, 8].map((index) => FIB_REGION_COLORS[index]),
                fillOpacity: 0.25,
                fibonacciLabelPlacement: EFibonacciLabelPlacement.Left,
                formatFibonacciLabel: ({ threshold, valueLabel }) => `${threshold} (${valueLabel})`,
                showConnectorLine: true,
                connectorLineStroke: "#F87171",
                connectorLineStrokeDashArray: [6, 4],
                points: [
                    { x: x(0.19), y: 61740 },
                    { x: x(0.253), y: 62540 },
                    { x: x(0.383), y: 62940 },
                ],
            }),
            new FibonacciTimeZoneAnnotation({
                ...createTradingAnnotationOptions("", 2, undefined, {
                    includePointLabels: false,
                    includeSegmentLabels: false,
                    includeAxisLabels: false,
                }),
                isEditable: true,
                stroke: "#60A5FA",
                strokeThickness: 2,
                labelColor: labelTextColor,
                labelFontSize: 14,
                extendStart: false,
                extendEnd: true,
                connectorLineStroke: "#F87171",
                connectorLineStrokeDashArray: [6, 4],
                points: [
                    { x: x(0.469), y: 64580 },
                    { x: x(0.496), y: 64580 },
                ],
            }),
            new PolyLineAnnotation({
                ...createTradingAnnotationOptions("", 5, undefined, {
                    includePointLabels: false,
                    includeSegmentLabels: false,
                    includeAxisLabels: false,
                }),
                isEditable: true,
                stroke: TRADING_ANNOTATION_COLORS.freePolyline,
                fill: `${TRADING_ANNOTATION_COLORS.freePolyline}33`,
                strokeThickness: 2,
                labels: ["X", "A", "B", "C", "D"].map((text, pointIndex) => ({
                    anchorMode: EMultiPointLabelAnchorMode.Point,
                    pointIndex,
                    text,
                    fontSize: 14,
                    yOffset: 10,
                    verticalTextPosition: EVerticalTextPosition.Below,
                })),
                points: [
                    { x: x(0.63), y: 63600 },
                    { x: x(0.704), y: 65330 },
                    { x: x(0.754), y: 64280 },
                    { x: x(0.835), y: 65720 },
                    { x: x(0.917), y: 64800 },
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

    const disposeKeyboard = addKeyboardShortcuts(
        removeSelectedAnnotations,
        duplicateSelectedAnnotation,
        stopActiveTools
    );

    const syncLabelTextColor = () => {
        const color = appTheme.ForegroundColor;
        if (color === labelTextColor) return;
        labelTextColor = color;
        sciChartSurface.annotations.asArray().forEach((annotation) => {
            if (annotation instanceof MultiPointAnnotationBase) annotation.axisLabelStroke = labelTextColor;
            if (annotation instanceof FibonacciAnnotationBase) annotation.fibonacciLabelColor = labelTextColor;
            if (annotation instanceof MeasureAnnotation) annotation.labelTextColor = labelTextColor;
            if (annotation instanceof AngleLineAnnotation || annotation instanceof FibonacciTimeZoneAnnotation) {
                annotation.labelColor = labelTextColor;
            }
        });
        sciChartSurface.invalidateElement();
    };
    sciChartSurface.rendered.subscribe(syncLabelTextColor);

    const deleteAllAnnotations = () => {
        stopActiveTools();
        sciChartSurface.annotations.clear(true);
    };

    return {
        sciChartSurface,
        startTool,
        stopActiveTools,
        deleteAllAnnotations,
        removeSelectedAnnotations,
        duplicateSelectedAnnotation,
        startEraser: () => {
            stopActiveTools();
            eraserModifier.startErasing();
        },
        isToolActive: () =>
            placementModifier.isPlacing || freehandDrawingModifier.isDrawing || eraserModifier.isErasing,
        dispose: () => {
            sciChartSurface.rendered.unsubscribe(syncLabelTextColor);
            disposeKeyboard();
        },
    };
};

const addKeyboardShortcuts = (removeSelected: () => void, duplicateSelected: () => void, stopTools: () => void) => {
    const isTypingTarget = (target: EventTarget | null) => {
        if (!(target instanceof HTMLElement)) return false;
        return (
            target.isContentEditable ||
            !!target.closest("dialog") ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
        );
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (isTypingTarget(event.target)) return;
        if (event.key === "Escape") stopTools();
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
