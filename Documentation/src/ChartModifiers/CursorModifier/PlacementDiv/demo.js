import * as SciChart from "scichart";

// Helper class to fetch candlestick data from Binance via Rest API
const getCandles = async (symbol, interval, limit = 300) => {
    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`;
    if (limit) {
        url += `&limit=${limit}`;
    }
    try {
        console.log(`SimpleBinanceClient: Fetching ${limit} candles of ${symbol} ${interval}`);
        const response = await fetch(url);
        // Returned data format is [ { date, open, high, low, close, volume }, ... ]
        const data = await response.json();
        // Map to { dateValues[], openValues[], highValues[], lowValues[], closeValues[] } expected by scichart.js
        const dateValues = [];
        const openValues = [];
        const highValues = [];
        const lowValues = [];
        const closeValues = [];
        const volumeValues = [];
        data.forEach(candle => {
            const [timestamp, open, high, low, close, volume] = candle;
            dateValues.push(timestamp / 1000); // SciChart expects Unix Timestamp / 1000
            openValues.push(parseFloat(open));
            highValues.push(parseFloat(high));
            lowValues.push(parseFloat(low));
            closeValues.push(parseFloat(close));
            volumeValues.push(parseFloat(volume));
        });
        return { dateValues, openValues, highValues, lowValues, closeValues, volumeValues };
    } catch (err) {
        console.error(err);
        return [];
    }
};

async function cursorModifierActiveLegendsOnCandles(divElementId) {
    //
    const {
        SciChartSurface,
        CategoryAxis,
        NumericAxis,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EDataSeriesType,
        FastColumnRenderableSeries,
        CursorModifier,
        NumberRange,
        XyDataSeries,
        parseColorToTArgb,
        FastLineRenderableSeries,
        XyMovingAverageFilter
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrefix: "$", labelPrecision: 2 }));

    // Add a secondary axis for the volume bars
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "VolumeAxisId", isVisible: false, growBy: new NumberRange(0, 4) })
    );

    // Data format is { dateValues[], openValues[], highValues[], lowValues[], closeValues[] }
    const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = await getCandles(
        "BTCUSDT",
        "1h",
        100
    );

    //Add the Candlestick series
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: dateValues,
            openValues,
            highValues,
            lowValues,
            closeValues,
            dataSeriesName: "BTC/USDT"
        }),
        strokeThickness: 1,
        dataPointWidth: 0.7,
        brushUp: "#33ff3377",
        brushDown: "#ff333377",
        strokeUp: "#77ff77",
        strokeDown: "#ff7777"
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Add some moving averages using SciChart's filters/transforms API
    // when candleDataSeries updates, XyMovingAverageFilter automatically recomputes
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candlestickSeries.dataSeries, {
                dataSeriesName: "Moving Average (20)",
                length: 20
            })
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candlestickSeries.dataSeries, {
                dataSeriesName: "Moving Average (50)",
                length: 50
            })
        })
    );

    // Add a column series to render the volume bars
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: dateValues,
                yValues: volumeValues,
                dataSeriesName: "Volume"
            }),
            yAxisId: "VolumeAxisId",
            strokeThickness: 0,
            dataPointWidth: 0.7,
            opacity: 0.47
        })
    );

    // add interactivity for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ excludedYAxisIds: ["VolumeAxisId"] }));
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ excludedYAxisIds: ["VolumeAxisId"] }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    // #region ExampleA
    // Add a CursorModifier with external placement div on the chart
    // Expects <div id="legend-root" /> to be present in the DOM
    const cursorModifier = new CursorModifier({
        placementDivId: "legend-root",
        showTooltip: true,
        tooltipContainerBackground: "#4682b433"
    });
    sciChartSurface.chartModifiers.add(cursorModifier);
    // #endregion
}

cursorModifierActiveLegendsOnCandles("scichart-root");
