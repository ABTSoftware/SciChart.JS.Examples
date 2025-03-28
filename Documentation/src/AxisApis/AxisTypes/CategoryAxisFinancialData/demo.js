import * as SciChart from "scichart";

// Helper function to fetch candlestick data from Binance via Rest API
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

async function chartWithCategoryAxis(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a chart with a CategoryAxis in SciChart.js
    const {
        SciChartSurface,
        CategoryAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        NumericAxis,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ENumericFormat,
        FastCandlestickRenderableSeries,
        OhlcDataSeries,
        SmartDateLabelProvider,
        NumberRange,
        EAutoRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Creating a CategoryAxis as an XAxis on the bottom
    sciChartSurface.xAxes.add(
        new CategoryAxis(wasmContext, {
            // set other properties
            drawMajorGridLines: true,
            drawMinorGridLines: true,
            axisTitle: "Category X Axis",
            axisAlignment: EAxisAlignment.Bottom,
            // set a date format for labels
            labelProvider: new SmartDateLabelProvider()
        })
    );

    // Create a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Numeric Y Axis",
            labelPrefix: "$",
            labelPrecision: 2,
            labelFormat: ENumericFormat.Decimal,
            axisAlignment: EAxisAlignment.Right,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // The category axis requires some data to work (unless you set defaultStartX/StepX properties)
    // so, lets add some data with dates to the chart
    // Data format is { dateValues[], openValues[], highValues[], lowValues[], closeValues[] }
    const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = await getCandles(
        "BTCUSDT",
        "1h",
        100
    );

    // Create and add the Candlestick series
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 1,
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: dateValues,
            openValues,
            highValues,
            lowValues,
            closeValues
        }),
        dataPointWidth: 0.7,
        brushUp: "#33ff3377",
        brushDown: "#ff333377",
        strokeUp: "#77ff77",
        strokeDown: "#ff7777"
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // #endregion

    // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "CategoryAxis Demo",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.33,
            fontSize: 36,
            fontWeight: "Bold"
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Try mouse-wheel, left/right mouse drag and notice the dynamic X-Axis Labels",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 50,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.45,
            fontSize: 17
        })
    );

    // For the example, add a cursor
    sciChartSurface.chartModifiers.add(new SciChart.CursorModifier());
}

chartWithCategoryAxis("scichart-root");

if (location.search.includes("builder=1")) builderExample("scichart-root");
