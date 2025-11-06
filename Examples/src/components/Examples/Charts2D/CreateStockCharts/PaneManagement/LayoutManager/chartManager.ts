import {
    SciChartSurface,
    NumericAxis,
    Rect,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    XyDataSeries,
    FastLineRenderableSeries,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    NumberRange,
    TSciChart,
    SciChartSubSurface,
    ISciChartSubSurface,
    RolloverModifier,
    RubberBandXyZoomModifier,
    EExecuteOn,
    Thickness,
    ENumericFormat,
    CategoryAxis,
    EAxisAlignment,
    EAutoRange,
    OhlcDataSeries,
    FastCandlestickRenderableSeries,
    calcAverageForArray,
    FastBandRenderableSeries,
    XyyDataSeries,
    FastColumnRenderableSeries,
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IRenderableSeries,
    parseColorToUIntArgb,
    SmartDateLabelProvider,
    XyMovingAverageFilter,
    EDataSeriesField,
    ELabelAlignment,
    SeriesInfo,
    EDataSeriesType,
    OhlcSeriesInfo,
    RolloverLegendSvgAnnotation,
} from "scichart";

import { appTheme } from "../../../../theme";

import { fetchMultiPaneData } from "../../../../ExampleData/ExampleDataProvider";

const getTradingData = async (startPoints?: number, maxPoints?: number) => {
    const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = await fetchMultiPaneData();

    if (maxPoints !== undefined) {
        return {
            dateValues: dateValues.slice(startPoints, startPoints + maxPoints),
            openValues: openValues.slice(startPoints, startPoints + maxPoints),
            highValues: highValues.slice(startPoints, startPoints + maxPoints),
            lowValues: lowValues.slice(startPoints, startPoints + maxPoints),
            closeValues: closeValues.slice(startPoints, startPoints + maxPoints),
            volumeValues: volumeValues.slice(startPoints, startPoints + maxPoints),
        };
    }

    return { dateValues, openValues, highValues, lowValues, closeValues, volumeValues };
};

// Chart type enumeration
export enum EChartType {
    Line = "line",
    Scatter = "scatter",
    PriceChart = "price",
    MacdChart = "macd",
    RsiChart = "rsi",
}

// Configuration interfaces
export interface IChartDataConfig {
    xValues?: number[];
    yValues?: number[];
    title?: string;
    color?: string;
    strokeThickness?: number;
    xAxisTitle?: string;
    yAxisTitle?: string;
    chartType?: EChartType;
    // Scatter-specific options
    pointMarkerSize?: number;
    pointMarkerFill?: string;
    pointMarkerStroke?: string;
    // Trading chart specific options
    dateValues?: number[];
    openValues?: number[];
    highValues?: number[];
    lowValues?: number[];
    closeValues?: number[];
    volumeValues?: number[];
    useTradingData?: boolean;
}

export interface IChartPositionConfig {
    height: number; // Relative height (0-1)
}

// Panel event callback interfaces
export interface IPanelEventData {
    visualIndex: number;
    actualChartIndex: number;
    panelSizes: number[];
    chartOrder: number[];
}

export interface IPanelResizeEventData extends IPanelEventData {
    oldSize: number;
    newSize: number;
    splitterIndex: number;
}

export interface IPanelMoveEventData extends IPanelEventData {
    fromIndex: number;
    toIndex: number;
    direction: "up" | "down";
}

export interface IPanelMaximizeEventData extends IPanelEventData {
    isMaximized: boolean;
    wasMaximized: boolean;
}

export interface IPanelRemovalEventData extends IPanelEventData {
    removedChartConfig?: IChartDataConfig;
}

export interface IPanelCallbacks {
    onPanelResize?: (data: IPanelResizeEventData) => void;
    onPanelMove?: (data: IPanelMoveEventData) => void;
    onPanelMaximize?: (data: IPanelMaximizeEventData) => void;
    onPanelRemoval?: (data: IPanelRemovalEventData) => void;
}

export interface IPaneManagementConfig {
    charts?: IChartDataConfig[];
    positions?: IChartPositionConfig[];
    initialChartCount?: number;
    syncXAxes?: boolean;
    theme?: any;
    callbacks?: IPanelCallbacks;
}

// Helper class to synchronize the visible range of multiple axes in multi-chart examples
export class AxisSynchroniser {
    visibleRange: NumberRange | null = null;
    axes: (NumericAxis | CategoryAxis)[] = [];
    visibleRangeChanged: any;

    constructor(initialRange?: NumberRange, axes?: (NumericAxis | CategoryAxis)[]) {
        this.visibleRange = initialRange ?? null;
        this.visibleRangeChanged = { raiseEvent: () => {}, subscribe: () => {}, unsubscribe: () => {} };

        this.publishChange = this.publishChange.bind(this);
        if (axes) {
            axes.forEach((a) => this.addAxis(a));
        }
    }

    publishChange(data: { visibleRange: NumberRange }) {
        this.visibleRange = data.visibleRange;
        this.axes.forEach((a) => (a.visibleRange = this.visibleRange));
        this.visibleRangeChanged.raiseEvent(data);
    }

    addAxis(axis: NumericAxis | CategoryAxis) {
        if (!this.axes.includes(axis)) {
            this.axes.push(axis);
            // Only set visibleRange if we have one, otherwise let the axis use its own autoRange
            if (this.visibleRange) {
                axis.visibleRange = this.visibleRange;
            }
            axis.visibleRangeChanged.subscribe(this.publishChange);
        }
    }

    removeAxis(axis: NumericAxis | CategoryAxis) {
        const index = this.axes.findIndex((a) => a === axis);
        if (index >= 0) {
            this.axes.splice(index, 1);
            axis.visibleRangeChanged.unsubscribe(this.publishChange);
        }
    }
}

/**
 * An example PaletteProvider applied to the volume column series. It will return green / red
 * fills and strokes when the main price data bar is up or down
 */
class VolumePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private priceData: OhlcDataSeries;
    private volumeUpArgb: number;
    private volumnDownArgb: number;

    constructor(priceData: OhlcDataSeries, volumeUpColor: string, volumeDownColor: string) {
        this.priceData = priceData;
        this.volumeUpArgb = parseColorToUIntArgb(volumeUpColor);
        this.volumnDownArgb = parseColorToUIntArgb(volumeDownColor);
    }

    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        const open = this.priceData.getNativeOpenValues().get(index);
        const close = this.priceData.getNativeCloseValues().get(index);

        return close >= open ? this.volumeUpArgb : this.volumnDownArgb;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.overrideFillArgb(xValue, yValue, index);
    }
}

class MacdHistogramPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private aboveZeroArgb: number;
    private belowZeroArgb: number;

    constructor(aboveZeroColor: string, belowZeroColor: string) {
        this.aboveZeroArgb = parseColorToUIntArgb(aboveZeroColor);
        this.belowZeroArgb = parseColorToUIntArgb(belowZeroColor);
    }

    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return yValue >= 0 ? this.aboveZeroArgb : this.belowZeroArgb;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.overrideFillArgb(xValue, yValue, index);
    }
}

/**
 * ChartManager handles pure chart operations without any layout concerns
 */
export class ChartManager {
    private colorIndex = 0;
    private tradingDataPromise: Promise<any> | null = null;

    constructor(private wasmContext: TSciChart) {}

    /**
     * Get a random color for chart styling
     */
    private getRandomColor(): string {
        const colors = [
            appTheme.MutedBlue,
            appTheme.MutedOrange,
            appTheme.MutedPink,
            appTheme.MutedPurple,
            appTheme.MutedRed,
        ];
        return colors[this.colorIndex++ % colors.length];
    }

    /**
     * Generate random data for testing purposes
     */
    generateRandomData(count = 100): { xValues: number[]; yValues: number[] } {
        const xValues = [];
        const yValues = [];
        let currentValue = 50;

        for (let i = 0; i < count; i++) {
            xValues.push(i);
            currentValue += (Math.random() - 0.5) * 10;
            currentValue = Math.max(10, Math.min(90, currentValue));
            yValues.push(currentValue);
        }
        return { xValues, yValues };
    }

    /**
     * Get or fetch trading data
     */
    private async getTradingData() {
        if (!this.tradingDataPromise) {
            this.tradingDataPromise = getTradingData();
        }
        return this.tradingDataPromise;
    }

    /**
     * Create a new chart with the specified configuration
     */
    async createChart(
        parentSurface: SciChartSurface,
        config?: IChartDataConfig,
        position?: Rect,
        showXAxisLabels?: boolean
    ): Promise<SciChartSubSurface> {
        const chartType = config?.chartType ?? EChartType.Line;
        const chartTitle = config?.title ?? this.getDefaultTitle(chartType, parentSurface.subCharts.length);

        // Ensure parent surface is properly initialized
        if (!parentSurface) {
            throw new Error("Parent surface is not available");
        }

        const chart = SciChartSubSurface.createSubSurface(parentSurface, {
            position: position ?? new Rect(0, 0, 1, 1),
            theme: appTheme.SciChartJsTheme,
            title: chartTitle,
            titleStyle: { fontSize: 16, color: "#fff" },
            padding: Thickness.fromNumber(1),
        });

        // Wait for chart to be fully initialized before configuring
        await new Promise((resolve) => setTimeout(resolve, 0));

        try {
            // Configure chart based on type
            switch (chartType) {
                case EChartType.PriceChart:
                    await this.createPriceChart(chart, config, showXAxisLabels);
                    break;
                case EChartType.MacdChart:
                    await this.createMacdChart(chart, config, showXAxisLabels);
                    break;
                case EChartType.RsiChart:
                    await this.createRsiChart(chart, config, showXAxisLabels);
                    break;
                case EChartType.Scatter:
                    this.createScatterChart(chart, config, showXAxisLabels);
                    break;
                case EChartType.Line:
                default:
                    this.createLineChart(chart, config, showXAxisLabels);
                    break;
            }
        } catch (error) {
            console.error("Error configuring chart:", error);
            // Continue with basic chart if configuration fails
        }

        return chart;
    }

    /**
     * Get default title based on chart type
     */
    private getDefaultTitle(chartType: EChartType, index: number): string {
        switch (chartType) {
            case EChartType.PriceChart:
                return "EUR/USD Price Chart";
            case EChartType.MacdChart:
                return "MACD Indicator";
            case EChartType.RsiChart:
                return "RSI Indicator";
            default:
                return `Chart ${index + 1}`;
        }
    }

    /**
     * Create a price/candlestick chart
     */
    private async createPriceChart(
        chart: SciChartSubSurface,
        config?: IChartDataConfig,
        showXAxisLabels?: boolean
    ): Promise<void> {
        try {
            const data = await this.getTradingData();
            const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = data;

            // Configure axes with error handling
            const xAxisConfig: any = {
                drawLabels: showXAxisLabels ?? false,
                drawMajorTickLines: showXAxisLabels ?? false,
                drawMinorTickLines: showXAxisLabels ?? false,
                autoRange: EAutoRange.Once,
            };

            if (showXAxisLabels) {
                xAxisConfig.labelProvider = new SmartDateLabelProvider();
            }

            const xAxis = new CategoryAxis(this.wasmContext, xAxisConfig);
            chart.xAxes.add(xAxis);

            const yAxis = new NumericAxis(this.wasmContext, {
                maxAutoTicks: 5,
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.3, 0.11),
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 4,
                cursorLabelFormat: ENumericFormat.Decimal,
                cursorLabelPrecision: 4,
                labelPrefix: "$",
                axisAlignment: EAxisAlignment.Right,
            });
            chart.yAxes.add(yAxis);
        } catch (error) {
            console.error("Error creating price chart axes:", error);
            // Create minimal axes as fallback
            try {
                const xAxis = new CategoryAxis(this.wasmContext);
                const yAxis = new NumericAxis(this.wasmContext);
                chart.xAxes.add(xAxis);
                chart.yAxes.add(yAxis);
            } catch (fallbackError) {
                console.error("Failed to create fallback axes for price chart:", fallbackError);
                return;
            }
        }

        try {
            const data = await this.getTradingData();
            const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = data;

            // OHLC DATA SERIES
            const usdDataSeries = new OhlcDataSeries(this.wasmContext, {
                dataSeriesName: "EUR/USD",
                xValues: dateValues,
                openValues,
                highValues,
                lowValues,
                closeValues,
            });

            const upCol = appTheme.VividGreen;
            const downCol = appTheme.MutedRed;
            const opacity = "AA";

            const fcRendSeries = new FastCandlestickRenderableSeries(this.wasmContext, {
                dataSeries: usdDataSeries,
                stroke: appTheme.ForegroundColor,
                brushUp: upCol + "77",
                brushDown: downCol + "77",
                strokeUp: upCol,
                strokeDown: downCol,
            });
            chart.renderableSeries.add(fcRendSeries);

            // MA1 SERIES
            const maLowDataSeries = new XyMovingAverageFilter(usdDataSeries, {
                dataSeriesName: "MA 50 Low",
                length: 50,
                field: EDataSeriesField.Low,
            });
            const maLowRenderableSeries = new FastLineRenderableSeries(this.wasmContext, {
                dataSeries: maLowDataSeries,
                stroke: appTheme.VividPink,
                strokeThickness: 2,
            });
            chart.renderableSeries.add(maLowRenderableSeries);

            // MA2 SERIES
            const maHighDataSeries = new XyMovingAverageFilter(usdDataSeries, {
                dataSeriesName: "MA 200 High",
                length: 200,
                field: EDataSeriesField.High,
            });
            const maHighRenderableSeries = new FastLineRenderableSeries(this.wasmContext, {
                dataSeries: maHighDataSeries,
                stroke: appTheme.VividSkyBlue,
                strokeThickness: 2,
            });
            chart.renderableSeries.add(maHighRenderableSeries);

            // VOLUME SERIES
            const yAxis2 = new NumericAxis(this.wasmContext, {
                id: "yAxis2",
                isVisible: false,
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0, 3),
            });
            chart.yAxes.add(yAxis2);

            const volumeRenderableSeries = new FastColumnRenderableSeries(this.wasmContext, {
                yAxisId: "yAxis2",
                dataSeries: new XyDataSeries(this.wasmContext, {
                    dataSeriesName: "Volume",
                    xValues: dateValues,
                    yValues: volumeValues,
                }),
                dataPointWidth: 0.5,
                strokeThickness: 1,
                paletteProvider: new VolumePaletteProvider(usdDataSeries, upCol + opacity, downCol + opacity),
            });
            chart.renderableSeries.add(volumeRenderableSeries);

            this.addTradingModifiers(chart);
        } catch (error) {
            console.error("Error creating price chart data series:", error);
        }
    }

    /**
     * Create a MACD chart
     */
    private async createMacdChart(
        chart: SciChartSubSurface,
        config?: IChartDataConfig,
        showXAxisLabels?: boolean
    ): Promise<void> {
        try {
            // Configure axes with error handling
            const xAxisConfig: any = {
                drawLabels: showXAxisLabels ?? false,
                drawMajorTickLines: showXAxisLabels ?? false,
                drawMinorTickLines: showXAxisLabels ?? false,
                autoRange: EAutoRange.Once,
            };

            if (showXAxisLabels) {
                xAxisConfig.labelProvider = new SmartDateLabelProvider();
            }

            const xAxis = new CategoryAxis(this.wasmContext, xAxisConfig);
            chart.xAxes.add(xAxis);

            const yAxis = new NumericAxis(this.wasmContext, {
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.1, 0.1),
                axisAlignment: EAxisAlignment.Right,
                labelPrecision: 2,
                cursorLabelPrecision: 2,
                labelStyle: { alignment: ELabelAlignment.Right },
            });
            yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
            chart.yAxes.add(yAxis);
        } catch (error) {
            console.error("Error creating MACD chart axes:", error);
            // Create minimal axes as fallback
            try {
                const xAxis = new CategoryAxis(this.wasmContext);
                const yAxis = new NumericAxis(this.wasmContext);
                chart.xAxes.add(xAxis);
                chart.yAxes.add(yAxis);
            } catch (fallbackError) {
                console.error("Failed to create fallback axes for MACD chart:", fallbackError);
                return;
            }
        }

        try {
            const data = await this.getTradingData();
            const { dateValues, closeValues } = data;

            const upCol = appTheme.VividGreen;
            const downCol = appTheme.MutedRed;

            // Calculate MACD
            const macdArray: number[] = [];
            const signalArray: number[] = [];
            const divergenceArray: number[] = [];
            for (let i = 0; i < dateValues.length; i++) {
                const maSlow = calcAverageForArray(closeValues, 12, i);
                const maFast = calcAverageForArray(closeValues, 25, i);
                const macd = maSlow - maFast;
                macdArray.push(macd);
                const signal = calcAverageForArray(macdArray, 9, i);
                signalArray.push(signal);
                const divergence = macd - signal;
                divergenceArray.push(divergence);
            }

            const bandSeries = new FastBandRenderableSeries(this.wasmContext, {
                dataSeries: new XyyDataSeries(this.wasmContext, {
                    dataSeriesName: "MACD",
                    xValues: dateValues,
                    yValues: signalArray,
                    y1Values: macdArray,
                }),
                stroke: downCol,
                strokeY1: upCol,
                fill: upCol + "77",
                fillY1: downCol + "77",
            });
            chart.renderableSeries.add(bandSeries);

            const columnSeries = new FastColumnRenderableSeries(this.wasmContext, {
                dataSeries: new XyDataSeries(this.wasmContext, {
                    dataSeriesName: "Divergence",
                    xValues: dateValues,
                    yValues: divergenceArray,
                }),
                paletteProvider: new MacdHistogramPaletteProvider(upCol + "AA", downCol + "AA"),
                dataPointWidth: 0.5,
            });
            chart.renderableSeries.add(columnSeries);

            this.addTradingModifiers(chart);
        } catch (error) {
            console.error("Error creating MACD chart data series:", error);
        }
    }

    /**
     * Create an RSI chart
     */
    private async createRsiChart(
        chart: SciChartSubSurface,
        config?: IChartDataConfig,
        showXAxisLabels?: boolean
    ): Promise<void> {
        try {
            // Configure axes with error handling
            const xAxisConfig: any = {
                autoRange: EAutoRange.Once,
                drawLabels: showXAxisLabels ?? true,
                drawMajorTickLines: showXAxisLabels ?? true,
                drawMinorTickLines: showXAxisLabels ?? true,
            };

            if (showXAxisLabels !== false) {
                xAxisConfig.labelProvider = new SmartDateLabelProvider();
            }

            const xAxis = new CategoryAxis(this.wasmContext, xAxisConfig);
            chart.xAxes.add(xAxis);

            const yAxis = new NumericAxis(this.wasmContext, {
                autoRange: EAutoRange.Always,
                growBy: new NumberRange(0.1, 0.1),
                labelPrecision: 0,
                cursorLabelPrecision: 0,
                axisAlignment: EAxisAlignment.Right,
                labelStyle: { alignment: ELabelAlignment.Right },
            });
            yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
            chart.yAxes.add(yAxis);
        } catch (error) {
            console.error("Error creating RSI chart axes:", error);
            // Create minimal axes as fallback
            try {
                const xAxis = new CategoryAxis(this.wasmContext);
                const yAxis = new NumericAxis(this.wasmContext);
                chart.xAxes.add(xAxis);
                chart.yAxes.add(yAxis);
            } catch (fallbackError) {
                console.error("Failed to create fallback axes for RSI chart:", fallbackError);
                return;
            }
        }

        try {
            const data = await this.getTradingData();
            const { dateValues, closeValues } = data;

            // Calculate RSI
            const RSI_PERIOD = 14;
            const rsiArray: number[] = [];
            const gainArray: number[] = [];
            const lossArray: number[] = [];

            if (dateValues.length) {
                rsiArray.push(NaN);
                gainArray.push(NaN);
                lossArray.push(NaN);
            }

            for (let i = 1; i < dateValues.length; i++) {
                const previousClose = closeValues[i - 1];
                const currentClose = closeValues[i];
                const gain = currentClose > previousClose ? currentClose - previousClose : 0;
                gainArray.push(gain);
                const loss = previousClose > currentClose ? previousClose - currentClose : 0;
                lossArray.push(loss);
                const relativeStrength =
                    calcAverageForArray(gainArray, RSI_PERIOD) / calcAverageForArray(lossArray, RSI_PERIOD);
                const rsi = 100 - 100 / (1 + relativeStrength);
                rsiArray.push(rsi);
            }

            const rsiRenderableSeries = new FastLineRenderableSeries(this.wasmContext, {
                dataSeries: new XyDataSeries(this.wasmContext, {
                    dataSeriesName: "RSI",
                    xValues: dateValues,
                    yValues: rsiArray,
                }),
                stroke: appTheme.MutedBlue,
                strokeThickness: 2,
            });
            chart.renderableSeries.add(rsiRenderableSeries);

            this.addTradingModifiers(chart);
        } catch (error) {
            console.error("Error creating RSI chart data series:", error);
        }
    }

    /**
     * Create a line chart
     */
    private createLineChart(chart: SciChartSubSurface, config?: IChartDataConfig, showXAxisLabels?: boolean): void {
        this.configureAxes(chart, config, showXAxisLabels);
        this.addDataSeries(chart, config);
        this.addModifiers(chart);
    }

    /**
     * Create a scatter chart
     */
    private createScatterChart(chart: SciChartSubSurface, config?: IChartDataConfig, showXAxisLabels?: boolean): void {
        this.configureAxes(chart, config, showXAxisLabels);
        this.addDataSeries(chart, config);
        this.addModifiers(chart);
    }

    /**
     * Configure X and Y axes for simple charts
     */
    private configureAxes(chart: SciChartSubSurface, config?: IChartDataConfig, showXAxisLabels?: boolean): void {
        try {
            const xAxisTitle = config?.xAxisTitle ?? "XAxis";
            const yAxisTitle = config?.yAxisTitle ?? "YAxis";

            const xAxis = new NumericAxis(this.wasmContext, {
                axisTitle: xAxisTitle,
                axisTitleStyle: { fontSize: 12, color: "#ccc" },
                growBy: new NumberRange(0.04, 0.04),
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 1,
                autoRange: EAutoRange.Once,
                drawLabels: showXAxisLabels ?? true,
                drawMajorTickLines: showXAxisLabels ?? true,
                drawMinorTickLines: showXAxisLabels ?? true,
            });

            const yAxis = new NumericAxis(this.wasmContext, {
                axisTitle: yAxisTitle,
                axisTitleStyle: { fontSize: 12, color: "#ccc" },
                growBy: new NumberRange(0.04, 0.04),
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 1,
            });

            chart.xAxes.add(xAxis);
            chart.yAxes.add(yAxis);
        } catch (error) {
            console.error("Error configuring axes:", error);
            // Create minimal axes as fallback
            try {
                const xAxis = new NumericAxis(this.wasmContext);
                const yAxis = new NumericAxis(this.wasmContext);
                chart.xAxes.add(xAxis);
                chart.yAxes.add(yAxis);
            } catch (fallbackError) {
                console.error("Failed to create fallback axes:", fallbackError);
            }
        }
    }

    /**
     * Add chart modifiers for simple charts
     */
    private addModifiers(chart: SciChartSubSurface): void {
        chart.chartModifiers.add(new ZoomPanModifier());
        chart.chartModifiers.add(new MouseWheelZoomModifier());
        chart.chartModifiers.add(new ZoomExtentsModifier());

        // Use modifierGroup to trigger the modifier in the same place on multiple charts
        chart.chartModifiers.add(
            new RolloverModifier({ modifierGroup: "one" }),
            new RubberBandXyZoomModifier({
                executeCondition: { button: EExecuteOn.MouseRightButton },
                modifierGroup: "one",
            })
        );
    }

    /**
     * Add chart modifiers for trading charts
     */
    private addTradingModifiers(chart: SciChartSubSurface): void {
        chart.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
        chart.chartModifiers.add(new ZoomExtentsModifier());
        chart.chartModifiers.add(new MouseWheelZoomModifier());
        chart.chartModifiers.add(
            new RolloverModifier({
                modifierGroup: "cursorGroup",
                showTooltip: false,
            })
        );
    }

    /**
     * Add data series to simple charts
     */
    private addDataSeries(chart: SciChartSubSurface, config?: IChartDataConfig): void {
        const dataSeries = new XyDataSeries(this.wasmContext);

        // Use provided data or generate random data
        if (config?.xValues && config?.yValues) {
            dataSeries.appendRange(config.xValues, config.yValues);
        } else {
            const { xValues, yValues } = this.generateRandomData();
            dataSeries.appendRange(xValues, yValues);
        }

        const strokeColor = config?.color ?? this.getRandomColor();
        const strokeThickness = config?.strokeThickness ?? 2;
        const chartType = config?.chartType ?? EChartType.Line;

        // Create appropriate renderable series based on chart type
        let renderableSeries;

        switch (chartType) {
            case EChartType.Scatter:
                const pointMarkerSize = config?.pointMarkerSize ?? 6;
                const pointMarkerFill = config?.pointMarkerFill ?? strokeColor;
                const pointMarkerStroke = config?.pointMarkerStroke ?? strokeColor;

                renderableSeries = new XyScatterRenderableSeries(this.wasmContext, {
                    dataSeries,
                    pointMarker: new EllipsePointMarker(this.wasmContext, {
                        width: pointMarkerSize,
                        height: pointMarkerSize,
                        fill: pointMarkerFill,
                        stroke: pointMarkerStroke,
                        strokeThickness: 1,
                    }),
                });
                break;

            case EChartType.Line:
            default:
                renderableSeries = new FastLineRenderableSeries(this.wasmContext, {
                    stroke: strokeColor,
                    strokeThickness,
                    dataSeries,
                });
                break;
        }

        chart.renderableSeries.add(renderableSeries);
    }

    /**
     * Extract chart configuration for saving/export
     */
    extractChartConfiguration(chart: ISciChartSubSurface, visualIndex: number): IChartDataConfig {
        if (!chart.renderableSeries || chart.renderableSeries.size() === 0) {
            throw new Error("Chart has no renderable series");
        }

        const renderableSeries = chart.renderableSeries.get(0);
        const dataSeries = renderableSeries.dataSeries;

        // Helper function to extract axis title as string
        const getAxisTitle = (axisTitle: string | string[] | undefined, defaultTitle: string): string => {
            if (!axisTitle) return defaultTitle;
            return Array.isArray(axisTitle) ? axisTitle[0] || defaultTitle : axisTitle;
        };

        // Determine chart type based on series type and chart title
        let chartType = EChartType.Line;
        const title = (chart as any).title || "";

        if (title.includes("Price") || renderableSeries instanceof FastCandlestickRenderableSeries) {
            chartType = EChartType.PriceChart;
        } else if (title.includes("MACD")) {
            chartType = EChartType.MacdChart;
        } else if (title.includes("RSI")) {
            chartType = EChartType.RsiChart;
        } else if (renderableSeries instanceof XyScatterRenderableSeries) {
            chartType = EChartType.Scatter;
        }

        // Base configuration
        const chartConfig: IChartDataConfig = {
            title: title || this.getDefaultTitle(chartType, visualIndex),
            xAxisTitle: getAxisTitle(chart.xAxes.get(0)?.axisTitle, "XAxis"),
            yAxisTitle: getAxisTitle(chart.yAxes.get(0)?.axisTitle, "YAxis"),
            chartType,
            useTradingData:
                chartType === EChartType.PriceChart ||
                chartType === EChartType.MacdChart ||
                chartType === EChartType.RsiChart,
        };

        // For trading charts, we don't extract data points as they use live trading data
        if (
            chartType === EChartType.PriceChart ||
            chartType === EChartType.MacdChart ||
            chartType === EChartType.RsiChart
        ) {
            return chartConfig;
        }

        // For simple charts, extract data points
        const xValues: number[] = [];
        const yValues: number[] = [];

        for (let i = 0; i < dataSeries.count(); i++) {
            xValues.push(dataSeries.getNativeXValues().get(i));
            yValues.push(dataSeries.getNativeYValues().get(i));
        }

        chartConfig.xValues = xValues;
        chartConfig.yValues = yValues;

        // Extract series-specific properties
        if (chartType === EChartType.Line) {
            const lineSeries = renderableSeries as FastLineRenderableSeries;
            chartConfig.color = lineSeries.stroke;
            chartConfig.strokeThickness = lineSeries.strokeThickness;
        } else if (chartType === EChartType.Scatter) {
            const scatterSeries = renderableSeries as XyScatterRenderableSeries;
            if (scatterSeries.pointMarker) {
                chartConfig.pointMarkerSize = scatterSeries.pointMarker.width;
                chartConfig.pointMarkerFill = scatterSeries.pointMarker.fill;
                chartConfig.pointMarkerStroke = scatterSeries.pointMarker.stroke;
            }
        }

        return chartConfig;
    }

    /**
     * Get the X-axis from a chart for synchronization
     */
    getXAxis(chart: ISciChartSubSurface): NumericAxis | CategoryAxis | null {
        return chart.xAxes.size() > 0 ? (chart.xAxes.get(0) as NumericAxis | CategoryAxis) : null;
    }

    /**
     * Validate chart data configuration
     */
    static validateChartDataConfig(config: IChartDataConfig): boolean {
        // Trading charts don't need xValues/yValues validation
        if (
            config.useTradingData ||
            config.chartType === EChartType.PriceChart ||
            config.chartType === EChartType.MacdChart ||
            config.chartType === EChartType.RsiChart
        ) {
            return true;
        }

        if (!config.xValues || !config.yValues) return false;
        if (!Array.isArray(config.xValues) || !Array.isArray(config.yValues)) return false;
        if (config.xValues.length !== config.yValues.length) return false;
        if (config.xValues.length === 0) return false;
        return true;
    }

    /**
     * Validate position configuration
     */
    static validatePositionConfig(config: IChartPositionConfig): boolean {
        if (typeof config.height !== "number") return false;
        if (config.height <= 0 || config.height > 1) return false;
        return true;
    }

    /**
     * Validate pane management configuration
     */
    static validatePaneManagementConfig(config: IPaneManagementConfig): boolean {
        if (config.charts) {
            if (!Array.isArray(config.charts)) return false;
            for (const chartConfig of config.charts) {
                if (!ChartManager.validateChartDataConfig(chartConfig)) return false;
            }
        }

        if (config.positions) {
            if (!Array.isArray(config.positions)) return false;
            for (const posConfig of config.positions) {
                if (!ChartManager.validatePositionConfig(posConfig)) return false;
            }

            // Check if total height doesn't exceed 1
            const totalHeight = config.positions.reduce((sum, pos) => sum + pos.height, 0);
            if (totalHeight > 1) return false;
        }

        if (config.initialChartCount !== undefined) {
            if (typeof config.initialChartCount !== "number" || config.initialChartCount < 1) return false;
        }

        return true;
    }

    /**
     * Normalize position heights to fit within 1
     */
    static normalizePositionHeights(positions: IChartPositionConfig[]): IChartPositionConfig[] {
        const totalHeight = positions.reduce((sum, pos) => sum + pos.height, 0);
        if (totalHeight <= 1) return positions;

        // Normalize heights to fit within 1
        return positions.map((pos) => ({
            ...pos,
            height: pos.height / totalHeight,
        }));
    }
}
