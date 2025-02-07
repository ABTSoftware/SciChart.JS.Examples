import * as React from "react";
import {
    SciChartSurface,
    FastCandlestickRenderableSeries,
    SciChartOverview,
    FastOhlcRenderableSeries,
    chartReviver,
    localStorageApi,
} from "scichart";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { Button, ButtonGroup, MenuItem, Select, TextField } from "@mui/material";

// If you want to keep using makeStyles:
import { makeStyles } from "tss-react/mui";

import { SciChartReact, TResolvedReturnType } from "scichart-react";

const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    chartArea: {
        flex: 1,
    },
}));

const STORAGE_KEY = "Annotated-Charts";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function UserAnnotatedStockChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [name, setName] = React.useState<string>("");
    const [chartMode, setChartMode] = React.useState<"line" | "marker" | "pan">("line");
    const [savedCharts, setSavedCharts] = React.useState<Record<string, object>>({});
    const [selectedChart, setSelectedChart] = React.useState<string>("");

    React.useEffect(() => {
        if (localStorageApi.storageAvailable()) {
            setSavedCharts(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}", chartReviver));
        }
    }, []);

    const handleToggleButtonChanged = (event: any, state: "pan" | "line" | "marker") => {
        if (state === null) return;
        setChartMode(state);
        controlsRef.current.setChartMode(state);
    };

    const handleNameChanged = (event: any) => {
        setName(event.target.value);
    };

    const handleSelectionChanged = (event: any) => {
        setSelectedChart(event.target.value);
    };

    const saveChart = (event: any) => {
        savedCharts[name] = controlsRef.current.getDefinition();
        if (localStorageApi.storageAvailable()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCharts));
        }
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

    const { classes } = useStyles();

    return (
        <React.Fragment>
            <div className={commonClasses.ChartWrapper}>
                <div className={classes.flexOuterContainer}>
                    <div className={commonClasses.ToolbarRow}>
                        <ToggleButtonGroup
                            style={{ height: "50px" }}
                            exclusive
                            value={chartMode}
                            onChange={handleToggleButtonChanged}
                            size="small"
                            color="primary"
                            aria-label="small outlined button group"
                        >
                            <ToggleButton
                                value={"pan"}
                                style={{ color: appTheme.ForegroundColor, borderColor: "#00bcd466" }}
                                onClick={() => handleToggleButtonChanged(null, "pan")}
                            >
                                Pan
                            </ToggleButton>
                            <ToggleButton
                                value={"line"}
                                style={{ color: appTheme.ForegroundColor, borderColor: "#00bcd466" }}
                                onClick={() => handleToggleButtonChanged(null, "line")}
                            >
                                Lines
                            </ToggleButton>
                            <ToggleButton
                                value={"marker"}
                                style={{ color: appTheme.ForegroundColor, borderColor: "#00bcd466" }}
                                onClick={() => handleToggleButtonChanged(null, "marker")}
                            >
                                Markers
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <TextField
                            id="chartName"
                            label="Save As"
                            type="text"
                            style={{ backgroundColor: "#00bcd111", marginLeft: "auto", borderRadius: 3 }}
                            inputProps={{
                                style: { color: appTheme.ForegroundColor, height: 13 },
                                "aria-label": "Without label",
                            }}
                            value={name}
                            multiline={false}
                            variant="outlined"
                            onChange={handleNameChanged}
                        ></TextField>

                        <ButtonGroup
                            color="primary"
                            aria-label="small outlined button group"
                            style={{ margin: "0 5px" }}
                        >
                            <Button id="btnSave" onClick={saveChart}>
                                Save
                            </Button>
                        </ButtonGroup>

                        <ButtonGroup color="primary" aria-label="small outlined button group">
                            <Select
                                id="select-chart-names"
                                inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                                style={{ color: appTheme.ForegroundColor, width: 150, backgroundColor: "#00bcd411" }}
                                value={selectedChart}
                                displayEmpty
                                autoWidth={true}
                                onChange={handleSelectionChanged}
                            >
                                {Object.keys(savedCharts).length > 0 ? (
                                    <MenuItem value="" disabled>
                                        Load from
                                    </MenuItem>
                                ) : (
                                    <MenuItem value="" disabled>
                                        No saved charts
                                    </MenuItem>
                                )}
                                {Object.keys(savedCharts).map((name: string, i: number) => (
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
                    </div>
                    <SciChartReact
                        className={classes.chartArea}
                        initChart={drawExample}
                        onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                            sciChartSurfaceRef.current = sciChartSurface;
                            controlsRef.current = controls;
                        }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}
