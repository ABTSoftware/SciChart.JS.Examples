import * as React from "react";
import {
    SciChartSurface,
    FastCandlestickRenderableSeries,
    SciChartOverview,
    FastOhlcRenderableSeries,
    chartReviver,
} from "scichart";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { drawExample, IChartControls } from "./drawExample";
import { Button, ButtonGroup, FormControl, FormHelperText, MenuItem, Select, TextField } from "@material-ui/core";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ShareableChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const controlsRef = React.useRef<IChartControls>();
    const [name, setName] = React.useState<string>("");
    const [chartMode, setChartMode] = React.useState<string>("pan");
    const [savedCharts, setSavedCharts] = React.useState<Record<string, object>>(() =>
        JSON.parse(localStorage.getItem("shared-charts") ?? "{}", chartReviver)
    );
    const [selectedChart, setSelectedChart] = React.useState<string>("");

    const handleToggleButtonChanged = (event: any, state: string) => {
        if (state === null) return;
        setChartMode(state);
        if (state === "pan") {
            sciChartSurfaceRef.current.chartModifiers.getById("marker").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("line").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("pan").isEnabled = true;
            sciChartSurfaceRef.current.chartModifiers.getById("cursor").isEnabled = true;
        } else if (state === "line") {
            sciChartSurfaceRef.current.chartModifiers.getById("marker").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("line").isEnabled = true;
            sciChartSurfaceRef.current.chartModifiers.getById("pan").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("cursor").isEnabled = false;
        } else if (state === "marker") {
            sciChartSurfaceRef.current.chartModifiers.getById("marker").isEnabled = true;
            sciChartSurfaceRef.current.chartModifiers.getById("line").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("pan").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("cursor").isEnabled = false;
        }
    };

    const handleNameChanged = (event: any) => {
        setName(event.target.value);
    };

    const handleSelectionChanged = (event: any) => {
        setSelectedChart(event.target.value);
    };

    const saveChart = (event: any) => {
        savedCharts[name] = controlsRef.current.getDefinition();
        localStorage.setItem("shared-charts", JSON.stringify(savedCharts));
        setSavedCharts(savedCharts);
        setSelectedChart(name);
    };
    const loadChart = (event: any) => {
        const definition = savedCharts[selectedChart];
        setName(selectedChart);
        controlsRef.current.resetChart();
        controlsRef.current.applyDefinition(definition);
    };
    const resetChart = (event: any) => {
        controlsRef.current.resetChart();
    };

    return (
        <React.Fragment>
            <div className={classes.FullHeightChartWrapper} style={{ background: appTheme.DarkIndigo }}>
                <ToggleButtonGroup
                    style={{ height: "70px", padding: "10" }}
                    exclusive
                    value={chartMode}
                    onChange={handleToggleButtonChanged}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={"pan"} style={{ color: appTheme.ForegroundColor }}>
                        Pan/Cursor
                    </ToggleButton>
                    <ToggleButton value={"line"} style={{ color: appTheme.ForegroundColor }}>
                        Lines
                    </ToggleButton>
                    <ToggleButton value={"marker"} style={{ color: appTheme.ForegroundColor }}>
                        Markers
                    </ToggleButton>
                </ToggleButtonGroup>
                <ButtonGroup
                    color="primary"
                    aria-label="small outlined button group"
                    style={{ height: "70px", padding: "10" }}
                >
                    <TextField
                        id="chartName"
                        label="Save As"
                        type="text"
                        inputProps={{ style: { color: appTheme.ForegroundColor }, "aria-label": "Without label" }}
                        value={name}
                        multiline={false}
                        variant="outlined"
                        onChange={handleNameChanged}
                    ></TextField>
                    <Button id="btnSave" onClick={saveChart}>
                        Save
                    </Button>
                </ButtonGroup>
                <ButtonGroup
                    color="primary"
                    aria-label="small outlined button group"
                    style={{ height: "70px", padding: "10" }}
                >
                    <Select
                        id="select-chart-names"
                        inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                        style={{ color: appTheme.ForegroundColor, width: 150 }}
                        value={selectedChart}
                        displayEmpty
                        autoWidth={true}
                        onChange={handleSelectionChanged}
                    >
                        <MenuItem value="" disabled>
                            Load From
                        </MenuItem>
                        {Object.keys(savedCharts).map((name, i) => (
                            <MenuItem value={name} key={i}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button id="btnLoad" onClick={loadChart}>
                        Load
                    </Button>
                    <Button id="btnReset" onClick={resetChart}>
                        Reset
                    </Button>
                </ButtonGroup>
                <SciChartReact
                    style={{ width: "100%", height: "100%" }}
                    initChart={drawExample}
                    onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                        sciChartSurfaceRef.current = sciChartSurface;
                        controlsRef.current = controls;
                    }}
                />
            </div>
        </React.Fragment>
    );
}
