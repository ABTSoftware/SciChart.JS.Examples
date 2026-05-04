import {
    AnnotationHoverModifier,
    DiscontinuousDateAxis,
    EAnnotationClippingMode,
    EAnnotationVisibilityMode,
    EAutoRange,
    EAxisAlignment,
    EXyDirection,
    ECursorStyle,
    EMultiPointLabelAnchorMode,
    ETextAlignment,
    ENumericFormat,
    FastCandlestickRenderableSeries,
    IMultiPointAnnotationBaseOptions,
    IMultiPointLabelFormatParams,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    SciChartJsNavyTheme,
    SciChartSurface,
    Thickness,
    TMultiPointLabelFormatter,
    ZoomExtentsModifier,
    ZoomPanModifier,
    toEngineering,
    DpiHelper,
    EVerticalTextPosition,
    EHorizontalTextPosition,
    ESegmentLabelRotationMode,
    SciChartJSLightTheme,
    EHorizontalAlignment,
    SciChartJSDarkTheme,
    EAxisLabelDrawMode,
} from "scichart";
import {
    ChannelAnnotation,
    ExtendedLineAnnotation,
    SciTraderDarkTheme,
    StopLossTakeProfitAnnotation
} from "scichart-financial-tools";

const CANDLE_COUNT = 260;
const VISIBLE_CANDLE_COUNT = 120;
const CANDLE_INTERVAL_SECONDS = 60 * 60;

export interface ITradingCandlestickDemoContext {
    sciChartSurface: SciChartSurface;
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    xAt: (index: number) => number;
    yAt: (index: number, offsetFraction?: number) => number;
}

export interface IStressLabelOptions {
    segmentPairs?: ReadonlyArray<readonly [number, number]>;
    includePointLabels?: boolean;
    includeSegmentLabels?: boolean;
    includeAxisLabels?: boolean;
}

type TCandles = {
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
};

const generateCandles = (): TCandles => {
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];

    const startTimestamp = Math.floor(Date.now() / 1000) - CANDLE_COUNT * CANDLE_INTERVAL_SECONDS;

    let previousClose = 64500;
    for (let i = 0; i < CANDLE_COUNT; i++) {
        const open = previousClose;
        const trend = Math.sin(i / 15) * 180 + Math.cos(i / 5) * 70;
        const noise = (Math.random() - 0.5) * 220;
        const close = Math.max(1000, open + trend + noise);
        const wickSize = 70 + Math.random() * 160;

        const high = Math.max(open, close) + wickSize;
        const low = Math.min(open, close) - wickSize;

        xValues.push(startTimestamp + i * CANDLE_INTERVAL_SECONDS);
        openValues.push(open);
        highValues.push(high);
        lowValues.push(low);
        closeValues.push(close);

        previousClose = close;
    }

    return {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
    };
};

export const createTradingCandlestickDemo = async (
    rootElement: string | HTMLDivElement
): Promise<ITradingCandlestickDemoContext> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        // theme: new SciChartJsNavyTheme(),
        // theme: new SciChartJSDarkTheme(),

        // theme: new SciChartJSLightTheme(),
        theme: new SciTraderDarkTheme(),
        padding: Thickness.fromNumber(0),
    });

    const xAxis = new DiscontinuousDateAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        autoRange: EAutoRange.Never,
        cursorLabelFormat: ENumericFormat.Date_DDMM,
        drawMinorGridLines: false,
        drawMajorBands: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
    });

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.12, 0.2),
        drawMinorGridLines: false,
        drawMajorBands: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        labelFormat: ENumericFormat.Engineering,
        labelPrecision: 1
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const { xValues, openValues, highValues, lowValues, closeValues } = generateCandles();
    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        dataSeriesName: "BTC / USDT",
    });

    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries,
            stroke: "#CBD5E1",
            strokeThickness: 1,
            dataPointWidth: 0.72,
            brushUp: "#22C55E99",
            brushDown: "#EF444499",
            strokeUp: "#22C55E",
            strokeDown: "#EF4444",
        })
    );

    const lastIndex = xValues.length - 1;
    const firstVisibleIndex = Math.max(0, lastIndex - VISIBLE_CANDLE_COUNT);
    xAxis.visibleRange = new NumberRange(xValues[firstVisibleIndex], xValues[lastIndex]);

    const clampIndex = (index: number) => Math.max(0, Math.min(lastIndex, index));
    const xAt = (index: number) => xValues[clampIndex(index)];
    const closeAt = (index: number) => closeValues[clampIndex(index)];

    const minLow = Math.min(...lowValues);
    const maxHigh = Math.max(...highValues);
    const ySpan = Math.max(1, maxHigh - minLow);

    const yAt = (index: number, offsetFraction: number = 0) => {
        const unclamped = closeAt(index) + ySpan * offsetFraction;
        const margin = ySpan * 0.02;
        const minY = minLow + margin;
        const maxY = maxHigh - margin;

        if (minY >= maxY) {
            return unclamped;
        }

        return Math.max(minY, Math.min(maxY, unclamped));
    };

    return {
        sciChartSurface,
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        xAt,
        yAt,
    };
};

export const addDefaultTradingAnnotationModifiers = (sciChartSurface: SciChartSurface) => {
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair,
        })
    );
};

export const createStressLabels = (
    startFromPointIndex: number,
    pointCount: number,
    prefix: string,
    options?: IStressLabelOptions
): IMultiPointAnnotationBaseOptions["labels"] => {
    const labels: NonNullable<IMultiPointAnnotationBaseOptions["labels"]> = [];
    const includePointLabels = options?.includePointLabels ?? true;
    const includeSegmentLabels = options?.includeSegmentLabels ?? true;
    // const includeSegmentLabels = false;
    const includeAxisLabels = options?.includeAxisLabels ?? true;
    const maxPointIndex = Math.max(0, pointCount - 1);
    const startPointIndex = Math.max(0, startFromPointIndex);
    // const pointLabelColors = ["#E2E8F0", "#F8FAFC", "#93C5FD"] as const;
    // const segmentLabelColors = ["#FDE68A", "#FCA5A5", "#86EFAC", "#C4B5FD", "#F9A8D4"] as const;
    const alignments = [ETextAlignment.Left, ETextAlignment.Center, ETextAlignment.Right] as const;
    const pointLabelPadding = new Thickness(0, 0, 0, 0);
    const segmentLabelPadding = new Thickness(0, 0, 0, 0);
    const pointLabelTextStyle = {
        fontSize: 13,
        fontFamily: "Arial",
        // fontWeight: "600",
        fontStyle: "normal",
        // Keep this intentionally large so multiline spacing is obvious in demo pages.
        lineSpacing: 0.4,
    } as const;
    const segmentLabelTextStyle = {
        fontSize: 12,
        fontFamily: "Arial",
        fontWeight: "500",
        //fontStyle: "italic",
        // fontStyle: "normal",

        lineSpacing: 0.15,
    } as const;

    if (pointCount === 0) {
        return labels;
    }

    if (includePointLabels) {
        const pointPositions = [
            EVerticalTextPosition.Above,
            EVerticalTextPosition.Below,
            EVerticalTextPosition.Center,
        ];
        for (let i = startPointIndex; i <= maxPointIndex; i++) {
            labels.push({
                id: `${prefix}-pt-${i + 1}`,
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: i,
                verticalTextPosition: pointPositions[0],
                horizontalTextPosition: EHorizontalTextPosition.Center,
                // alignment: alignments[i % alignments.length],
                alignment: alignments[1],
                // color: pointLabelColors[i % pointLabelColors.length],
                // color: "#FFFFFF",
                padding: pointLabelPadding,
                xOffset: 0,
                yOffset: -2 * DpiHelper.PIXEL_RATIO,
                ...pointLabelTextStyle,
            });
        }
    }

    if (includeSegmentLabels && maxPointIndex >= 1) {
        const defaultPairs: Array<readonly [number, number]> = [];
        for (let i = startPointIndex; i < maxPointIndex; i++) {
            defaultPairs.push([i, i + 1] as const);
        }
        const sourcePairs = options?.segmentPairs?.length ? options.segmentPairs : defaultPairs;
        const validPairs = sourcePairs
            .map(([start, end]) => {
                const startIndex = Math.max(0, Math.min(maxPointIndex, Math.floor(start)));
                const endIndex = Math.max(0, Math.min(maxPointIndex, Math.floor(end)));
                if (startIndex === endIndex) {
                    return undefined;
                }
                return startIndex < endIndex
                    ? ([startIndex, endIndex] as const)
                    : ([endIndex, startIndex] as const);
            })
            .filter((pair): pair is readonly [number, number] => !!pair)
            .filter((pair, index, self) => self.findIndex(candidate =>
                candidate[0] === pair[0] && candidate[1] === pair[1]
            ) === index);

        if (validPairs.length > 0) {
            const segmentLabelKinds: any[] = [
                // { suffix: "center", ratio: 0.5, verticalTextPosition: EVerticalTextPosition.Above, xOffset: 0 },
                // { suffix: "above", ratio: 0.25, verticalTextPosition: EVerticalTextPosition.Above },
                // { suffix: "below", ratio: 0.75, verticalTextPosition: EVerticalTextPosition.Below },
                // { suffix: "r-algn", ratio: 1, verticalTextPosition: EVerticalTextPosition.Above, xOffset: -10, alignment: ETextAlignment.Right },
            ];

            segmentLabelKinds.forEach((kind, kindIndex) => {
                const pair = validPairs[kindIndex % validPairs.length];
                labels.push({
                    id: `${prefix}-seg-${kind.suffix}-${kindIndex + 1}`,
                    // color: "#ffffff",

                    anchorMode: EMultiPointLabelAnchorMode.Segment,
                    // segment only props
                    segmentStartIndex: pair[0],
                    segmentEndIndex: pair[1],
                    segmentRatio: kind.ratio,

                    segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
                    verticalTextPosition: kind?.verticalTextPosition ?? EVerticalTextPosition.Above,

                    // horizontalTextPosition: EHorizontalTextPosition.Left,
                    // alignment: kind?.alignment ?? alignments[1],
                    
                    xOffset: kind.xOffset,
                    padding: segmentLabelPadding,
                    ...segmentLabelTextStyle,
                });
            });
        }
    }

    if (includeAxisLabels) {
        for (let i = startPointIndex; i <= maxPointIndex; i++) {
            labels.push({
                id: `${prefix}-axis-${i + 1}`,
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.Both,
                pointIndex: i,
            });
        }
    }

    return labels;
};

export const createStressAnnotationOptions = (
    startPoint: number,
    pointCount: number,
    prefix: string,
    labelFormatter?: TMultiPointLabelFormatter,
    labelOptions?: IStressLabelOptions
): Partial<IMultiPointAnnotationBaseOptions> => ({
    clipping: EAnnotationClippingMode.SeriesViewRect,
    adornerClipping: EAnnotationClippingMode.SeriesViewRect,
    // axisLabelFill: "#FFFFFF",
    axisLabelStroke: "#000000",
    axisSpanFillOpacity: 0.2,
    labels: createStressLabels(startPoint, pointCount, prefix, labelOptions),
    
    selectionBoxStroke: "#66666644",
    selectionBoxThickness: 8,
    
    // pointLabelVisibility: EAnnotationVisibilityMode.Always,
    segmentLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
    axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
    
    // adornerVisibility: EAnnotationVisibilityMode.OnInteraction,
    gripVisibility: EAnnotationVisibilityMode.Always,
    
    formatLabel: labelFormatter ? labelFormatter : (params: IMultiPointLabelFormatParams) => {
        const { label, anchorValuePoint, anchorMode, defaultText } = params;
        if (defaultText?.trim()) {
            return defaultText;
        }

        const xText = new Date(anchorValuePoint.x * 1000).getDate();
        const yText = toEngineering(anchorValuePoint.y);
        const shortId = label.id?.split("-").slice(-2).join("-") ?? "label";

        if (anchorMode === EMultiPointLabelAnchorMode.Point) {
            // return `x:${xText}\ny:${yText}`;
            return prefix + "-" + yText;
        }

        if (anchorMode === EMultiPointLabelAnchorMode.Segment) {
            return `${shortId} @${yText}`;
            // return label.id;
        }

        return `${shortId} ${yText}`;
    },

    formatLabelStyle: ({ annotation, label, defaultStyle }) => {
        const sltp = annotation as StopLossTakeProfitAnnotation;
        const [p1, p2, ...rest] = sltp.points;

        if (label.anchorMode === EMultiPointLabelAnchorMode.Segment && annotation instanceof StopLossTakeProfitAnnotation) {
            return {
                color: (p2.y >= p1.y ? sltp.takeProfitColor : sltp.stopLossColor),
                fontSize: 20
            };
        }

        if (annotation instanceof ExtendedLineAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Point) {
            return {
                color: p2.y >= p1.y ? "#" : "salmon",
            }
        }

        if (annotation instanceof ChannelAnnotation && label.anchorMode === EMultiPointLabelAnchorMode.Point) {
            if(label.id.includes("1")) {
                return {
                    fontSize: (rest[1].y <= p1.y) ? 13 : 0,
                }
            }
            if (label.id.includes("4")) {
                return {
                    fontSize: (rest[1].y <= p1.y) ? 0 : 13
                }
            }
        }

        return {}
    }
});
