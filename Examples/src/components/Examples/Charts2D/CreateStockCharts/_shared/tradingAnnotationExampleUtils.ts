import {
    AnnotationHoverModifier,
    DiscontinuousDateAxis,
    EAnnotationClippingMode,
    EAutoRange,
    EAxisAlignment,
    EBaseType,
    ECursorStyle,
    EFillPaletteMode,
    EHorizontalTextPosition,
    ENumericFormat,
    EPaletteProviderType,
    ETextAlignment,
    EVerticalTextPosition,
    EXyDirection,
    FastCandlestickRenderableSeries,
    FastColumnRenderableSeries,
    IFillPaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    parseColorToUIntArgb,
    registerType,
    SciChartSurface,
    TPaletteProviderDefinition,
    Thickness,
    toEngineering,
    XyDataSeries,
    ZoomExtentsModifier,
} from "scichart";
import {
    EAnnotationVisibilityMode,
    EAxisLabelDrawMode,
    EMultiPointLabelAnchorMode,
    ESegmentLabelRotationMode,
    ESnapMode,
    IMultiPointAnnotationBaseOptions,
    IMultiPointLabelFormatParams,
    StopLossTakeProfitAnnotation,
    SciTraderDarkTheme,
    TMultiPointLabelFormatter,
} from "scichart-financial-tools";
import { Point } from "scichart/Core/Point";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { appTheme } from "../../../theme";

const Y_AXIS_VOLUME_ID = "Y_AXIS_VOLUME_ID";
const VOLUME_PALETTE_PROVIDER_TYPE = "TradingAnnotationVolumePaletteProvider";
const CANDLE_COUNT = 500;
const VISIBLE_CANDLE_COUNT = 300;
const CANDLE_INTERVAL_SECONDS = 60 * 60;

export const FIB_REGION_COLORS = [
    "#F87171",
    "#FB8B62",
    "#FBA55A",
    "#FBC35A",
    "#F5D86A",
    "#D2E26F",
    "#9EDB7E",
    "#70CEA5",
    "#7FAECE",
    "#A1A1AA",
];

export const TRADING_ANNOTATION_COLORS = {
    foreground: "#F5F5F5",
    freePolyline: "#C792EA",
    snappedPolyline: "#4EC385",
    ray: "#FBA55A",
    extendedLine: "#cc5511",
    channel: "#3B82F6",
    flatChannel: "#93C5FD",
    disjointChannel: "#FB7185",
    pitchfork: "#ff8833",
    pitchfan: "#4EC385",
    pitchZone: "#3B82F6",
    halfPitchZone: "#22C55E",
    measureUp: "#3B82F6",
    measureDown: "#EF4444",
    freehand: "#3388FF",
    lockedFreehand: "#A3E635",
    warning: "#F97066",
    connector: "#F7C948",
};

export type TFinancialChartContext = {
    sciChartSurface: SciChartSurface;
    wasmContext: any;
    xAxis: DiscontinuousDateAxis;
    yAxis: NumericAxis;
    candlestickSeries: FastCandlestickRenderableSeries;
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    volumeValues: number[];
    xAt: (index: number) => number;
    yAt: (index: number, offsetFraction?: number) => number;
    priceAt: (index: number) => number;
    formatPrice: (value: number) => string;
};

export const createFinancialChart = async (
    rootElement: string | HTMLDivElement,
    options?: { startPrice?: number; volatility?: number; title?: string; startDate?: Date; dataSeed?: number }
): Promise<TFinancialChartContext> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciTraderDarkTheme(),
        padding: new Thickness(10, 10, 10, 10),
    });

    const xAxis = new DiscontinuousDateAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        autoRange: EAutoRange.Never,
        cursorLabelFormat: ENumericFormat.Date_HHMM,
        drawMajorBands: false,
        drawMinorGridLines: false,
        majorGridLineStyle: { color: "#FFFFFF05" },
    });

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        growBy: new NumberRange(0.1, 0.2),
        labelFormat: ENumericFormat.Engineering,
        labelPrecision: 1,
        labelPrefix: "$",
        autoRange: EAutoRange.Always,
        drawMajorBands: false,
        drawMinorGridLines: false,
        majorGridLineStyle: { color: "#FFFFFF05" },
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: Y_AXIS_VOLUME_ID,
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0, 4),
            isVisible: false,
            autoRange: EAutoRange.Always,
        })
    );

    const startDate = options?.startDate ?? new Date(Date.now() - CANDLE_COUNT * CANDLE_INTERVAL_SECONDS * 1000);
    const { xValues, openValues, highValues, lowValues, closeValues, volumeValues } =
        ExampleDataProvider.getRandomOHLCVData(
            CANDLE_COUNT,
            options?.startPrice ?? 64000,
            startDate,
            CANDLE_INTERVAL_SECONDS,
            false,
            options?.volatility ?? 0.0022,
            options?.dataSeed
        );

    const firstVisibleIndex = Math.max(0, xValues.length - VISIBLE_CANDLE_COUNT);
    xAxis.visibleRange = new NumberRange(xValues[firstVisibleIndex], xValues[xValues.length - 1]);

    const candleDataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        dataSeriesName: options?.title ?? "BTC / USDT",
    });

    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        id: "Candles",
        dataSeries: candleDataSeries,
        stroke: appTheme.ForegroundColor,
        strokeThickness: 1,
        dataPointWidth: 0.8,
        brushUp: appTheme.VividGreen + "CC",
        brushDown: appTheme.VividRed + "CC",
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.VividRed,
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: volumeValues,
                dataSeriesName: "Volume",
            }),
            strokeThickness: 0,
            dataPointWidth: 0.65,
            yAxisId: Y_AXIS_VOLUME_ID,
            paletteProvider: new VolumePaletteProvider(
                openValues,
                closeValues,
                appTheme.VividGreen + "66",
                appTheme.VividRed + "66"
            ),
        })
    );

    const lastIndex = xValues.length - 1;
    const clampIndex = (index: number) => Math.max(0, Math.min(lastIndex, Math.round(index)));
    const minLow = Math.min(...lowValues);
    const maxHigh = Math.max(...highValues);
    const span = Math.max(1, maxHigh - minLow);

    const priceAt = (index: number) => closeValues[clampIndex(index)];
    const xAt = (index: number) => xValues[clampIndex(index)];
    const yAt = (index: number, offsetFraction = 0) => {
        const margin = span * 0.025;
        return Math.max(minLow + margin, Math.min(maxHigh - margin, priceAt(index) + span * offsetFraction));
    };

    return {
        sciChartSurface,
        wasmContext,
        xAxis,
        yAxis,
        candlestickSeries,
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        volumeValues,
        xAt,
        yAt,
        priceAt,
        formatPrice: (value: number) => yAxis.labelProvider.formatCursorLabel(value),
    };
};

export const addDefaultFinancialModifiers = (sciChartSurface: SciChartSurface) => {
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair,
        })
    );
};

export const createTradingLabels = (
    prefix: string,
    pointCount: number,
    options?: {
        startPointIndex?: number;
        includePointLabels?: boolean;
        includeSegmentLabels?: boolean;
        includeAxisLabels?: boolean;
        segmentPairs?: ReadonlyArray<readonly [number, number]>;
        extraLabels?: NonNullable<IMultiPointAnnotationBaseOptions["labels"]>;
    }
): IMultiPointAnnotationBaseOptions["labels"] => {
    const labels: NonNullable<IMultiPointAnnotationBaseOptions["labels"]> = [];
    const startPointIndex = Math.max(0, options?.startPointIndex ?? 0);
    const maxPointIndex = Math.max(0, pointCount - 1);

    if (options?.includePointLabels ?? true) {
        for (let i = startPointIndex; i <= maxPointIndex; i++) {
            labels.push({
                id: `${prefix}-pt-${i + 1}`,
                anchorMode: EMultiPointLabelAnchorMode.Point,
                pointIndex: i,
                verticalTextPosition: EVerticalTextPosition.Above,
                horizontalTextPosition: EHorizontalTextPosition.Center,
                alignment: ETextAlignment.Center,
                fontSize: 12,
                fontWeight: "400",
                padding: new Thickness(0),
                yOffset: -3,
                // color: TRADING_ANNOTATION_COLORS.foreground,
            });
        }
    }

    if ((options?.includeSegmentLabels ?? true) && maxPointIndex >= 1) {
        const defaultPairs: Array<readonly [number, number]> = [];
        for (let i = startPointIndex; i < maxPointIndex; i++) {
            defaultPairs.push([i, i + 1] as const);
        }
        const segmentPairs = options?.segmentPairs?.length ? options.segmentPairs : defaultPairs;
        segmentPairs.forEach(([start, end], index) => {
            labels.push({
                id: `${prefix}-seg-${start + 1}-${end + 1}`,
                anchorMode: EMultiPointLabelAnchorMode.Segment,
                segmentStartIndex: start,
                segmentEndIndex: end,
                segmentRatio: index % 2 === 0 ? 0.5 : 0.62,
                segmentLabelRotationMode: ESegmentLabelRotationMode.Parallel,
                verticalTextPosition: EVerticalTextPosition.Above,
                alignment: ETextAlignment.Center,
                fontSize: 12,
                fontWeight: "400",
                padding: new Thickness(1, 5),
                // color: TRADING_ANNOTATION_COLORS.foreground,
            });
        });
    }

    if (options?.includeAxisLabels ?? true) {
        for (let i = startPointIndex; i <= maxPointIndex; i++) {
            labels.push({
                id: `${prefix}-axis-${i + 1}`,
                anchorMode: EMultiPointLabelAnchorMode.Axis,
                axisLabelDrawMode: EAxisLabelDrawMode.Both,
                pointIndex: i,
            });
        }
    }

    return labels.concat(options?.extraLabels ?? []);
};

export const createTradingAnnotationOptions = (
    prefix: string,
    pointCount: number,
    formatter?: TMultiPointLabelFormatter,
    options?: Parameters<typeof createTradingLabels>[2]
): Partial<IMultiPointAnnotationBaseOptions> => ({
    clipping: EAnnotationClippingMode.SeriesViewRect,
    adornerClipping: EAnnotationClippingMode.SeriesViewRect,
    labels: createTradingLabels(prefix, pointCount, options),

    gripVisibility: EAnnotationVisibilityMode.Always,

    axisLabelVisibility: EAnnotationVisibilityMode.OnInteraction,
    pointLabelVisibility: EAnnotationVisibilityMode.Always,
    segmentLabelVisibility: EAnnotationVisibilityMode.OnInteraction,

    axisLabelStroke: "#FFFFFF",
    axisSpanFillOpacity: 0.2,
    selectionBoxStroke: "#F5F5F533",
    selectionBoxThickness: 8,
    annotationsGripsRadius: 4,
    // annotationsGripsStroke: TRADING_ANNOTATION_COLORS.foreground,
    formatLabel:
        formatter ??
        ((params: IMultiPointLabelFormatParams) => {
            if (params.defaultText?.trim()) {
                return params.defaultText;
            }
            const price = toEngineering(params.anchorValuePoint.y);
            if (params.anchorMode === EMultiPointLabelAnchorMode.Point) {
                return `${prefix}${prefix === "" ? "" : ("-" + (params.labelIndex + 1) + "-")}${price}`;
            }
            if (params.anchorMode === EMultiPointLabelAnchorMode.Segment) {
                const delta = params.valuePoints.length > 1 ? params.tangentValue.y : 0;
                return `${delta >= 0 ? "+" : ""}${toEngineering(delta)}`;
            }
            return price;
        }),
    formatLabelStyle: ({ annotation, label, valuePoints }: { annotation: any; label: any; valuePoints: Point[] }) => {
        if (
            annotation instanceof StopLossTakeProfitAnnotation &&
            label.anchorMode === EMultiPointLabelAnchorMode.Segment
        ) {
            const [p1, p2] = valuePoints;
            return {
                color: p2?.y >= p1?.y ? annotation.takeProfitColor : annotation.stopLossColor,
                fontSize: 18,
            };
        }
        return undefined;
    },
});

export const createAxisPlacementLabels = (
    options: IMultiPointAnnotationBaseOptions & { extendStart?: boolean }
): NonNullable<IMultiPointAnnotationBaseOptions["labels"]> => {
    if ("extendStart" in options) {
        return [
            { anchorMode: EMultiPointLabelAnchorMode.Axis, pointIndex: 0 },
            { anchorMode: EMultiPointLabelAnchorMode.Axis, pointIndex: 1 },
        ];
    }
    return [
        { anchorMode: EMultiPointLabelAnchorMode.Axis, pointIndex: 1 },
        { anchorMode: EMultiPointLabelAnchorMode.Axis, pointIndex: 2 },
    ];
};

export const withPlacementLabelOptions = <T extends IMultiPointAnnotationBaseOptions>(
    options: T,
    settings: { axisLabels: boolean; labelsOnHover: boolean }
): T => {
    const nextOptions = { ...options } as T;
    if (settings.axisLabels) {
        nextOptions.labels = createAxisPlacementLabels(options);
        nextOptions.axisLabelVisibility = EAnnotationVisibilityMode.Always;
        nextOptions.axisLabelStroke = "#FFFFFF";
        nextOptions.axisSpanFillOpacity = 0.2;
    }
    if (settings.labelsOnHover) {
        nextOptions.pointLabelVisibility = EAnnotationVisibilityMode.OnInteraction;
        nextOptions.segmentLabelVisibility = EAnnotationVisibilityMode.OnInteraction;
        nextOptions.axisLabelVisibility = EAnnotationVisibilityMode.OnInteraction;
    }
    return nextOptions;
};

export const defaultSnapToCandleOptions = (seriesId: string): Partial<IMultiPointAnnotationBaseOptions> => ({
    snapMode: ESnapMode.DataPoint,
    snapToSeriesId: seriesId,
    snapToDataPointRadius: 40,
    snapToDataPointOnInit: true,
});

class VolumePaletteProvider implements IFillPaletteProvider {
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private readonly isUpByIndex: boolean[];
    private readonly upColorArgb: number;
    private readonly downColorArgb: number;

    constructor(
        openValues: number[],
        closeValues: number[],
        private readonly upColor: string,
        private readonly downColor: string
    ) {
        this.isUpByIndex = openValues.map((open, index) => (closeValues[index] ?? open) >= open);
        this.upColorArgb = parseColorToUIntArgb(upColor);
        this.downColorArgb = parseColorToUIntArgb(downColor);
    }

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return this.isUpByIndex[index] ? this.upColorArgb : this.downColorArgb;
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return this.overrideFillArgb(xValue, yValue, index, opacity, metadata);
    }

    public toJSON(): TPaletteProviderDefinition {
        return {
            type: EPaletteProviderType.Custom,
            customType: VOLUME_PALETTE_PROVIDER_TYPE,
            options: {
                isUpByIndex: this.isUpByIndex,
                upColor: this.upColor,
                downColor: this.downColor,
            },
        };
    }
}

registerType(
    EBaseType.PaletteProvider,
    VOLUME_PALETTE_PROVIDER_TYPE,
    (options?: { isUpByIndex?: boolean[]; upColor?: string; downColor?: string }) => {
        const isUpByIndex = options?.isUpByIndex ?? [];
        const openValues = isUpByIndex.map((isUp) => (isUp ? 0 : 1));
        const closeValues = isUpByIndex.map((isUp) => (isUp ? 1 : 0));
        return new VolumePaletteProvider(
            openValues,
            closeValues,
            options?.upColor ?? appTheme.VividGreen + "66",
            options?.downColor ?? appTheme.VividRed + "66"
        );
    },
    true
);
