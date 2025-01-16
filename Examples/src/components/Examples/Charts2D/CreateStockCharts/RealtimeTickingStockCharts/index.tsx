import * as React from "react";
import { FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from "@mui/material";
import commonClasses from "../../../styles/Examples.module.scss";
import { createCandlestickChart, sciChartOverview } from "./createCandlestickChart";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { binanceSocketClient, TRealtimePriceBar } from "./binanceSocketClient";
import { Observable, Subscription } from "rxjs";
import { simpleBinanceRestClient, TPriceBar } from "../../../ExampleData/binanceRestClient";
import { appTheme } from "../../../theme";
import FormLabel from "@mui/material/FormLabel";
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

    const handleDataSourceChanged = (event: any) => {
        setDataSource(event.target.value);
    };

    const initFunc = drawExample(dataSource);

    return (
        <div className={commonClasses.ChartWrapper} style={{ display: "flex", flexDirection: "column" }}>
            <div className={commonClasses.ToolbarRow} style={{ flex: "none" }}>
                <ToggleButtonGroup
                    className={commonClasses.ToggleButtonGroup}
                    exclusive
                    value={preset}
                    onChange={handleToggleButtonChanged}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={0}>Candlestick Series</ToggleButton>
                    <ToggleButton value={1}>OHLC Series</ToggleButton>
                </ToggleButtonGroup>
                <FormControl sx={{ marginTop: "1em" }}>
                    <InputLabel id="data-source-label" sx={{ color: appTheme.VividGreen }}>
                        Data Source
                    </InputLabel>
                    <Select
                        variant="outlined"
                        labelId="data-source-label"
                        id="data-source-select"
                        label="Data Source"
                        sx={{ color: "inherit", "& .MuiSvgIcon-root": { color: "inherit" } }}
                        size="small"
                        inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                        value={dataSource}
                        onChange={handleDataSourceChanged}
                    >
                        <MenuItem value={"Random"}>Random</MenuItem>
                        <MenuItem value={"com"}>Binance.com</MenuItem>
                        <MenuItem value={"us"}>Binance.us</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <SciChartReact
                key={dataSource}
                initChart={initFunc}
                onInit={(initResult: TResolvedReturnType<typeof initFunc>) => {
                    const { subscription, controls } = initResult;
                    chartControlsRef.current = controls;

                    return () => {
                        subscription.unsubscribe();
                    };
                }}
                style={{ display: "flex", flexDirection: "column", width: "100%", flex: "auto" }}
                innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
            >
                <SciChartNestedOverview
                    style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                    options={sciChartOverview}
                />
            </SciChartReact>
        </div>
    );
}
