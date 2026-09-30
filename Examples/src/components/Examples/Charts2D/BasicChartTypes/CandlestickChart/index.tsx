import * as React from "react";
import { FastCandlestickRenderableSeries, FastOhlcRenderableSeries } from "scichart";
import { appTheme } from "../../../theme";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample, overviewOptions } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function CandlestickChart() {
    const [preset, setPreset] = React.useState<number>(0);
    const [candlestickChartSeries, setCandlestickChartSeries] = React.useState<FastCandlestickRenderableSeries>();
    const [ohlcChartSeries, setOhlcChartSeries] = React.useState<FastOhlcRenderableSeries>();
    const [dataSource, setDataSource] = React.useState<string>("Random");

    const handleToggleButtonChanged = (event: any, state: number) => {
        if (state === null) return;
        setPreset(state);
        console.log(`Toggling Candle/Ohlc state: ${state}`);
        // Toggle visibility of candlestick or OHLC series
        candlestickChartSeries.isVisible = state === 0;
        ohlcChartSeries.isVisible = state === 1;
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
                    const { ohlcSeries, candlestickSeries } = initResult;
                    setCandlestickChartSeries(candlestickSeries);
                    setOhlcChartSeries(ohlcSeries);
                }}
                style={{ flex: "auto" }}
                innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
            >
                <SciChartNestedOverview
                    style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                    options={overviewOptions}
                />
            </SciChartReact>
        </div>
    );
}
