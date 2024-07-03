import * as React from "react";
import { SciChartSurface, FastCandlestickRenderableSeries, SciChartOverview, FastOhlcRenderableSeries } from "scichart";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample, overviewOptions } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function CandlestickChart() {
    const [preset, setPreset] = React.useState<number>(0);
    const [candlestickChartSeries, setCandlestickChartSeries] = React.useState<FastCandlestickRenderableSeries>();
    const [ohlcChartSeries, setOhlcChartSeries] = React.useState<FastOhlcRenderableSeries>();

    const handleToggleButtonChanged = (event: any, state: number) => {
        if (state === null) return;
        setPreset(state);
        console.log(`Toggling Candle/Ohlc state: ${state}`);
        // Toggle visibility of candlestick or OHLC series
        candlestickChartSeries.isVisible = state === 0;
        ohlcChartSeries.isVisible = state === 1;
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
                <SciChartReact
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { ohlcSeries, candlestickSeries } = initResult;
                        setCandlestickChartSeries(candlestickSeries);
                        setOhlcChartSeries(ohlcSeries);
                    }}
                    style={{ display: "flex", flexDirection: "column", height: "calc(100% - 70px)", width: "100%" }}
                    innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
                >
                    <SciChartNestedOverview
                        style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                        options={overviewOptions}
                    />
                </SciChartReact>
            </div>
        </React.Fragment>
    );
}
