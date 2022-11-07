import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumberRange} from "scichart/Core/NumberRange";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {OhlcDataSeries} from "scichart/Charting/Model/OhlcDataSeries";
import {
    FastCandlestickRenderableSeries
} from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {appTheme} from "../../../theme";
import {DateTimeNumericAxis} from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import {simpleBinanceClient} from "./data/binanceClient";
import {EAutoRange} from "scichart/types/AutoRange";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyMovingAverageFilter} from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import {IDeletable} from "scichart/Core/IDeletable";
import {SciChartOverview} from "scichart/Charting/Visuals/SciChartOverview";
import {CursorModifier} from "scichart/Charting/ChartModifiers/CursorModifier";
import {CursorTooltipSvgAnnotation} from "scichart/Charting/Visuals/Annotations/CursorTooltipSvgAnnotation";
import {SeriesInfo} from "scichart/Charting/Model/ChartData/SeriesInfo";
import {EDataSeriesType} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Model/IDataSeries";

const divElementId = "chart";
const divOverviewId = "overview";
const divCursorLegendId = "cursorLegend";

// SCICHART EXAMPLE
const drawExample = async () => {

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // Add an XAxis of type DateTimeAxis
    // Note for crypto data this is fine, but for stocks/forex you will need to use CategoryAxis which collapses gaps at weekends
    // In future we have a hybrid IndexDateAxis which 'magically' solves problems of different # of points in stock market datasetd with gaps
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        // autoRange.never as we're setting visibleRange explicitly below. If you dont do this, leave this flag default
        autoRange: EAutoRange.Never
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis with 2 Decimal Places
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(1.1, 1.2),
        growBy: new NumberRange(0.1, 0.1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        labelPrefix: "$ ",
        autoRange: EAutoRange.Always,
    }));

    // Fetch data from now to 300 1hr candles ago
    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setHours(endDate.getHours() - 300);
    const { xValues, openValues, highValues, lowValues, closeValues, volumeValues } =
        await simpleBinanceClient.getCandles("BTCUSDT", "1h", startDate, endDate);

    // Zoom to the latest 100 candles
    const startViewportRange = new Date();
    startViewportRange.setHours(startDate.getHours() - 100);
    xAxis.visibleRange = new NumberRange(startViewportRange.getTime() / 1000, endDate.getTime() / 1000);

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    const candleDataSeries = new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues, dataSeriesName: "BTC/USDT" });
    sciChartSurface.renderableSeries.add(new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: candleDataSeries,
        stroke: appTheme.ForegroundColor, // used by cursorModifier below
        strokeThickness: 1,
        brushUp: appTheme.VividGreen + "AA",
        brushDown: appTheme.MutedRed + "AA",
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed,
    }));

    // Add some moving averages using SciChart's filters/transforms API
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyMovingAverageFilter(candleDataSeries, { dataSeriesName: "Moving Average (20)", length: 20 }),
        stroke: appTheme.VividSkyBlue
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyMovingAverageFilter(candleDataSeries, { dataSeriesName: "Moving Average (50)", length: 50 }),
        stroke: appTheme.VividPink
    }));

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new CursorModifier({
            tooltipLegendTemplate: getTooltipLegendTemplate
        }));

    // Add Overview chart. This will automatically bind to the parent surface
    // displaying its series. Zooming the chart will zoom the overview and vice versa
    const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
        theme: appTheme.SciChartJsTheme,
    });

    return { sciChartSurface, overview };
};

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
    let outputSvgString = "";

    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        const y = 40 + index * 20;
        const textColor = seriesInfo.stroke;
        outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="${textColor}">
            ${seriesInfo.seriesName}: ${seriesInfo.formattedYValue}
        </text>`;
    });

    return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;

};

const itemsToDelete: IDeletable[] = [];

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function CandlestickChart() {
    React.useEffect(() => {
        (async () => {
            const { sciChartSurface, overview } = await drawExample();
            itemsToDelete.push(sciChartSurface, overview);
        })();
        return () => {
            itemsToDelete.forEach(item => item.delete())
        };
    }, []);


    return (
        <div className={classes.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div id={divElementId} style={{ flexBasis: 400, flexGrow: 1, flexShrink: 1 }} />
                <div id={divOverviewId} style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }} />
            </div>
        </div>
    )
}
