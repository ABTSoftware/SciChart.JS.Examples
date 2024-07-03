import * as React from "react";
import { IDeletable } from "scichart";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import classes from "../../../styles/Examples.module.scss";
import { createCandlestickChart, sciChartOverview } from "./createCandlestickChart";
import { binanceSocketClient } from "./binanceSocketClient";
import { Subscription } from "rxjs";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { simpleBinanceRestClient, TPriceBar } from "../../../ExampleData/binanceRestClient";
import { appTheme } from "../../../theme";

// SCICHART EXAMPLE
const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, sciChartOverview, controls } = await createCandlestickChart(rootElement);

    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setMinutes(endDate.getMinutes() - 300);

    const priceBars = await simpleBinanceRestClient.getCandles("BTCUSDT", "1m", startDate, endDate);

    controls.setData("BTC/USDT", "Bitcoin / US Dollar - 1 Minute", priceBars);

    const startViewportRange = new Date();
    startViewportRange.setMinutes(endDate.getMinutes() - 100);
    endDate.setMinutes(endDate.getMinutes() + 10);
    controls.setXRange(startViewportRange, endDate);

    const subscription = binanceSocketClient.getRealtimeCandleStream("BTCUSDT", "1m").subscribe((pb) => {
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

    return { sciChartSurface, sciChartOverview, subscription, controls };
};

export default function RealtimeTickingStockCharts() {
    const [preset, setPreset] = React.useState<number>(0);
    const chartControlsRef = React.useRef<{
        setData: (symbolName: string, watermarkText: string, priceBars: TPriceBar[]) => void;
        onNewTrade: (priceBar: TPriceBar, tradeSize: number, lastTradeBuyOrSell: boolean) => void;
        setXRange: (startDate: Date, endDate: Date) => void;
        enableCandlestick: () => void;
        enableOhlc: () => void;
    }>();

    const handleToggleButtonChanged = (event: any, state: number) => {
        if (state === null || chartControlsRef.current === undefined) return;
        setPreset(state);
        console.log(`Toggling Candle/Ohlc state: ${state}`);
        if (state === 0) chartControlsRef.current.enableCandlestick();
        if (state === 1) chartControlsRef.current.enableOhlc();
    };

    return (
        <React.Fragment>
            <div className={classes.FullHeightChartWrapper} style={{ background: appTheme.DarkIndigo }}>
                <ToggleButtonGroup
                    style={{ height: "70px", padding: "10" }}
                    exclusive
                    value={preset}
                    onChange={handleToggleButtonChanged}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                        Candlestick Series
                    </ToggleButton>
                    <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                        OHLC Series
                    </ToggleButton>
                </ToggleButtonGroup>
                <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 70px)", width: "100%" }}>
                    <SciChartReact
                        initChart={drawExample}
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            const { subscription, controls } = initResult;
                            chartControlsRef.current = controls;

                            return () => {
                                subscription.unsubscribe();
                            };
                        }}
                        style={{ flexBasis: "80%", flexGrow: 1, flexShrink: 1 }}
                    >
                        <SciChartNestedOverview
                            style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                            options={sciChartOverview}
                        />
                    </SciChartReact>
                </div>
            </div>
        </React.Fragment>
    );
}
