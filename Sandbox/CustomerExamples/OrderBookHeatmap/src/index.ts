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
} from "scichart";

import { appTheme } from "scichart-example-dependencies";

import Papa = require("papaparse");

type TCandleData = {
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    volumeValues: number[];
};

async function loadCandleData(): Promise<TCandleData> {
    return new Promise<TCandleData>((resolve, reject) => {
        setTimeout(() => {
            const xValues: number[] = [];
            const openValues: number[] = [];
            const highValues: number[] = [];
            const lowValues: number[] = [];
            const closeValues: number[] = [];
            const volumeValues: number[] = [];
            let rowCount = 0;

            // File copied in webpack.config.js
            const filepath = "./COINBASE_BTCUSD.csv";
            Papa.parse(filepath, {
                download: true,
                step: function (row: any) {
                    // Skip header row
                    // Row format: Array (9)
                    // 0 "1514764740" // Unix timestamp
                    // 1 "13913.28" // Open
                    // 2 "13913.28" // High
                    // 3 "13867.18" // Low
                    // 4 "13880.00" // Close
                    // 5 "0.59174759" // Volume
                    // 6 "8213.4565492" // Volume MA
                    // 7 "2017-12-31 23:59:00" // Formatted date
                    if (++rowCount > 1) {
                        const rowData = row.data as Array<string>;
                        const priceBar = {
                            date: Number.parseInt(rowData[0]),
                            open: Number.parseFloat(rowData[1]),
                            high: Number.parseFloat(rowData[2]),
                            low: Number.parseFloat(rowData[3]),
                            close: Number.parseFloat(rowData[4]),
                            volume: Number.parseFloat(rowData[6]),
                        };
                        if (!Number.isNaN(priceBar.date)) {
                            xValues.push(priceBar.date);
                            openValues.push(priceBar.open);
                            highValues.push(priceBar.high);
                            lowValues.push(priceBar.low);
                            closeValues.push(priceBar.close);
                            volumeValues.push(priceBar.volume);
                        }
                    }
                },
                complete: function () {
                    resolve({
                        xValues,
                        openValues,
                        highValues,
                        lowValues,
                        closeValues,
                        volumeValues,
                    });
                },
            });
        }, 0);
    });
}

type TParsedHeatmapData = {
    zValues: number[][];
    xCellOffsets: number[];
    yCellOffsets: number[];
};

async function loadHeatmapData(): Promise<TParsedHeatmapData> {
    return new Promise<TParsedHeatmapData>((resolve, reject) => {
        setTimeout(() => {
            const zValues: number[][] = [];
            let xCellOffsets: number[] = [];
            const yCellOffsets: number[] = [];
            let rowCount = 0;

            // File copied in webpack.config.js
            const dataFile = "./orderbook_levels.csv";
            Papa.parse(dataFile, {
                download: true,
                step: function (row: any) {
                    if (rowCount === 0) {
                        const [_, ...cellOffsets] = row.data as Array<string>;
                        xCellOffsets = cellOffsets.map((dateString: string) => {
                            // https://stackoverflow.com/questions/50781887/javascript-date-parse-with-specific-locale

                            const dateParser =
                                /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
                            const splitDate = dateString.match(dateParser);
                            const date = new Date(
                                Number.parseInt(splitDate[3]), // year
                                Number.parseInt(splitDate[2]) - 1, // monthIndex
                                Number.parseInt(splitDate[1]), // day
                                Number.parseInt(splitDate[4]), // hours
                                Number.parseInt(splitDate[5]) // minutes
                                // Number.parseInt(splitDate[6]) //seconds
                            );

                            return date.getTime() / 1000;
                        });
                    } else {
                        const rowData = row.data as Array<string>;
                        const [price, ...zValuesRow] = rowData;

                        if (!Number.isNaN(Number.parseInt(price))) {
                            zValues.push(
                                zValuesRow.map((val: string) =>
                                    Number.parseInt(val)
                                )
                            );
                            yCellOffsets.push(Number.parseInt(price));
                        }
                    }
                    ++rowCount;
                },
                complete: function () {
                    resolve({ zValues, xCellOffsets, yCellOffsets });
                },
            });
        }, 0);
    });
}

// SCICHART EXAMPLE
const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
        "chart",
        { theme: new SciChartJsNavyTheme() }
    );

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

    const {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        volumeValues,
    } = await loadCandleData();

    const gradientStops = [
        { offset: 0, color: "blue" },
        { offset: 0.3, color: "white" },
        { offset: 0.5, color: "green" },
        { offset: 0.7, color: "yellow" },
        { offset: 1, color: "red" },
    ];
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 100,
        gradientStops,
    });

    const { zValues, xCellOffsets, yCellOffsets } = await loadHeatmapData();

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: xCellOffsets[0],
        xStep: xCellOffsets[1] - xCellOffsets[0],
        yStart: yCellOffsets[0],
        yStep: yCellOffsets[1] - yCellOffsets[0],
        zValues,
    });

    xAxis.visibleRangeLimit = heatmapDataSeries.getXRange();
    priceAxis.visibleRangeLimit = heatmapDataSeries.getYRange();

    // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
    // HeatmapDataSeries which correspond to gradient stops at 0..1
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.2,
        dataSeries: heatmapDataSeries,
        colorMap,
    });
    heatmapSeries.useLinearTextureFiltering = false;

    sciChartSurface.renderableSeries.add(heatmapSeries);
    xAxis.visibleRange = heatmapSeries.getXRange();

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
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
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
    const overview = await SciChartOverview.create(
        sciChartSurface,
        "overview",
        {
            theme: appTheme.SciChartJsTheme,
            transformRenderableSeries: getOverviewSeries,
        }
    );

    return { sciChartSurface, overview, candlestickSeries, ohlcSeries };
};

// Override the Renderableseries to display on the scichart overview
const getOverviewSeries = (defaultSeries: IRenderableSeries) => {
    if (defaultSeries.type === ESeriesType.CandlestickSeries) {
        // Swap the default candlestick series on the overview chart for a mountain series. Same data
        return new FastMountainRenderableSeries(
            defaultSeries.parentSurface.webAssemblyContext2D,
            {
                dataSeries: defaultSeries.dataSeries,
                fillLinearGradient: new GradientParams(
                    new Point(0, 0),
                    new Point(0, 1),
                    [
                        { color: appTheme.VividSkyBlue + "77", offset: 0 },
                        { color: "Transparent", offset: 1 },
                    ]
                ),
                stroke: appTheme.VividSkyBlue,
            }
        );
    }
    // hide all other series
    return undefined;
};

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (
    seriesInfos: SeriesInfo[],
    svgAnnotation: CursorTooltipSvgAnnotation
) => {
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

class VolumePaletteProvider extends DefaultPaletteProvider {
    fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private ohlcDataSeries: OhlcDataSeries;
    private upColorArgb: number;
    private downColorArgb: number;

    constructor(
        masterData: OhlcDataSeries,
        upColor: string,
        downColor: string
    ) {
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

drawExample();
