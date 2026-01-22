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

// const ohlcFilePath = "https://raw.githubusercontent.com/chule/sc_histogram/refs/heads/main/LTCUSDT_OHLC.csv"
// const orderbookLevels = "https://raw.githubusercontent.com/chule/sc_histogram/refs/heads/main/orderbook_levels.csv";

const ohlcFilePath = "https://raw.githubusercontent.com/chule/sc_histogram/refs/heads/main/12min/LTCUSDT_OHLC.csv";
const orderbookLevels =
    "https://raw.githubusercontent.com/chule/sc_histogram/refs/heads/main/12min/orderbook_levels.csv";

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
        const filepath = ohlcFilePath;
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
                if (
                    !isNaN(priceBar.date) &&
                    !isNaN(priceBar.open) &&
                    !isNaN(priceBar.high) &&
                    !isNaN(priceBar.low) &&
                    !isNaN(priceBar.close) &&
                    !isNaN(priceBar.volume)
                ) {
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
    minValue: number;
    maxValue: number;
};

async function loadHeatmapData(): Promise<TParsedHeatmapData> {
    const zValues: number[][] = [];
    let xCellOffsets: number[] = [];
    const yCellOffsets: number[] = [];
    let minValue = Infinity;
    let maxValue = -Infinity;

    try {
        // File copied in webpack.config.js
        const dataFile = orderbookLevels;
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
                    const rowValues = zValuesRow.map((val: string) => {
                        const numVal = Number.parseFloat(val) || 0;
                        // Track min/max values for non-zero values
                        if (numVal > 0) {
                            minValue = Math.min(minValue, numVal);
                            maxValue = Math.max(maxValue, numVal);
                        }
                        return numVal;
                    });

                    zValues.push(rowValues);
                    yCellOffsets.push(Number.parseFloat(price));
                }
            }
        }

        // Handle edge case where no valid values were found
        if (minValue === Infinity) {
            minValue = 0;
            maxValue = 1;
        }

        return { zValues, xCellOffsets, yCellOffsets, minValue, maxValue };
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
    // Note for crypto data this is fine, but for stocks/forex you will need to use DiscontinuousDateAxis which collapses gaps at weekends
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        cursorLabelFormat: ENumericFormat.Date_HHMMSS,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis with 2 Decimal Places
    const priceAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        labelPrefix: "$",
    });
    sciChartSurface.yAxes.add(priceAxis);

    const { xValues, openValues, highValues, lowValues, closeValues, volumeValues } = await loadCandleData();

    const { zValues, xCellOffsets, yCellOffsets, minValue, maxValue } = await loadHeatmapData();

    // #1034A6 - Egyptian Blue (lowest)

    // #412F88 - Purple

    // #722B6A - Magenta

    // #A2264B - Amaranth Purple

    // #D3212D - Amaranth Red

    // #F62D2D - Deep Red (highest)

    // const gradientStops = [
    //     { offset: 0, color: appTheme.DarkIndigo },
    //     { offset: 0.03, color: "#412F88" },
    //     { offset: 0.05, color: "#722B6A" },
    //     { offset: 0.07, color: "#A2264B" },
    //     { offset: 0.5, color: "#D3212D" },
    //     { offset: 1, color: "#F62D2D" },
    // ];

    // const gradientStops = [
    //     { offset: 0, color: appTheme.DarkIndigo },
    //     { offset: 0.03, color: appTheme.VividPurple },
    //     { offset: 0.05, color: appTheme.VividBlue },
    //     { offset: 0.07, color: appTheme.PaleOrange },
    //     { offset: 0.5, color: appTheme.VividRed },
    // ];

    // #1d4877 - Dark blue (lowest liquidity)

    // #1b8a5a - Teal/cyan

    // #fbb021 - Yellow (medium)

    // #f68838 - Orange

    // #ee3e32 - Red (highest liquidity)

    // const gradientStops = [
    //     { offset: 0, color: appTheme.DarkIndigo },
    //     { offset: 0.03, color: "#1b8a5a" },
    //     { offset: 0.05, color: "#fbb021" },
    //     { offset: 0.07, color: "#f68838" },
    //     { offset: 0.5, color: "#ee3e32" },
    // ];

    const gradientStops = [
        { offset: 0, color: appTheme.DarkIndigo },
        { offset: 0.03, color: appTheme.ForegroundColor },
        { offset: 0.4, color: appTheme.VividRed },
    ];

    // #005AD9 - Blue (low)

    // #FFE135 - Yellow (medium)

    // #E60026 - Red (high)

    // Create color map with dynamic range based on actual data spread
    const colorMap = new HeatmapColorMap({
        minimum: minValue,
        maximum: maxValue,
        gradientStops,
    });

    // Calculate the average step size from all timestamps to get more accurate spacing
    let totalStep = 0;
    let stepCount = 0;
    for (let i = 1; i < xCellOffsets.length; i++) {
        totalStep += xCellOffsets[i] - xCellOffsets[i - 1];
        stepCount++;
    }
    const averageXStep = stepCount > 0 ? totalStep / stepCount : xCellOffsets[1] - xCellOffsets[0];

    // Calculate Y-axis step size more carefully
    let totalYStep = 0;
    let yStepCount = 0;
    for (let i = 1; i < yCellOffsets.length; i++) {
        totalYStep += yCellOffsets[i] - yCellOffsets[i - 1];
        yStepCount++;
    }
    const averageYStep = yStepCount > 0 ? totalYStep / yStepCount : yCellOffsets[1] - yCellOffsets[0];

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: xCellOffsets[0],
        xStep: averageXStep,
        yStart: yCellOffsets[0],
        yStep: averageYStep,
        zValues,
        dataSeriesName: "Order Value",
    });

    // Set axis ranges to show both heatmap and candle data
    const candleXRange = [Math.min(...xValues), Math.max(...xValues)];
    const heatmapXRange = [Math.min(...xCellOffsets), Math.max(...xCellOffsets)];

    // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
    // HeatmapDataSeries which correspond to gradient stops at 0..1
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.4,
        dataSeries: heatmapDataSeries,
        colorMap,
        stroke: appTheme.PaleSkyBlue, // for legend text
    });
    heatmapSeries.useLinearTextureFiltering = false;

    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Set Y-axis range to include the full heatmap data range
    const heatmapYRange = [Math.min(...yCellOffsets), Math.max(...yCellOffsets)];
    priceAxis.visibleRange = new NumberRange(heatmapYRange[0], heatmapYRange[1]);

    // Set initial visible range to show overlapping data
    const overlapStart = Math.max(candleXRange[0], heatmapXRange[0]);
    const overlapEnd = Math.min(candleXRange[1], heatmapXRange[1]);

    if (overlapStart < overlapEnd) {
        // There is overlap, show the overlapping region
        xAxis.visibleRange = new NumberRange(overlapStart, overlapEnd);
    } else {
        // No overlap, show the most recent data (heatmap range)
        xAxis.visibleRange = new NumberRange(heatmapXRange[0], heatmapXRange[1]);
    }

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    const candleDataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        dataSeriesName: "LTC/USDT",
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
        opacity: 1,
    });

    sciChartSurface.renderableSeries.add(candlestickSeries);
    console.log("Added candlestick series with", candleDataSeries.count(), "data points");

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
            crosshairStroke: appTheme.PaleOrange + 55,
            axisLabelFill: appTheme.PaleOrange + 55,
            tooltipLegendTemplate: getTooltipLegendTemplate,
        })
    );

    // Note: Overview is handled by the React component using SciChartNestedOverview
    // No need to create it here as it would conflict with the React component

    return { sciChartSurface, candlestickSeries };
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
                   outputSvgString ? `<rect width="480px" height="50px" fill="#000000" opacity="0.4" rx="5" />` : ``
               }         
                ${outputSvgString}
                <g>
             </svg>`;
};
