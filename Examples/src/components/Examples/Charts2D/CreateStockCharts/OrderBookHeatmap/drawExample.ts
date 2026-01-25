import {
    SciChartSurface,
    NumericAxis,
    ENumericFormat,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    NumberRange,
    OhlcDataSeries,
    FastCandlestickRenderableSeries,
    SciChartJsNavyTheme,
    DateTimeNumericAxis,
    CursorModifier,
    CursorTooltipSvgAnnotation,
    EDataSeriesType,
    ESeriesType,
    FastMountainRenderableSeries,
    GradientParams,
    IRenderableSeries,
    OhlcSeriesInfo,
    Point,
    SeriesInfo,
    HeatmapColorMap,
    UniformHeatmapRenderableSeries,
    UniformHeatmapDataSeries,
    EXyDirection,
} from "scichart";

import { appTheme } from "../../../theme";

// Data file paths (files are copied via webpack.config.js)
const ohlcFilePath = "LTCUSDT_OHLC.csv";
const orderbookLevels = "orderbook_levels.csv";

const baseUrl =
    typeof window !== "undefined" &&
    !window.location.hostname.includes("scichart.com") &&
    !window.location.hostname.includes("localhost")
        ? "https://www.scichart.com/demo"
        : "";

/** OHLCV candlestick data structure */
type TCandleData = {
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    volumeValues: number[];
};

/**
 * Loads OHLCV candlestick data from CSV file
 * @returns Promise resolving to parsed candle data arrays
 */
async function loadCandleData(): Promise<TCandleData> {
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];
    const volumeValues: number[] = [];

    try {
        const filepath = baseUrl + ohlcFilePath;
        const response = await fetch(filepath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const lines = csvText.split("\n");

        // Parse each data row (skip header at index 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

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

                // Only add valid numeric data
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

/** Parsed order book heatmap data structure */
type TParsedHeatmapData = {
    /** 2D array of order values (Z-axis intensity) */
    zValues: number[][];
    /** Unix timestamps for X-axis cell positions */
    xCellOffsets: number[];
    /** Price levels for Y-axis cell positions */
    yCellOffsets: number[];
    /** Minimum non-zero value in the heatmap */
    minValue: number;
    /** Maximum value in the heatmap */
    maxValue: number;
};

/**
 * Loads order book depth heatmap data from CSV file
 * CSV format: First row contains timestamps, subsequent rows contain price level and order values
 * @returns Promise resolving to parsed heatmap data with Z-values and axis offsets
 */
async function loadHeatmapData(): Promise<TParsedHeatmapData> {
    const zValues: number[][] = [];
    let xCellOffsets: number[] = [];
    const yCellOffsets: number[] = [];
    let minValue = Infinity;
    let maxValue = -Infinity;

    try {
        const dataFile = baseUrl + orderbookLevels;
        const response = await fetch(dataFile);
        const csvText = await response.text();
        const lines = csvText.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const rowData = line.split(",");

            if (i === 0) {
                // Header row contains Unix timestamps for each column
                const [_, ...cellOffsets] = rowData;
                xCellOffsets = cellOffsets.map((timestampString: string) => {
                    const timestamp = Number.parseInt(timestampString);
                    return timestamp || 0;
                });
            } else {
                // Data rows: first column is price level, remaining columns are order values
                const [price, ...zValuesRow] = rowData;

                if (!Number.isNaN(Number.parseInt(price))) {
                    const rowValues = zValuesRow.map((val: string) => {
                        const numVal = Number.parseFloat(val) || 0;
                        // Track min/max for color map scaling (exclude zeros)
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

        // Default range if no valid values found
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

/**
 * Creates an Order Book Heatmap chart with candlestick overlay
 * Demonstrates combining UniformHeatmapRenderableSeries with FastCandlestickRenderableSeries
 * to visualize order book depth alongside price action
 *
 * @param rootElement - HTML element ID or element to render the chart into
 * @returns Promise resolving to the chart surface and candlestick series
 */
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme(),
    });

    // X-Axis: DateTimeNumericAxis for continuous time data
    // Note: For stocks/forex with market hours, use DiscontinuousDateAxis to collapse weekend gaps
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        cursorLabelFormat: ENumericFormat.Date_HHMMSS,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Y-Axis: Price axis with currency formatting
    const priceAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        labelPrefix: "$",
    });
    sciChartSurface.yAxes.add(priceAxis);

    // Load data from CSV files
    const { xValues, openValues, highValues, lowValues, closeValues, volumeValues } = await loadCandleData();
    const { zValues, xCellOffsets, yCellOffsets, minValue, maxValue } = await loadHeatmapData();

    // Heatmap color gradient: dark background -> white (low values) -> red (high values)
    const gradientStops = [
        { offset: 0, color: appTheme.DarkIndigo },
        { offset: 0.03, color: appTheme.ForegroundColor },
        { offset: 0.4, color: appTheme.VividRed },
    ];

    // Color map scales Z-values to gradient colors
    const colorMap = new HeatmapColorMap({
        minimum: minValue,
        maximum: maxValue,
        gradientStops,
    });

    // Calculate average X-axis step size for uniform heatmap spacing
    let totalStep = 0;
    let stepCount = 0;
    for (let i = 1; i < xCellOffsets.length; i++) {
        totalStep += xCellOffsets[i] - xCellOffsets[i - 1];
        stepCount++;
    }
    const averageXStep = stepCount > 0 ? totalStep / stepCount : xCellOffsets[1] - xCellOffsets[0];

    // Calculate average Y-axis step size for uniform heatmap spacing
    let totalYStep = 0;
    let yStepCount = 0;
    for (let i = 1; i < yCellOffsets.length; i++) {
        totalYStep += yCellOffsets[i] - yCellOffsets[i - 1];
        yStepCount++;
    }
    const averageYStep = yStepCount > 0 ? totalYStep / yStepCount : yCellOffsets[1] - yCellOffsets[0];

    // Create heatmap data series with uniform cell spacing
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: xCellOffsets[0],
        xStep: averageXStep,
        yStart: yCellOffsets[0],
        yStep: averageYStep,
        zValues,
        dataSeriesName: "Order Value",
    });

    // Calculate data ranges for axis configuration
    const candleXRange = [Math.min(...xValues), Math.max(...xValues)];
    const heatmapXRange = [Math.min(...xCellOffsets), Math.max(...xCellOffsets)];

    // Create heatmap series with semi-transparency to show candlesticks through it
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.4,
        dataSeries: heatmapDataSeries,
        colorMap,
        stroke: appTheme.PaleSkyBlue,
    });
    // Disable texture filtering for crisp cell boundaries
    heatmapSeries.useLinearTextureFiltering = false;

    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Set Y-axis to show full price range from heatmap data
    const heatmapYRange = [Math.min(...yCellOffsets), Math.max(...yCellOffsets)];
    priceAxis.visibleRange = new NumberRange(heatmapYRange[0], heatmapYRange[1]);

    // Set X-axis to show overlapping time range between candle and heatmap data
    const overlapStart = Math.max(candleXRange[0], heatmapXRange[0]);
    const overlapEnd = Math.min(candleXRange[1], heatmapXRange[1]);

    if (overlapStart < overlapEnd) {
        xAxis.visibleRange = new NumberRange(overlapStart, overlapEnd);
    } else {
        // No overlap - default to heatmap range
        xAxis.visibleRange = new NumberRange(heatmapXRange[0], heatmapXRange[1]);
    }

    // Create candlestick series with OHLC data
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
        stroke: appTheme.ForegroundColor,
        strokeThickness: 2,
        brushUp: appTheme.VividGreen + "AA",
        brushDown: appTheme.MutedRed + "AA",
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed,
        dataPointWidth: 0.8,
        isVisible: true,
        opacity: 1,
    });

    sciChartSurface.renderableSeries.add(candlestickSeries);
    console.log("Added candlestick series with", candleDataSeries.count(), "data points");

    // Add chart interaction modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({
            enableZoom: true,
            horizontalGrowFactor: 0.005,
            verticalGrowFactor: 0,
            xyDirection: EXyDirection.XDirection,
        }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new CursorModifier({
            crosshairStroke: appTheme.PaleOrange + 55,
            axisLabelFill: appTheme.PaleOrange + 55,
            tooltipLegendTemplate: getTooltipLegendTemplate,
        })
    );

    return { sciChartSurface, candlestickSeries };
};

/**
 * Transforms series for the SciChart overview/navigator component
 * Converts candlestick series to mountain series for cleaner overview display
 * @param defaultSeries - The original renderable series
 * @returns Transformed series for overview, or undefined to hide
 */
const getOverviewSeries = (defaultSeries: IRenderableSeries) => {
    if (defaultSeries.type === ESeriesType.CandlestickSeries) {
        // Display candlestick data as a mountain series in the overview for cleaner visualization
        return new FastMountainRenderableSeries(defaultSeries.parentSurface.webAssemblyContext2D, {
            dataSeries: defaultSeries.dataSeries,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.VividSkyBlue + "77", offset: 0 },
                { color: "Transparent", offset: 1 },
            ]),
            stroke: appTheme.VividSkyBlue,
        });
    }
    // Hide other series (e.g., heatmap) from overview
    return undefined;
};

/** Configuration for SciChart overview/navigator component */
export const sciChartOverview = {
    theme: appTheme.SciChartJsTheme,
    transformRenderableSeries: getOverviewSeries,
};

/**
 * Custom tooltip template for CursorModifier
 * Displays OHLC values for candlestick series and order values for heatmap
 * @param seriesInfos - Array of series info objects for series under cursor
 * @param svgAnnotation - The tooltip annotation instance
 * @returns SVG string for tooltip content
 */
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
    let outputSvgString = "";

    seriesInfos.forEach((seriesInfo, index) => {
        const y = 20 + index * 20;
        const textColor = seriesInfo.stroke;
        let legendText = seriesInfo.formattedYValue;

        // Format OHLC data for candlestick series
        if (seriesInfo.dataSeriesType === EDataSeriesType.Ohlc) {
            const o = seriesInfo as OhlcSeriesInfo;
            legendText = `Open=${o.formattedOpenValue} High=${o.formattedHighValue} Low=${o.formattedLowValue} Close=${o.formattedCloseValue}`;
        }
        // Format heatmap data showing price level and order count
        else if (seriesInfo.seriesName === "Order Value") {
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
