export const code = `import * as React from "react";
import { IDeletable } from "scichart/Core/IDeletable";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { appTheme } from "../../../theme";
import classes from "../../../../Examples/Examples.module.scss";
import {createCandlestickChart} from "./createCandlestickChart";
import {simpleBinanceRestClient,TPriceBar} from "../../BasicChartTypes/CandlestickChart/data/binanceRestClient";
import {binanceSocketClient} from "./binanceSocketClient";
import {Subscription} from "rxjs";

const divElementId = "chart";
const divOverviewId = "overview";

// SCICHART EXAMPLE
const drawExample = async () => {

    // Create the candlestick chart example. Contains Candlestick series, tooltips, volume, zooming panning behaviour and more
    const { sciChartSurface, sciChartOverview, controls } = await createCandlestickChart(divElementId, divOverviewId);

    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setMinutes(endDate.getMinutes() - 300);

    // Fetch data Binance exchange: 300 1-minute candles
    const priceBars = await simpleBinanceRestClient.getCandles("BTCUSDT", "1m", startDate, endDate);

    // Set the candles data on the chart
    controls.setData("BTC/USDT", "Bitcoin / US Dollar - 1 Minute", priceBars);

    // Zoom to the latest 100 candles
    const startViewportRange = new Date();
    startViewportRange.setMinutes(endDate.getMinutes() - 100);
    endDate.setMinutes(endDate.getMinutes() + 10);
    controls.setXRange(startViewportRange, endDate);

    // Susbscribe to price updates from the exchange
    const subscription = binanceSocketClient.getRealtimeCandleStream("BTCUSDT", "1m").subscribe(pb => {
        const priceBar = { date: pb.openTime, open: pb.open, high: pb.high, low: pb.low, close: pb.close, volume: pb.volume };
        controls.onNewTrade(priceBar, pb.lastTradeSize, pb.lastTradeBuyOrSell);
    });

    return { sciChartSurface, sciChartOverview, subscription, controls };
}


// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function RealtimeTickingStockCharts() {
    const itemsToDelete: IDeletable[] = [];
    let websocketSubcription: Subscription;
    const [preset, setPreset] = React.useState<number>(0);
    const [chartControls, setControls] = React.useState( {
        setData: (symbolName: string, watermarkText: string, priceBars: TPriceBar[]) => {},
        onNewTrade: (priceBar: TPriceBar, tradeSize: number, lastTradeBuyOrSell: boolean) => {},
        setXRange: (startDate: Date, endDate: Date) => {},
        enableCandlestick: () => {},
        enableOhlc: () => {},
    });

    React.useEffect(() => {
        (async () => {
            const { sciChartSurface, sciChartOverview, subscription, controls } = await drawExample();
            setControls(controls);
            websocketSubcription = subscription;
            itemsToDelete.push(sciChartSurface, sciChartOverview);
        })();
        return () => {
            itemsToDelete.forEach(item => item.delete());
            websocketSubcription?.unsubscribe();
        };
    }, []);

    const handleToggleButtonChanged = (event: any, state: number) => {
        if (state === null || chartControls === undefined) return;
        setPreset(state);
        console.log(\`Toggling Candle/Ohlc state: \${state}\`);
        if (state === 0)
            chartControls.enableCandlestick();
        if (state === 1)
            chartControls.enableOhlc();
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
                    <div id={divElementId} style={{ flexBasis: "80%", flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId} style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }} />
                </div>
            </div>
        </React.Fragment>
    );
}
`;