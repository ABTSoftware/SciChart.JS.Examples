import {
    SciChartVerticalGroup,
    CategoryAxis,
    EAxisAlignment,
    SciChartSurface,
    EAutoRange,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    FastCandlestickRenderableSeries,
    XyDataSeries,
    calcAverageForArray,
    FastLineRenderableSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    RolloverModifier,
    FastBandRenderableSeries,
    XyyDataSeries,
    FastColumnRenderableSeries,
    EXyDirection,
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IRenderableSeries,
    parseColorToUIntArgb,
    ENumericFormat,
    SmartDateLabelProvider,
    XyMovingAverageFilter,
    EDataSeriesField,
    ELabelAlignment,
    SeriesInfo,
    EDataSeriesType,
    OhlcSeriesInfo,
    RolloverLegendSvgAnnotation,
    SciChartOverview,
    ESeriesType,
    FastMountainRenderableSeries,
    GradientParams,
    Point,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EAnnotationLayer,
} from "scichart";
import { ExampleDataProvider, IOhlcvValues } from "../../../ExampleData/ExampleDataProvider";
import { multiPaneData } from "../../../ExampleData/multiPaneData";
import { appTheme } from "../../../theme";

const divElementId1 = "cc_chart_3_1";
const divElementId2 = "cc_chart_3_2";
const divElementId3 = "cc_chart_3_3";
const divOverviewId = "cc_overview";

const getTradingData = (startPoints?: number, maxPoints?: number): IOhlcvValues => {
    const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = multiPaneData;

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

// Override the standard legend displayed by RolloverModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: RolloverLegendSvgAnnotation) => {
    let outputSvgString = "";

    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        const y = 20 + index * 20;
        const textColor = seriesInfo.stroke;
        let legendText = seriesInfo.formattedYValue;
        if (seriesInfo.dataSeriesType === EDataSeriesType.Ohlc) {
            const o = seriesInfo as OhlcSeriesInfo;
            legendText = `Open=${o.formattedOpenValue} High=${o.formattedHighValue} Low=${o.formattedLowValue} Close=${o.formattedCloseValue}`;
        }
        outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="${textColor}">
            ${seriesInfo.seriesName}: ${legendText}
        </text>`;
    });

    return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;
};

// Override the Renderableseries to display on the scichart overview
const getOverviewSeries = (defaultSeries: IRenderableSeries) => {
    if (defaultSeries.type === ESeriesType.CandlestickSeries) {
        // Swap the default candlestick series on the overview chart for a mountain series. Same data
        return new FastMountainRenderableSeries(defaultSeries.parentSurface.webAssemblyContext2D, {
            dataSeries: defaultSeries.dataSeries,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.VividSkyBlue + "77", offset: 0 },
                { color: "Transparent", offset: 1 },
            ]),
            stroke: appTheme.VividSkyBlue,
        });
    }
    // hide all other series
    return undefined;
};

export const getChartsInitializationAPI = () => {
    // We can group together charts using VerticalChartGroup type
    const verticalGroup = new SciChartVerticalGroup();
    const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = getTradingData();

    let chart1XAxis: CategoryAxis;
    let chart2XAxis: CategoryAxis;
    let chart3XAxis: CategoryAxis;
    const axisAlignment = EAxisAlignment.Right;

    const upCol = appTheme.VividGreen;
    const downCol = appTheme.MutedRed;
    const opacity = "AA";

    // CHART 1
    const drawPriceChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            // prevent default size settings
            disableAspect: true,
            theme: appTheme.SciChartJsTheme,
        });

        chart1XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(chart1XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 5,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.3, 0.11),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
            cursorLabelFormat: ENumericFormat.Decimal,
            cursorLabelPrecision: 4,
            labelPrefix: "$",
            axisAlignment,
        });
        sciChartSurface.yAxes.add(yAxis);

        // OHLC DATA SERIES
        const usdDataSeries = new OhlcDataSeries(wasmContext, {
            dataSeriesName: "EUR/USD",
            xValues: dateValues,
            openValues,
            highValues,
            lowValues,
            closeValues,
        });
        const fcRendSeries = new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: usdDataSeries,
            stroke: appTheme.ForegroundColor, // Used for legend template
            brushUp: upCol + "77",
            brushDown: downCol + "77",
            strokeUp: upCol,
            strokeDown: downCol,
        });
        sciChartSurface.renderableSeries.add(fcRendSeries);

        // MA1 SERIES
        const maLowDataSeries = new XyMovingAverageFilter(usdDataSeries, {
            dataSeriesName: "MA 50 Low",
            length: 50,
            field: EDataSeriesField.Low,
        });
        const maLowRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: maLowDataSeries,
        });
        sciChartSurface.renderableSeries.add(maLowRenderableSeries);
        maLowRenderableSeries.rolloverModifierProps.tooltipColor = "red";
        maLowRenderableSeries.rolloverModifierProps.markerColor = "red";
        maLowRenderableSeries.stroke = appTheme.VividPink;
        maLowRenderableSeries.strokeThickness = 2;

        // MA2 SERIES
        const maHighDataSeries = new XyMovingAverageFilter(usdDataSeries, {
            dataSeriesName: "MA 200 High",
            length: 200,
            field: EDataSeriesField.High,
        });
        const maHighRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: maHighDataSeries,
        });
        sciChartSurface.renderableSeries.add(maHighRenderableSeries);
        maHighRenderableSeries.stroke = appTheme.VividSkyBlue;
        maHighRenderableSeries.strokeThickness = 2;

        // VOLUME SERIES
        const yAxis2 = new NumericAxis(wasmContext, {
            id: "yAxis2",
            isVisible: false,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 3),
        });
        sciChartSurface.yAxes.add(yAxis2);

        const volumeRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
            yAxisId: "yAxis2",
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "Volume",
                xValues: dateValues,
                yValues: volumeValues,
            }),
            dataPointWidth: 0.5,
            strokeThickness: 1,
            paletteProvider: new VolumePaletteProvider(usdDataSeries, upCol + opacity, downCol + opacity),
        });
        sciChartSurface.renderableSeries.add(volumeRenderableSeries);

        // Add a watermark annotation
        const watermarkAnnotation = new TextAnnotation({
            x1: 0.5,
            y1: 0.5,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.17,
            textColor: appTheme.ForegroundColor,
            fontSize: 48,
            fontWeight: "Bold",
            text: "Euro / U.S. Dollar - Daily",
        });
        sciChartSurface.annotations.add(watermarkAnnotation);

        // MODIFIERS
        sciChartSurface.chartModifiers.add(new ZoomPanModifier());
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({
                modifierGroup: "cursorGroup",
                showTooltip: false,
                tooltipLegendTemplate: getTooltipLegendTemplate,
            })
        );

        verticalGroup.addSurfaceToGroup(sciChartSurface);

        return { wasmContext, sciChartSurface };
    };

    // CHART 2 - MACD
    const drawMacdChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            // prevent default size settings
            disableAspect: true,
            theme: appTheme.SciChartJsTheme,
        });

        chart2XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(chart2XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment,
            labelPrecision: 2,
            cursorLabelPrecision: 2,
            labelStyle: { alignment: ELabelAlignment.Right },
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
        sciChartSurface.yAxes.add(yAxis);

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

        const bandSeries = new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
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
        sciChartSurface.renderableSeries.add(bandSeries);

        const columnSeries = new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "Divergence",
                xValues: dateValues,
                yValues: divergenceArray,
            }),
            paletteProvider: new MacdHistogramPaletteProvider(upCol + "AA", downCol + "AA"),
            dataPointWidth: 0.5,
        });
        sciChartSurface.renderableSeries.add(columnSeries);

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({
                modifierGroup: "cursorGroup",
                showTooltip: false,
                tooltipLegendTemplate: getTooltipLegendTemplate,
            })
        );

        verticalGroup.addSurfaceToGroup(sciChartSurface);

        return { wasmContext, sciChartSurface };
    };

    // CHART 3 - RSI
    const drawRsiChart = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            // prevent default size settings
            disableAspect: true,
            theme: appTheme.SciChartJsTheme,
        });

        chart3XAxis = new CategoryAxis(wasmContext, {
            autoRange: EAutoRange.Once,
            labelProvider: new SmartDateLabelProvider(),
        });
        sciChartSurface.xAxes.add(chart3XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            labelPrecision: 0,
            cursorLabelPrecision: 0,
            axisAlignment,
            labelStyle: { alignment: ELabelAlignment.Right },
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
        sciChartSurface.yAxes.add(yAxis);

        const RSI_PERIOD = 14;
        const rsiArray: number[] = [];
        const gainArray: number[] = [];
        const lossArray: number[] = [];
        rsiArray.push(NaN);
        gainArray.push(NaN);
        lossArray.push(NaN);
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
        const rsiRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "RSI",
                xValues: dateValues,
                yValues: rsiArray,
            }),
            stroke: appTheme.MutedBlue,
            strokeThickness: 2,
        });
        sciChartSurface.renderableSeries.add(rsiRenderableSeries);

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({
                modifierGroup: "cursorGroup",
                showTooltip: false,
                tooltipLegendTemplate: getTooltipLegendTemplate,
            })
        );

        verticalGroup.addSurfaceToGroup(sciChartSurface);

        return { wasmContext, sciChartSurface };
    };

    // DRAW OVERVIEW
    // Must be done after main chart creation
    const drawOverview = (mainSurface: SciChartSurface) => async (rootElement: string | HTMLDivElement) => {
        const overview = await SciChartOverview.create(mainSurface, rootElement, {
            // prevent default size settings
            disableAspect: true,
            theme: appTheme.SciChartJsTheme,
            transformRenderableSeries: getOverviewSeries,
        });

        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    const configureAfterInit = () => {
        const synchronizeAxes = () => {
            // TODO refactor using AxisSynchroniser

            // SYNCHRONIZE VISIBLE RANGES
            chart1XAxis.visibleRangeChanged.subscribe((data1) => {
                chart2XAxis.visibleRange = data1.visibleRange;
                chart3XAxis.visibleRange = data1.visibleRange;
            });
            chart2XAxis.visibleRangeChanged.subscribe((data1) => {
                chart1XAxis.visibleRange = data1.visibleRange;
                chart3XAxis.visibleRange = data1.visibleRange;
            });
            chart3XAxis.visibleRangeChanged.subscribe((data1) => {
                chart1XAxis.visibleRange = data1.visibleRange;
                chart2XAxis.visibleRange = data1.visibleRange;
            });
        };

        synchronizeAxes();

        // Force showing the latest 200 bars
        const oneDay = 600; // One day in javascript Date() has a value of 600
        const twoHundredDays = oneDay * 200; // 200 days in JS date
        const twoHundredDaysSciChartFormat = twoHundredDays / 1000; // SciChart expects date.getTime() / 1000
        chart1XAxis.visibleRange = new NumberRange(
            chart1XAxis.visibleRange.max - twoHundredDaysSciChartFormat,
            chart1XAxis.visibleRange.max
        );
    };

    return { drawPriceChart, drawMacdChart, drawRsiChart, drawOverview, configureAfterInit };
};

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

// tslint:disable-next-line:max-classes-per-file
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
