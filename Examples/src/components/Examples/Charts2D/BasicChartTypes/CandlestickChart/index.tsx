import { useState, ChangeEvent } from "react";
import { FastCandlestickRenderableSeries, FastOhlcRenderableSeries } from "scichart";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample, overviewOptions } from "./drawExample";

export default function CandlestickChart() {
    const [preset, setPreset] = useState<number>(0);
    const [candlestickChartSeries, setCandlestickChartSeries] = useState<FastCandlestickRenderableSeries>();
    const [ohlcChartSeries, setOhlcChartSeries] = useState<FastOhlcRenderableSeries>();
    const [dataSource, setDataSource] = useState<string>("Random");

    const handleToggleButtonChanged = (state: number) => {
        setPreset(state);
        console.log(`Toggling Candle/Ohlc state: ${state}`);
        // Toggle visibility of candlestick or OHLC series
        candlestickChartSeries.isVisible = state === 0;
        ohlcChartSeries.isVisible = state === 1;
    };

    const handleDataSourceChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        setDataSource(event.target.value);
    };

    const initFunc = drawExample(dataSource);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Series type">
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
                    const { ohlcSeries, candlestickSeries } = initResult;
                    setCandlestickChartSeries(candlestickSeries);
                    setOhlcChartSeries(ohlcSeries);
                }}
            >
                <SciChartNestedOverview className="sc-overview" options={overviewOptions} />
            </SciChartReact>
        </div>
    );
}
