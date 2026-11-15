import { createCandlestickChart, sciChartOverview } from "./createCandlestickChart";
import { binanceSocketClient, TRealtimePriceBar } from "./binanceSocketClient";
import { Observable } from "rxjs";
import { simpleBinanceRestClient, TPriceBar } from "../../../ExampleData/binanceRestClient";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

// SCICHART EXAMPLE
export const drawExample = (dataSource: string) => async (rootElement: string | HTMLDivElement) => {
    // Create the candlestick chart example. Contains Candlestick series, tooltips, volume, zooming panning behaviour and more
    const { sciChartSurface, controls } = await createCandlestickChart(rootElement);

    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setMinutes(endDate.getMinutes() - 300);

    let priceBars: TPriceBar[];
    if (dataSource !== "Random") {
        priceBars = await simpleBinanceRestClient.getCandles("BTCUSDT", "1m", startDate, endDate, 500, dataSource);
        // Set the candles data on the chart
        controls.setData("BTC/USDT", "Bitcoin / US Dollar - 1 Minute", priceBars);
    } else {
        priceBars = ExampleDataProvider.getRandomCandles(300, 60000, startDate, 60);
        controls.setData("Random", "Random Data - 1 Minute", priceBars);
    }

    const startViewportRange = new Date();
    startViewportRange.setMinutes(endDate.getMinutes() - 100);
    endDate.setMinutes(endDate.getMinutes() + 10);
    controls.setXRange(startViewportRange, endDate);

    // Susbscribe to price updates from the exchange
    let obs: Observable<TRealtimePriceBar>;
    if (dataSource !== "Random") {
        obs = binanceSocketClient.getRealtimeCandleStream("BTCUSDT", "1m");
    } else {
        const lastBar = priceBars[priceBars.length - 1];
        const startBar: TRealtimePriceBar = {
            symbol: "Random",
            close: lastBar.close,
            high: lastBar.high,
            low: lastBar.low,
            volume: lastBar.volume,
            eventTime: new Date().getTime(),
            open: lastBar.open,
            openTime: lastBar.date * 1000,
            closeTime: (lastBar.date + 60) * 1000,
            interval: "1m",
            lastTradeSize: 0,
            lastTradeBuyOrSell: false,
        };
        obs = binanceSocketClient.getRandomCandleStream(startBar, 60000);
    }
    const subscription = obs.subscribe((pb) => {
        const priceBar = {
            date: pb.openTime,
            open: pb.open,
            high: pb.high,
            low: pb.low,
            close: pb.close,
            volume: pb.volume,
        };
        controls.onNewTrade(priceBar, pb.lastTradeSize, pb.lastTradeBuyOrSell);
    });

    return { sciChartSurface, subscription, controls };
};
