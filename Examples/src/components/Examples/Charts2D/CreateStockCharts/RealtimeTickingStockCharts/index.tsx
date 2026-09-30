import * as React from "react";
import { createCandlestickChart, sciChartOverview } from "./createCandlestickChart";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { binanceSocketClient, TRealtimePriceBar } from "./binanceSocketClient";
import { Observable, Subscription } from "rxjs";
import { simpleBinanceRestClient, TPriceBar } from "../../../ExampleData/binanceRestClient";
import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

// SCICHART EXAMPLE
// const drawExample = async (rootElement: string | HTMLDivElement) => {
//     const { sciChartSurface, sciChartOverview, controls } = await createCandlestickChart(rootElement);
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

export default function RealtimeTickingStockCharts() {
    const [preset, setPreset] = React.useState<number>(0);
    const chartControlsRef = React.useRef<{
        setData: (symbolName: string, watermarkText: string, priceBars: TPriceBar[]) => void;
        onNewTrade: (priceBar: TPriceBar, tradeSize: number, lastTradeBuyOrSell: boolean) => void;
        setXRange: (startDate: Date, endDate: Date) => void;
        enableCandlestick: () => void;
        enableOhlc: () => void;
    }>(undefined);
    const [dataSource, setDataSource] = React.useState<string>("Random");

    const handleToggleButtonChanged = (event: any, state: number) => {
        if (state === null || chartControlsRef.current === undefined) return;
        setPreset(state);
        console.log(`Toggling Candle/Ohlc state: ${state}`);
        if (state === 0) chartControlsRef.current.enableCandlestick();
        if (state === 1) chartControlsRef.current.enableOhlc();
    };

    const handleDataSourceChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDataSource(event.target.value);
    };

    const initFunc = drawExample(dataSource);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="small outlined button group">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 0}
                        onClick={(event) => handleToggleButtonChanged(event, 0)}
                    >
                        Candlestick Series
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={(event) => handleToggleButtonChanged(event, 1)}
                    >
                        OHLC Series
                    </button>
                </div>
                <label className="sc-control" htmlFor="data-source-select">
                    Data Source
                    <select
                        className="sc-select"
                        id="data-source-select"
                        value={dataSource}
                        onChange={handleDataSourceChanged}
                    >
                        <option value="Random">Random</option>
                        <option value="com">Binance.com</option>
                        <option value="us">Binance.us</option>
                    </select>
                </label>
            </header>
            <SciChartReact
                key={dataSource}
                className="flex flex-col"
                initChart={initFunc}
                onInit={(initResult: TResolvedReturnType<typeof initFunc>) => {
                    const { subscription, controls } = initResult;
                    chartControlsRef.current = controls;

                    return () => {
                        subscription.unsubscribe();
                    };
                }}
                innerContainerProps={{ 
                    style: { flexBasis: "80%" } 
                }}
            >
                <SciChartNestedOverview
                    style={{ flexBasis: "20%", width: "100%" }}
                    options={sciChartOverview}
                />
            </SciChartReact>
        </div>
    );
}
