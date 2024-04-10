// SCICHART EXAMPLE
import {
    CursorModifier,
    CursorTooltipSvgAnnotation,
    DateTimeNumericAxis,
    EAutoRange,
    EDataSeriesType,
    EFillPaletteMode,
    ENumericFormat,
    ESeriesType,
    FastCandlestickRenderableSeries,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    FastOhlcRenderableSeries,
    GradientParams,
    IFillPaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    OhlcSeriesInfo,
    parseColorToUIntArgb, Point,
    SciChartOverview,
    SciChartSurface,
    SeriesInfo,
    XyDataSeries,
    XyMovingAverageFilter,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import {appTheme, simpleBinanceRestClient} from "scichart-example-dependencies";

const divElementId = "chart";
const divOverviewId = "overview";
const Y_AXIS_VOLUME_ID = "Y_AXIS_VOLUME_ID";

export const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Add an XAxis of type DateTimeAxis
    // Note for crypto data this is fine, but for stocks/forex you will need to use CategoryAxis which collapses gaps at weekends
    // In future we have a hybrid IndexDateAxis which 'magically' solves problems of different # of points in stock market datasetd with gaps
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        // autoRange.never as we're setting visibleRange explicitly below. If you dont do this, leave this flag default
        autoRange: EAutoRange.Never
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis with 2 Decimal Places
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            labelPrefix: "$",
            autoRange: EAutoRange.Always
        })
    );

    // Create a secondary YAxis to host volume data on its own scale
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: Y_AXIS_VOLUME_ID,
            growBy: new NumberRange(0, 4),
            isVisible: false,
            autoRange: EAutoRange.Always
        })
    );

    // Fetch data from now to 300 1hr candles ago
    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setHours(endDate.getHours() - 300);
    const priceBars = await simpleBinanceRestClient.getCandles("BTCUSDT", "1h", startDate, endDate);

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

    // Zoom to the latest 100 candles
    const startViewportRange = new Date();
    startViewportRange.setHours(startDate.getHours() - 100);
    xAxis.visibleRange = new NumberRange(startViewportRange.getTime() / 1000, endDate.getTime() / 1000);

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    const candleDataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        dataSeriesName: "BTC/USDT"
    });
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: candleDataSeries,
        stroke: appTheme.ForegroundColor, // used by cursorModifier below
        strokeThickness: 1,
        brushUp: appTheme.VividGreen + "77",
        brushDown: appTheme.MutedRed + "77",
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed
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
        isVisible: false
    });
    sciChartSurface.renderableSeries.add(ohlcSeries);

    // Add some moving averages using SciChart's filters/transforms API
    // when candleDataSeries updates, XyMovingAverageFilter automatically recomputes
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candleDataSeries, {
                dataSeriesName: "Moving Average (20)",
                length: 20
            }),
            stroke: appTheme.VividSkyBlue
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candleDataSeries, {
                dataSeriesName: "Moving Average (50)",
                length: 50
            }),
            stroke: appTheme.VividPink
        })
    );

    // Add volume data onto the chart
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: volumeValues, dataSeriesName: "Volume" }),
            strokeThickness: 0,
            // This is how we get volume to scale - on a hidden YAxis
            yAxisId: Y_AXIS_VOLUME_ID,
            // This is how we colour volume bars red or green
            paletteProvider: new VolumePaletteProvider(
                candleDataSeries,
                appTheme.VividGreen + "77",
                appTheme.MutedRed + "77"
            )
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
            tooltipLegendTemplate: getTooltipLegendTemplate
        })
    );

    // Add Overview chart. This will automatically bind to the parent surface
    // displaying its series. Zooming the chart will zoom the overview and vice versa
    const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
        theme: appTheme.SciChartJsTheme,
        transformRenderableSeries: getOverviewSeries
    });

    return { sciChartSurface, overview, candlestickSeries, ohlcSeries };
};

class VolumePaletteProvider implements IFillPaletteProvider {
    fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private ohlcDataSeries: OhlcDataSeries;
    private upColorArgb: number;
    private downColorArgb: number;

    constructor(masterData: OhlcDataSeries, upColor: string, downColor: string) {
        this.upColorArgb = parseColorToUIntArgb(upColor);
        this.downColorArgb = parseColorToUIntArgb(downColor);
        this.ohlcDataSeries = masterData;
    }
    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}

    // Return up or down color for the volume bars depending on Ohlc data
    overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const isUpCandle =
            this.ohlcDataSeries.getNativeOpenValues().get(index) >=
            this.ohlcDataSeries.getNativeCloseValues().get(index);
        return isUpCandle ? this.upColorArgb : this.downColorArgb;
    }

    // Override stroke as well, even though strokethickness is 0, because stroke is used if column thickness goes to 0.
    overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return this.overrideFillArgb(xValue, yValue, index, opacity, metadata);
    }
}

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
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
                { color: "Transparent", offset: 1 }
            ]),
            stroke: appTheme.VividSkyBlue
        });
    }
    // hide all other series
    return undefined;
};
