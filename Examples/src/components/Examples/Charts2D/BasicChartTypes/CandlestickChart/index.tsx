import * as React from "react";
import { FastCandlestickRenderableSeries, FastOhlcRenderableSeries } from "scichart";
import { FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
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
                    const { ohlcSeries, candlestickSeries } = initResult;
                    setCandlestickChartSeries(candlestickSeries);
                    setOhlcChartSeries(ohlcSeries);
                }}
                style={{ display: "flex", flexDirection: "column", width: "100%", flex: "auto" }}
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
