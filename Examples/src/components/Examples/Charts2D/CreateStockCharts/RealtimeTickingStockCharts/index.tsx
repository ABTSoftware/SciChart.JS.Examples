import { useState, useRef, ChangeEvent } from "react";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { TPriceBar } from "../../../ExampleData/binanceRestClient";
import { sciChartOverview } from "./createCandlestickChart";
export * from "./drawExample";

export default function RealtimeTickingStockCharts() {
    const [preset, setPreset] = useState<number>(0);
    const chartControlsRef = useRef<{
        setData: (symbolName: string, watermarkText: string, priceBars: TPriceBar[]) => void;
        onNewTrade: (priceBar: TPriceBar, tradeSize: number, lastTradeBuyOrSell: boolean) => void;
        setXRange: (startDate: Date, endDate: Date) => void;
        enableCandlestick: () => void;
        enableOhlc: () => void;
    }>(undefined);
    const [dataSource, setDataSource] = useState<string>("Random");

    const handleToggleButtonChanged = (state: number) => {
        if (chartControlsRef.current === undefined) return;
        setPreset(state);
        console.log(`Toggling Candle/Ohlc state: ${state}`);
        if (state === 0) chartControlsRef.current.enableCandlestick();
        if (state === 1) chartControlsRef.current.enableOhlc();
    };

    const handleDataSourceChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        setDataSource(event.target.value);
    };

    const initFunc = drawExample(dataSource);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Playback">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 0}
                        onClick={() => handleToggleButtonChanged(0)}
                    >
                        Candlestick Series
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={() => handleToggleButtonChanged(1)}
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
                className="sc-overview-chart"
                initChart={initFunc}
                onInit={(initResult: TResolvedReturnType<typeof initFunc>) => {
                    const { subscription, controls } = initResult;
                    chartControlsRef.current = controls;

                    return () => subscription.unsubscribe();
                }}
            >
                <SciChartNestedOverview className="sc-overview" options={sciChartOverview} />
            </SciChartReact>
        </div>
    );
}
