const getCandles = async (
    symbol,
    interval,
    limit = 300
) => {
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

async function simpleOhlcChart(divElementId) {
  // #region ExampleA
  // Demonstrates how to create an OHLC (or Bar) chart with SciChart.js
  const {
    SciChartSurface,
    CategoryAxis,
    NumericAxis,
    FastOhlcRenderableSeries,
    OhlcDataSeries,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new CategoryAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrefix: "$", labelPrecision: 2 }));

  // Data format is { dateValues[], openValues[], highValues[], lowValues[], closeValues[] }
  const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues }
      = await getCandles("BTCUSDT", "1h", 100);

  // Create a OhlcDataSeries with open, high, low, close values
  const dataSeries = new OhlcDataSeries(wasmContext, {
    xValues: dateValues,
    openValues,
    highValues,
    lowValues,
    closeValues,
  });

  // Create and add the OhlcSeries series
  const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
    dataSeries,
    strokeThickness: 1,
    dataPointWidth: 1,
    strokeUp: "#77ff77",
    strokeDown: "#ff7777",
  });
  sciChartSurface.renderableSeries.add(ohlcSeries);
  // #endregion

  // add interactivity for the example
  const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
};

simpleOhlcChart("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create an OHLC chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EAxisType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // Data format is { dateValues[], openValues[], highValues[], lowValues[], closeValues[] }
  const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues }
      = await getCandles("BTCUSDT", "1h", 100);

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: [{ type: EAxisType.CategoryAxis }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { labelPrefix: "$", labelPrecision: 2 } }],
    series: [
      {
        type: ESeriesType.OhlcSeries,
        ohlcData: {
          xValues: dateValues,
          openValues,
          highValues,
          lowValues,
          closeValues
        },
        options: {
          dataPointWidth: 1,
          strokeUp: "#77ff77",
          strokeDown: "#ff7777",
          strokeThickness: 1,
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
