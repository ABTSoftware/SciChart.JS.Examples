// SCICHART EXAMPLE
import {
    chartReviver,
    configure2DSurface,
    CursorModifier,
    CursorTooltipSvgAnnotation,
    CustomAnnotation,
    DateTimeNumericAxis,
    EAutoRange,
    EDataSeriesType,
    EExecuteOn,
    EFillPaletteMode,
    EHorizontalAnchorPoint,
    ENumericFormat,
    ESeriesType,
    EVerticalAnchorPoint,
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
    parseColorToUIntArgb,
    Point,
    SciChartOverview,
    SciChartSurface,
    SeriesInfo,
    XyDataSeries,
    XyMovingAverageFilter,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { simpleBinanceRestClient } from "../../../ExampleData/binanceRestClient";
import { CreateTradeMarkerModifier } from "./CreateTradeMarkerModifier";
import { CreateLineAnnotationModifier } from "./CreateLineAnnotationModifier";

export interface IChartControls {
    getDefinition: () => object;
    applyDefinition: (definition: any) => void;
    resetChart: () => void;
}

export const drawExample = async (divElementId: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an XAxis of type DateTimeAxis
    // Note for crypto data this is fine, but for stocks/forex you will need to use CategoryAxis which collapses gaps at weekends
    // In future we have a hybrid IndexDateAxis which 'magically' solves problems of different # of points in stock market datasetd with gaps
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        // autoRange.never as we're setting visibleRange explicitly below. If you dont do this, leave this flag default
        autoRange: EAutoRange.Never,
    });
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

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    const candleDataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        dataSeriesName: "BTC/USDT",
    });
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

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier({ id: "pan" }),
        new CursorModifier({
            id: "cursor",
            crosshairStroke: appTheme.VividOrange,
            axisLabelFill: appTheme.VividOrange,
            tooltipLegendTemplate: getTooltipLegendTemplate,
        }),
        new CreateTradeMarkerModifier({ id: "marker" }),
        new CreateLineAnnotationModifier({ id: "line" })
    );
    sciChartSurface.chartModifiers.getById("marker").isEnabled = false;
    sciChartSurface.chartModifiers.getById("line").isEnabled = false;

    const getDefinition = () => {
        return {
            visibleRange: xAxis.visibleRange,
            annotations: sciChartSurface.annotations.asArray().map((annotation) => annotation.toJSON()),
        };
    };
    const applyDefinition = (definition: any) => {
        configure2DSurface({ annotations: definition.annotations }, sciChartSurface, wasmContext);
        xAxis.visibleRange = definition.visibleRange;
    };

    const resetChart = () => {
        sciChartSurface.annotations.clear(true);
        // Zoom to the latest 100 candles
        const startViewportRange = new Date();
        startViewportRange.setHours(startDate.getHours() - 100);
        xAxis.visibleRange = new NumberRange(startViewportRange.getTime() / 1000, endDate.getTime() / 1000);
    };

    resetChart();

    return { sciChartSurface, controls: { getDefinition, applyDefinition, resetChart } as IChartControls };
};

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
