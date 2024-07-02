import {
    EAutoRange,
    easing,
    ECoordinateMode,
    EDataSeriesType,
    EHorizontalAnchorPoint,
    EAnnotationLayer,
    EStrokePaletteMode,
    ESeriesType,
    ENumericFormat,
    EVerticalAnchorPoint,
    CursorModifier,
    CursorTooltipSvgAnnotation,
    DateTimeNumericAxis,
    EllipsePointMarker,
    FastBubbleRenderableSeries,
    FastCandlestickRenderableSeries,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    FastOhlcRenderableSeries,
    GradientParams,
    HorizontalLineAnnotation,
    IPointMarkerPaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    OhlcSeriesInfo,
    parseColorToUIntArgb,
    Point,
    SeriesInfo,
    SciChartOverview,
    SciChartSurface,
    TextAnnotation,
    TPointMarkerArgb,
    XyzDataSeries,
    XyDataSeries,
    XyMovingAverageFilter,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { TPriceBar } from "../../../ExampleData/binanceRestClient";
import { appTheme } from "../../../theme";
import { VolumePaletteProvider } from "./VolumePaletteProvider";

// Trades over this size will be rendered as bubbles on the chart
export const LARGE_TRADE_THRESHOLD = 25_000;

export const createCandlestickChart = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an XAxis of type DateTimeAxis
    // Note for crypto data this is fine, but for stocks/forex you will need to use CategoryAxis which collapses gaps at weekends
    // In future we have a hybrid IndexDateAxis which 'magically' solves problems of different # of points in stock market datasetd with gaps
    const xAxis = new DateTimeNumericAxis(wasmContext);
    // xAxis.labelProvider.useCache = false;
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis with 2 Decimal Places
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            labelPrefix: "$",
            autoRange: EAutoRange.Always,
        })
    );

    // Create a secondary YAxis to host volume data on its own scale
    const Y_AXIS_VOLUME_ID = "Y_AXIS_VOLUME_ID";
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: Y_AXIS_VOLUME_ID,
            growBy: new NumberRange(0, 4),
            isVisible: false,
            autoRange: EAutoRange.Always,
        })
    );

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    const candleDataSeries = new OhlcDataSeries(wasmContext);
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: candleDataSeries,
        stroke: appTheme.ForegroundColor, // used by cursorModifier below
        strokeThickness: 1,
        brushUp: appTheme.VividGreen + "77",
        brushDown: appTheme.MutedRed + "77",
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed,
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Add an Ohlcseries. this will be invisible to begin with
    const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
        dataSeries: candleDataSeries,
        stroke: appTheme.ForegroundColor, // used by cursorModifier below
        strokeThickness: 1,
        dataPointWidth: 0.9,
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed,
        isVisible: false,
    });
    sciChartSurface.renderableSeries.add(ohlcSeries);

    // Add some moving averages using SciChart's filters/transforms API
    // when candleDataSeries updates, XyMovingAverageFilter automatically recomputes
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candleDataSeries, {
                dataSeriesName: "Moving Average (20)",
                length: 20,
            }),
            stroke: appTheme.VividSkyBlue,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candleDataSeries, {
                dataSeriesName: "Moving Average (50)",
                length: 50,
            }),
            stroke: appTheme.VividPink,
        })
    );

    // Add volume data onto the chart
    const volumeDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Volume" });
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: volumeDataSeries,
            strokeThickness: 0,
            // This is how we get volume to scale - on a hidden YAxis
            yAxisId: Y_AXIS_VOLUME_ID,
            // This is how we colour volume bars red or green
            paletteProvider: new VolumePaletteProvider(
                candleDataSeries,
                appTheme.VividGreen + "77",
                appTheme.MutedRed + "77"
            ),
        })
    );

    // Add large trades data to the chart
    const largeTradesDataSeries = new XyzDataSeries(wasmContext, {
        dataSeriesName: `Trades Size > $${LARGE_TRADE_THRESHOLD.toLocaleString()}`,
    });
    sciChartSurface.renderableSeries.add(
        new FastBubbleRenderableSeries(wasmContext, {
            dataSeries: largeTradesDataSeries,
            stroke: appTheme.VividGreen,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 64,
                height: 64,
                opacity: 0.23,
                strokeThickness: 2,
            }),
            paletteProvider: new LargeTradesPaletteProvider(appTheme.VividGreen, appTheme.MutedRed),
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new CursorModifier({
            crosshairStroke: appTheme.VividOrange,
            axisLabelFill: appTheme.VividOrange,
            tooltipLegendTemplate: getTooltipLegendTemplate,
        })
    );

    // Add Overview chart. This will automatically bind to the parent surface
    // displaying its series. Zooming the chart will zoom the overview and vice versa
    // commenting this and exporing this out of the function
    // const sciChartOverview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
    //     theme: appTheme.SciChartJsTheme,
    //     transformRenderableSeries: getOverviewSeries,
    // });

    // Add a watermark annotation, updated in setData() function
    const watermarkAnnotation = new TextAnnotation({
        x1: 0.5,
        y1: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        opacity: 0.2,
        textColor: appTheme.ForegroundColor,
        fontSize: 48,
        fontWeight: "Bold",
        text: "",
    });
    sciChartSurface.annotations.add(watermarkAnnotation);

    // Add a vertical line annotation at the latest price
    const latestPriceAnnotation = new HorizontalLineAnnotation({
        isHidden: true,
        strokeDashArray: [2, 2],
        strokeThickness: 1,
        axisFontSize: 13,
        axisLabelStroke: appTheme.ForegroundColor,
        showLabel: true,
    });
    sciChartSurface.annotations.add(latestPriceAnnotation);

    // Update the latest price annotation position & colour
    const updateLatestPriceAnnotation = (priceBar: TPriceBar) => {
        latestPriceAnnotation.isHidden = false;
        latestPriceAnnotation.y1 = priceBar.close;
        latestPriceAnnotation.stroke = priceBar.close > priceBar.open ? appTheme.VividGreen : appTheme.MutedRed;
        latestPriceAnnotation.axisLabelFill = latestPriceAnnotation.stroke;
    };

    // Setup functions to return to caller to control the candlestick chart
    const setData = (symbolName: string, watermarkText: string, priceBars: TPriceBar[]) => {
        console.log(`createCandlestickChart(): Setting data for ${symbolName}, ${priceBars.length} candles`);

        // Maps PriceBar { date, open, high, low, close, volume } to structure-of-arrays expected by scichart
        const xValues: number[] = [];
        const openValues: number[] = [];
        const highValues: number[] = [];
        const lowValues: number[] = [];
        const closeValues: number[] = [];
        const volumeValues: number[] = [];
        priceBars.forEach((priceBar: any) => {
            xValues.push(priceBar.date);
            openValues.push(priceBar.open);
            highValues.push(priceBar.high);
            lowValues.push(priceBar.low);
            closeValues.push(priceBar.close);
            volumeValues.push(priceBar.volume);
        });

        // Clear the dataseries and re-add data
        candleDataSeries.clear();
        candleDataSeries.appendRange(xValues, openValues, highValues, lowValues, closeValues);
        volumeDataSeries.clear();
        volumeDataSeries.appendRange(xValues, volumeValues);

        // Set the candle data series name (used by tooltips / legends)
        candleDataSeries.dataSeriesName = symbolName;

        // Update the watermark text & priceBarAnnotation
        watermarkAnnotation.text = watermarkText;
        updateLatestPriceAnnotation(priceBars[priceBars.length - 1]);
    };

    const onNewTrade = (priceBar: TPriceBar, tradeSize: number, lastTradeBuyOrSell: boolean) => {
        // On new price bar from the exchange, we want to append or update the existing one (based on time)
        const currentIndex = candleDataSeries.count() - 1;
        const getLatestCandleDate = candleDataSeries.getNativeXValues().get(currentIndex);
        if (priceBar.date / 1000 === getLatestCandleDate) {
            // Case where the exchange sends a candle which is already on the chart, update it
            candleDataSeries.update(currentIndex, priceBar.open, priceBar.high, priceBar.low, priceBar.close);
            volumeDataSeries.update(currentIndex, priceBar.volume);
        } else {
            // Case where the exchange sends a new candle, append it
            candleDataSeries.append(priceBar.date / 1000, priceBar.open, priceBar.high, priceBar.low, priceBar.close);
            volumeDataSeries.append(priceBar.date / 1000, priceBar.volume);

            // Is the latest candle in the viewport?
            if (xAxis.visibleRange.max > getLatestCandleDate) {
                // If so, shift the xAxis by one candle
                const dateDifference = priceBar.date / 1000 - getLatestCandleDate;
                const shiftedRange = new NumberRange(
                    xAxis.visibleRange.min + dateDifference,
                    xAxis.visibleRange.max + dateDifference
                );
                xAxis.animateVisibleRange(shiftedRange, 250, easing.inOutQuad);
            }
        }
        // Update the large trades displaying trades > $LARGE_TRADE_THRESHOLD in value
        const tradeValue = tradeSize * priceBar.close;
        if (tradeValue > LARGE_TRADE_THRESHOLD) {
            const tradeValueNormalised = 20 * Math.log10(tradeValue) - 70;
            console.log(
                `Large trade: ${new Date(priceBar.date)}, price ${priceBar.close}, size ${
                    lastTradeBuyOrSell ? "+" : "-"
                }$${tradeValue.toFixed(2)}`
            );
            largeTradesDataSeries.append(priceBar.date / 1000, priceBar.close, tradeValueNormalised, {
                isSelected: false,
                // @ts-ignore
                lastTradeBuyOrSell,
            });
        }
        // Update the latest price line annotation
        updateLatestPriceAnnotation(priceBar);
    };

    const setXRange = (startDate: Date, endDate: Date) => {
        console.log(`createCandlestickChart(): Setting chart range to ${startDate} - ${endDate}`);
        xAxis.visibleRange = new NumberRange(startDate.getTime() / 1000, endDate.getTime() / 1000);
    };

    const enableCandlestick = () => {
        candlestickSeries.isVisible = true;
        ohlcSeries.isVisible = false;
    };

    const enableOhlc = () => {
        candlestickSeries.isVisible = false;
        ohlcSeries.isVisible = true;
    };

    return {
        sciChartSurface,
        sciChartOverview,
        controls: { setData, onNewTrade, setXRange, enableCandlestick, enableOhlc },
    };
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

export const sciChartOverview = {
    theme: appTheme.SciChartJsTheme,
    transformRenderableSeries: getOverviewSeries,
};

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
    let outputSvgString = "";

    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        const y = 20 + index * 20;
        const textColor = seriesInfo.stroke;
        let legendText = seriesInfo.formattedYValue;
        let separator = ":";
        if (seriesInfo.dataSeriesType === EDataSeriesType.Ohlc) {
            const o = seriesInfo as OhlcSeriesInfo;
            legendText = `Open=${o.formattedOpenValue} High=${o.formattedHighValue} Low=${o.formattedLowValue} Close=${o.formattedCloseValue}`;
        }
        if (seriesInfo.dataSeriesType === EDataSeriesType.Xyz) {
            legendText = "";
            separator = "";
        }
        outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="${textColor}">
            ${seriesInfo.seriesName}${separator} ${legendText}
        </text>`;
    });

    return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;
};

// Class which manages red/green fill colouring on Large Trades depending on if the trade is buy or sell
class LargeTradesPaletteProvider implements IPointMarkerPaletteProvider {
    private readonly upColorArgb: number;
    private readonly downColorArgb: number;

    constructor(upColor: string, downColor: string) {
        this.upColorArgb = parseColorToUIntArgb(upColor);
        this.downColorArgb = parseColorToUIntArgb(downColor);
    }

    // Return up or down color for the large trades depending on if last trade was buy or sell
    overridePointMarkerArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): TPointMarkerArgb {
        // @ts-ignore
        const tradeColor = metadata?.lastTradeBuyOrSell ? this.upColorArgb : this.downColorArgb;
        return { fill: tradeColor, stroke: tradeColor };
    }

    strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;

    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}
}
