import {
    EAutoRange,
    EHorizontalTextPosition,
    ETextAlignment,
    EVerticalTextPosition,
    NumberRange,
    Thickness,
} from "scichart";
import {
    ChannelAnnotation,
    EFibonacciLabelColorMode,
    EFibonacciLabelPlacement,
    FibonacciRetracementAnnotation,
    TFibonacciLevelLabelFormatParams,
    EAnnotationVisibilityMode,
    EAxisLabelDrawMode,
    IMultiPointLabelFormatParams,
    EMultiPointLabelAnchorMode,
    ESegmentLabelRotationMode,
} from "scichart-financial-tools";
import {
    addDefaultFinancialModifiers,
    createFinancialChart,
    createTradingAnnotationOptions,
    FIB_REGION_COLORS,
    TRADING_ANNOTATION_COLORS,
} from "../_shared/tradingAnnotationExampleUtils";

const pct = (value: number) => `${(value * 100).toFixed(2)}%`;

const formatDate = (unixSeconds: number) =>
    new Date(unixSeconds * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, xAxis, yAxis, xAt, yAt, highValues, lowValues, formatPrice } = await createFinancialChart(
        rootElement,
        {
            volatility: 0.0024,
            title: "BTC / USDT - Dynamic Labels",
        }
    );
    const yValuesInDemo = [
        yAt(196, 0.12),
        yAt(196, -0.1),
        yAt(242, 0.05),
        yAt(242, -0.15),
        yAt(232, 0.12),
        yAt(314, -0.09),
    ];
    const visibleStartIndex = 184;
    const visibleEndIndex = 319;
    const visibleHighs = highValues.slice(visibleStartIndex, visibleEndIndex + 1);
    const visibleLows = lowValues.slice(visibleStartIndex, visibleEndIndex + 1);
    const yMin = Math.min(...visibleLows, ...yValuesInDemo);
    const yMax = Math.max(...visibleHighs, ...yValuesInDemo);
    xAxis.visibleRange = new NumberRange(xAt(visibleStartIndex), xAt(visibleEndIndex));
    yAxis.autoRange = EAutoRange.Never;
    yAxis.visibleRange = new NumberRange(yMin - (yMax - yMin) * 0.12, yMax + (yMax - yMin) * 0.12);

    const channel = new ChannelAnnotation({
        ...createTradingAnnotationOptions("Channel", 4),
        isEditable: true,
        stroke: TRADING_ANNOTATION_COLORS.channel,
        fill: `${TRADING_ANNOTATION_COLORS.channel}33`,
        strokeThickness: 2,
        midLineStrokeDashArray: [4, 3],
        showMidLine: true,
        showMidPointGrips: true,
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        segmentLabelVisibility: EAnnotationVisibilityMode.Always,
        axisLabelVisibility: EAnnotationVisibilityMode.Always,
        labels: [
            {
                id: "channel-upper",
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentStartIndex: 0,
                segmentEndIndex: 1,
                segmentRatio: 0.5,
                segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
                verticalTextPosition: EVerticalTextPosition.Above,
                fontSize: 13,
                fontWeight: "700",
                padding: new Thickness(2, 8, 2, 8),
            },
            {
                id: "channel-lower",
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentStartIndex: 2,
                segmentEndIndex: 3,
                segmentRatio: 0.5,
                segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
                verticalTextPosition: EVerticalTextPosition.Below,
                fontSize: 13,
                fontWeight: "700",
                padding: new Thickness(2, 8, 2, 8),
            },
            {
                id: "channel-width",
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentStartIndex: 0,
                segmentEndIndex: 2,
                segmentRatio: 0.5,
                horizontalTextPosition: EHorizontalTextPosition.Right,
                alignment: ETextAlignment.Left,
                fontSize: 12,
                padding: new Thickness(2, 8, 2, 8),
            },
            {
                id: "channel-axis-upper",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.Y,
                pointIndex: 0,
            },
            {
                id: "channel-axis-lower",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.Y,
                pointIndex: 2,
            },
        ],
        formatLabel: (params: IMultiPointLabelFormatParams) => {
            const [p1, p2, p3] = params.valuePoints;
            const slope = (p2.y - p1.y) / Math.max(1, p2.x - p1.x);
            const channelHeight = Math.abs(p1.y - p3.y);
            if (params.label.id === "channel-upper") {
                return `${slope >= 0 ? "Rising" : "Falling"} resistance\n${formatPrice(params.anchorValuePoint.y)}`;
            }
            if (params.label.id === "channel-lower") {
                return `Support\n${formatPrice(params.anchorValuePoint.y)}`;
            }
            if (params.label.id === "channel-width") {
                return `Width ${formatPrice(channelHeight)}\n${pct(channelHeight / Math.max(1, p1.y))}`;
            }
            return formatPrice(params.anchorValuePoint.y);
        },
        formatLabelStyle: ({ label, valuePoints }) => {
            const [p1, p2, p3] = valuePoints;
            const bullish = p2.y >= p1.y;
            if (label.id === "channel-upper") {
                return { color: bullish ? "#DCFCE7" : "#FEE2E2", fontSize: bullish ? 15 : 13, fontWeight: "800" };
            }
            if (label.id === "channel-lower") {
                return { color: bullish ? TRADING_ANNOTATION_COLORS.flatChannel : "#FDBA74", fontWeight: "800" };
            }
            if (label.id === "channel-width") {
                const wideChannel = Math.abs(p1.y - p3.y) / Math.max(1, p1.y) > 0.018;
                return {
                    color: wideChannel ? TRADING_ANNOTATION_COLORS.connector : "#CBD5E1",
                    fontWeight: wideChannel ? "800" : "500",
                };
            }
            return undefined;
        },
        points: [
            { x: xAt(196), y: yAt(196, 0.1) },
            { x: xAt(242), y: yAt(242, 0.03) },
            { x: xAt(196), y: yAt(196, -0.08) },
            { x: xAt(242), y: yAt(242, -0.15) },
        ],
    });

    const fibonacci = new FibonacciRetracementAnnotation({
        ...createTradingAnnotationOptions("Fib", 3),
        isEditable: true,
        strokeThickness: 2,
        fillOpacity: 0.25,
        thresholds: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618],
        regionColors: FIB_REGION_COLORS,
        fibonacciLabelPlacement: EFibonacciLabelPlacement.Top,
        fibonacciLabelColorMode: EFibonacciLabelColorMode.MultiColor,
        fibonacciLabelFontSize: 12,
        showConnectorLine: true,
        connectorLineStrokeDashArray: [7, 4],
        pointLabelVisibility: EAnnotationVisibilityMode.Always,
        segmentLabelVisibility: EAnnotationVisibilityMode.Always,
        axisLabelVisibility: EAnnotationVisibilityMode.Always,
        labels: [
            {
                id: "fib-range",
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentStartIndex: 0,
                segmentEndIndex: 1,
                segmentRatio: 0.5,
                verticalTextPosition: EVerticalTextPosition.Above,
                fontSize: 13,
                fontWeight: "800",
                padding: new Thickness(2, 8, 2, 8),
            },
            {
                id: "fib-projection",
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: 2,
                horizontalTextPosition: EHorizontalTextPosition.Right,
                verticalTextPosition: EVerticalTextPosition.Center,
                fontSize: 12,
                fontWeight: "700",
            },
            {
                id: "fib-axis-start",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.Y,
                pointIndex: 0,
            },
            {
                id: "fib-axis-end",
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.Y,
                pointIndex: 1,
            },
        ],
        formatFibonacciLabel: (params: TFibonacciLevelLabelFormatParams) => {
            const level = `${(params.threshold * 100).toFixed(params.threshold < 1 ? 1 : 0)}%`;
            return `${level}\n${params.valueLabel}`;
        },
        formatLabel: ({ label, valuePoints, anchorValuePoint }) => {
            const [p1, p2] = valuePoints;
            const range = Math.abs(p1.y - p2.y);
            if (label.id === "fib-range") {
                return `Impulse ${formatPrice(range)}\n${pct(range / Math.max(1, p1.y))}`;
            }
            if (label.id === "fib-projection") {
                return `Projection anchor\n${formatDate(anchorValuePoint.x)}`;
            }
            return formatPrice(anchorValuePoint.y);
        },
        formatLabelStyle: ({ label, valuePoints }) => {
            const [p1, p2] = valuePoints;
            const deepMove = Math.abs(p1.y - p2.y) / Math.max(1, p1.y) > 0.02;
            if (label.id === "fib-range") {
                return {
                    color: deepMove ? TRADING_ANNOTATION_COLORS.connector : TRADING_ANNOTATION_COLORS.flatChannel,
                    fontSize: deepMove ? 15 : 12,
                };
            }
            if (label.id === "fib-projection") {
                return { color: p2.y > p1.y ? TRADING_ANNOTATION_COLORS.snappedPolyline : "#FDA4AF" };
            }
            return undefined;
        },
        points: [
            { x: xAt(232), y: yAt(232, 0.1) },
            { x: xAt(300), y: yAt(300, -0.07) },
            { x: xAt(314), y: yAt(314, -0.07) },
        ],
    });

    sciChartSurface.annotations.add(channel, fibonacci);
    addDefaultFinancialModifiers(sciChartSurface);

    return { sciChartSurface };
};
