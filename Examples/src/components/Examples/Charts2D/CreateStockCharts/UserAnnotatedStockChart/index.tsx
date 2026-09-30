import * as React from "react";
import { SciChartSurface, chartReviver, localStorageApi } from "scichart";

import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

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

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="small outlined button group">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={chartMode === "pan"}
                        onClick={(event) => handleToggleButtonChanged(event, "pan")}
                    >
                        Pan
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={chartMode === "line"}
                        onClick={(event) => handleToggleButtonChanged(event, "line")}
                    >
                        Lines
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={chartMode === "marker"}
                        onClick={(event) => handleToggleButtonChanged(event, "marker")}
                    >
                        Markers
                    </button>
                </div>

                <label className="sc-control" htmlFor="chartName">
                    Save As
                    <input className="sc-input" id="chartName" type="text" value={name} onChange={handleNameChanged} />
                </label>

                <div className="sc-button-group" role="group" aria-label="Save chart">
                    <button className="sc-button" type="button" id="btnSave" onClick={saveChart}>
                        Save
                    </button>
                </div>

                <div className="sc-button-group" role="group" aria-label="Load or reset chart">
                    <select
                        className="sc-select"
                        id="select-chart-names"
                        aria-label="Select saved chart"
                        value={selectedChart}
                        onChange={handleSelectionChanged}
                    >
                        <option value="" disabled>
                            {Object.keys(savedCharts).length > 0 ? "Load from" : "No saved charts"}
                        </option>
                        {Object.keys(savedCharts).map((name: string, i: number) => (
                            <option value={name} key={i}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <button className="sc-button" type="button" id="btnLoad" onClick={loadChart}>
                        Load
                    </button>
                    <button className="sc-button" type="button" id="btnReset" onClick={resetChart}>
                        Reset
                    </button>
                </div>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                    sciChartSurfaceRef.current = sciChartSurface;
                    controlsRef.current = controls;
                }}
            />
        </div>
    );
}
