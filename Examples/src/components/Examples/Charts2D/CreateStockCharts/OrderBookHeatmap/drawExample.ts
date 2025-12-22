import {
    SciChartSurface,
    NumericAxis,
    ENumericFormat,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    EAutoRange,
    NumberRange,
    OhlcDataSeries,
    FastCandlestickRenderableSeries,
    XyMovingAverageFilter,
    FastLineRenderableSeries,
    XyDataSeries,
    FastColumnRenderableSeries,
    SciChartJsNavyTheme,
    DateTimeNumericAxis,
    CursorModifier,
    CursorTooltipSvgAnnotation,
    EDataSeriesType,
    EFillPaletteMode,
    ESeriesType,
    FastMountainRenderableSeries,
    FastOhlcRenderableSeries,
    GradientParams,
    IPointMetadata,
    IRenderableSeries,
    OhlcSeriesInfo,
    Point,
    SciChartOverview,
    SeriesInfo,
    parseColorToUIntArgb,
    HeatmapColorMap,
    NonUniformHeatmapDataSeries,
    NonUniformHeatmapRenderableSeries,
    UniformHeatmapRenderableSeries,
    UniformHeatmapDataSeries,
    DefaultPaletteProvider,
    EXyDirection,
} from "scichart";

import { appTheme } from "../../../theme";

type TCandleData = {
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    volumeValues: number[];
};

async function loadCandleData(): Promise<TCandleData> {
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];
    const volumeValues: number[] = [];

    try {
        const filepath =
            "https://raw.githubusercontent.com/chule/sc_histogram/refs/heads/main/BTCUSDT_OHLC.csv";
        const response = await fetch(filepath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();

        // Split into lines and skip header row
        const lines = csvText.split("\n");

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const rowData = line.split(",");

            if (rowData.length >= 6) {
                const priceBar = {
                    date: Number.parseInt(rowData[0]),
                    open: Number.parseFloat(rowData[1]),
                    high: Number.parseFloat(rowData[2]),
                    low: Number.parseFloat(rowData[3]),
                    close: Number.parseFloat(rowData[4]),
                    volume: Number.parseFloat(rowData[5]),
                };

                // Validate the data
                if (!isNaN(priceBar.date) && !isNaN(priceBar.open) && !isNaN(priceBar.high) &&
                    !isNaN(priceBar.low) && !isNaN(priceBar.close) && !isNaN(priceBar.volume)) {
                    
                    xValues.push(priceBar.date);
                    openValues.push(priceBar.open);
                    highValues.push(priceBar.high);
                    lowValues.push(priceBar.low);
                    closeValues.push(priceBar.close);
                    volumeValues.push(priceBar.volume);
                }
            }
        }

        return {
            xValues,
            openValues,
            highValues,
            lowValues,
            closeValues,
            volumeValues,
        };
    } catch (error) {
        console.error("Error loading candle data:", error);
        throw error;
    }
}

type TParsedHeatmapData = {
    zValues: number[][];
    xCellOffsets: number[];
    yCellOffsets: number[];
};

async function loadHeatmapData(): Promise<TParsedHeatmapData> {
    const zValues: number[][] = [];
    let xCellOffsets: number[] = [];
    const yCellOffsets: number[] = [];

    try {
        // File copied in webpack.config.js
        const dataFile =
            "https://raw.githubusercontent.com/chule/sc_histogram/refs/heads/main/orderbook_levels.csv";
        const response = await fetch(dataFile);
        const csvText = await response.text();

        // Split into lines
        const lines = csvText.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const rowData = line.split(",");

            if (i === 0) {
                // Header row - extract date offsets
                const [_, ...cellOffsets] = rowData;
                xCellOffsets = cellOffsets.map((timestampString: string) => {
                    // New format uses Unix timestamps directly
                    const timestamp = Number.parseInt(timestampString);
                    return timestamp || 0;
                });
            } else {
                // Data rows
                const [price, ...zValuesRow] = rowData;

                if (!Number.isNaN(Number.parseInt(price))) {
                    zValues.push(zValuesRow.map((val: string) => Number.parseFloat(val) || 0));
                    yCellOffsets.push(Number.parseInt(price));
                }
            }
        }

        return { zValues, xCellOffsets, yCellOffsets };
    } catch (error) {
        console.error("Error loading heatmap data:", error);
        throw error;
    }
}

// SCICHART EXAMPLE
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme(),
    });

    // Add an XAxis of type DateTimeAxis
    // Note for crypto data this is fine, but for stocks/forex you will need to use CategoryAxis which collapses gaps at weekends
    // In future we have a hybrid IndexDateAxis which 'magically' solves problems of different # of points in stock market datasetd with gaps
    const xAxis = new DateTimeNumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis with 2 Decimal Places
    const priceAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        labelPrefix: "$",
    });
    sciChartSurface.yAxes.add(priceAxis);

    const Y_AXIS_VOLUME_ID = "Y_AXIS_VOLUME_ID";
    // Create a secondary YAxis to host volume data on its own scale
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: Y_AXIS_VOLUME_ID,
            growBy: new NumberRange(0, 4),
            isVisible: false,
            autoRange: EAutoRange.Always,
        })
    );

    const { xValues, openValues, highValues, lowValues, closeValues, volumeValues } = await loadCandleData();

    const gradientStops = [
        { offset: 0, color: "blue" },
        { offset: 0.3, color: "white" },
        { offset: 0.5, color: "orange" },
        { offset: 0.7, color: "yellow" },
        { offset: 1, color: "red" },
    ];
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 1,
        gradientStops,
    });

    const { zValues, xCellOffsets, yCellOffsets } = await loadHeatmapData();

    // Calculate the average step size from all timestamps to get more accurate spacing
    let totalStep = 0;
    let stepCount = 0;
    for (let i = 1; i < xCellOffsets.length; i++) {
        totalStep += xCellOffsets[i] - xCellOffsets[i - 1];
        stepCount++;
    }
    const averageXStep = stepCount > 0 ? totalStep / stepCount : (xCellOffsets[1] - xCellOffsets[0]);

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: xCellOffsets[0],
        xStep: averageXStep,
        yStart: yCellOffsets[0],
        yStep: yCellOffsets[1] - yCellOffsets[0],
        zValues,
        dataSeriesName: "Order Value",
    });

    // Set axis ranges to show both heatmap and candle data
    const candleXRange = [Math.min(...xValues), Math.max(...xValues)];
    const heatmapXRange = [Math.min(...xCellOffsets), Math.max(...xCellOffsets)];

    // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
    // HeatmapDataSeries which correspond to gradient stops at 0..1
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.2,
        dataSeries: heatmapDataSeries,
        colorMap,
    });
    heatmapSeries.useLinearTextureFiltering = false;

    sciChartSurface.renderableSeries.add(heatmapSeries);
    
    // Set initial visible range to show overlapping data
    const overlapStart = Math.max(candleXRange[0], heatmapXRange[0]);
    const overlapEnd = Math.min(candleXRange[1], heatmapXRange[1]);
    
    if (overlapStart < overlapEnd) {
        // There is overlap, show the overlapping region
        xAxis.visibleRange = new NumberRange(overlapStart, overlapEnd);
        console.log("Setting visible range to overlap:", overlapStart, overlapEnd);
    } else {
        // No overlap, show the most recent data (heatmap range)
        xAxis.visibleRange = new NumberRange(heatmapXRange[0], heatmapXRange[1]);
        console.log("No overlap found, showing heatmap range:", heatmapXRange);
    }

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
        strokeThickness: 2, // Make it more visible
        brushUp: appTheme.VividGreen + "AA", // More opaque
        brushDown: appTheme.MutedRed + "AA", // More opaque
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed,
        dataPointWidth: 0.8, // Make candlesticks wider
        isVisible: true, // Explicitly set to visible
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);
    console.log("Added candlestick series with", candleDataSeries.count(), "data points");

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
    sciChartSurface.renderableSeries.add(ohlcSeries); // temp

    // Add some moving averages using SciChart's filters/transforms API
    // when candleDataSeries updates, XyMovingAverageFilter automatically recomputes

    const ma20Series = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyMovingAverageFilter(candleDataSeries, {
            dataSeriesName: "Moving Average (20)",
            length: 20,
        }),
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 2,
        isVisible: true,
    });
    sciChartSurface.renderableSeries.add(ma20Series);
    console.log("Added MA20 series with", ma20Series.dataSeries.count(), "data points");

    const ma50Series = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyMovingAverageFilter(candleDataSeries, {
            dataSeriesName: "Moving Average (50)",
            length: 50,
        }),
        stroke: appTheme.VividPink,
        strokeThickness: 2,
        isVisible: true,
    });
    sciChartSurface.renderableSeries.add(ma50Series);
    console.log("Added MA50 series with", ma50Series.dataSeries.count(), "data points");

    // Add volume data onto the chart
    const volumeSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: volumeValues,
            dataSeriesName: "Volume",
        }),
        strokeThickness: 0,
        // This is how we get volume to scale - on a hidden YAxis
        yAxisId: Y_AXIS_VOLUME_ID,
        // This is how we colour volume bars red or green
        paletteProvider: new VolumePaletteProvider(
            candleDataSeries,
            appTheme.VividGreen + "77",
            appTheme.MutedRed + "77"
        ),
        isVisible: true,
    });
    sciChartSurface.renderableSeries.add(volumeSeries);
    console.log("Added volume series with", volumeSeries.dataSeries.count(), "data points");

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({
            enableZoom: true,
            horizontalGrowFactor: 0.005, // Enable horizontal zooming
            verticalGrowFactor: 0, // Disable vertical zooming
            xyDirection: EXyDirection.XDirection, // Optional: restrict panning to X only
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new CursorModifier({
            crosshairStroke: appTheme.VividOrange,
            axisLabelFill: appTheme.VividOrange,
            tooltipLegendTemplate: getTooltipLegendTemplate,
        })
    );

    // Note: Overview is handled by the React component using SciChartNestedOverview
    // No need to create it here as it would conflict with the React component

    return { sciChartSurface, candlestickSeries, ohlcSeries };
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
        if (seriesInfo.dataSeriesType === EDataSeriesType.Ohlc) {
            const o = seriesInfo as OhlcSeriesInfo;
            legendText = `Open=${o.formattedOpenValue} High=${o.formattedHighValue} Low=${o.formattedLowValue} Close=${o.formattedCloseValue}`;
        } else if (seriesInfo.seriesName === "Order Value") {
            legendText = `${seriesInfo.formattedYValue} Orders: ${seriesInfo.hitTestInfo.zValue}`;
        }

        outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="${textColor}">
          ${seriesInfo.seriesName}: ${legendText}
      </text>`;
    });

    return `<svg width="100%" height="100%">
                <g transform=translate(5,5)>
               ${
                   outputSvgString ? `<rect width="560px" height="110px" fill="#ffffff" opacity="0.5" rx="5" />` : ``
               }         
                ${outputSvgString}
                <g>
             </svg>`;
};

class VolumePaletteProvider extends DefaultPaletteProvider {
    fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private ohlcDataSeries: OhlcDataSeries;
    private upColorArgb: number;
    private downColorArgb: number;

    constructor(masterData: OhlcDataSeries, upColor: string, downColor: string) {
        super();
        this.upColorArgb = parseColorToUIntArgb(upColor);
        this.downColorArgb = parseColorToUIntArgb(downColor);
        this.ohlcDataSeries = masterData;
    }

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

    // Apply same logic as for overrideFillArgb if columns could be thinner than 1px
    overrideStrokeArgb(
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
