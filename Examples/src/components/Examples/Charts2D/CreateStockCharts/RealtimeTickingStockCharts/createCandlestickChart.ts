import {EFillPaletteMode, IFillPaletteProvider} from "scichart/Charting/Model/IPaletteProvider";
import {OhlcDataSeries} from "scichart/Charting/Model/OhlcDataSeries";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";
import {IRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import {IPointMetadata} from "scichart/Charting/Model/IPointMetadata";
import {SeriesInfo} from "scichart/Charting/Model/ChartData/SeriesInfo";
import {CursorTooltipSvgAnnotation} from "scichart/Charting/Visuals/Annotations/CursorTooltipSvgAnnotation";
import {EDataSeriesType} from "scichart/Charting/Model/IDataSeries";
import {OhlcSeriesInfo} from "scichart/Charting/Model/ChartData/OhlcSeriesInfo";
import {ESeriesType} from "scichart/types/SeriesType";
import {FastMountainRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";
import {appTheme} from "../../../theme";
import {SciChartSurface} from "scichart";
import {DateTimeNumericAxis} from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import {EAutoRange} from "scichart/types/AutoRange";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {FastCandlestickRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import {FastOhlcRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastOhlcRenderableSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyMovingAverageFilter} from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import {FastColumnRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {CursorModifier} from "scichart/Charting/ChartModifiers/CursorModifier";
import {SciChartOverview} from "scichart/Charting/Visuals/SciChartOverview";
import {TPriceBar} from "../../BasicChartTypes/CandlestickChart/data/binanceRestClient";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EAnnotationLayer} from "scichart/Charting/Visuals/Annotations/IAnnotation";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import {HorizontalLineAnnotation} from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";

export const createCandlestickChart = async (divChartId: string, divOverviewId: string) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divChartId, {
        theme: appTheme.SciChartJsTheme
    });

    // Add an XAxis of type DateTimeAxis
    // Note for crypto data this is fine, but for stocks/forex you will need to use CategoryAxis which collapses gaps at weekends
    // In future we have a hybrid IndexDateAxis which 'magically' solves problems of different # of points in stock market datasetd with gaps
    const xAxis = new DateTimeNumericAxis(wasmContext);
    xAxis.labelProvider.useCache = false;
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
    const Y_AXIS_VOLUME_ID = "Y_AXIS_VOLUME_ID";
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: Y_AXIS_VOLUME_ID,
            growBy: new NumberRange(0, 4),
            isVisible: false,
            autoRange: EAutoRange.Always
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
    const sciChartOverview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
        theme: appTheme.SciChartJsTheme,
        transformRenderableSeries: getOverviewSeries
    });

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
        annotationLayer: EAnnotationLayer.BelowChart
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

    const updatePriceBar = (priceBar: TPriceBar) => {
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
                const shiftedRange = new NumberRange(xAxis.visibleRange.min + dateDifference, xAxis.visibleRange.max + dateDifference);
                xAxis.animateVisibleRange(shiftedRange, 250, easing.inOutQuad);
            }
        }
        updateLatestPriceAnnotation(priceBar);
    };

    const setXRange = (startDate: Date, endDate: Date) => {
        console.log(`createCandlestickChart(): Setting chart range to ${startDate} - ${endDate}`)
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

    return { sciChartSurface, sciChartOverview, controls: { setData, updatePriceBar, setXRange, enableCandlestick, enableOhlc } };
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
}
