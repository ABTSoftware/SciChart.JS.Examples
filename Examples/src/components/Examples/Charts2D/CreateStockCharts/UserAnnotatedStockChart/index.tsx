import { useRef, useState, useEffect } from "react";
import { chartReviver, localStorageApi } from "scichart";

import { RefreshIcon } from "../../../icons";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

const STORAGE_KEY = "Annotated-Charts";

export default function UserAnnotatedStockChart() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [isReady, setIsReady] = useState(false);
    const [name, setName] = useState<string>("");
    const [chartMode, setChartMode] = useState<"line" | "marker" | "pan">("line");
    const [savedCharts, setSavedCharts] = useState<Record<string, object>>({});
    const [selectedChart, setSelectedChart] = useState<string>("");

    useEffect(() => {
        if (localStorageApi.storageAvailable()) {
            setSavedCharts(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}", chartReviver));
        }
    }, []);

    const setMode = (mode: "pan" | "line" | "marker") => {
        controlsRef.current?.setChartMode(mode);
        setChartMode(mode);
    };

    const saveChart = () => {
        const chartName = name.trim();
        if (!controlsRef.current || !chartName) return;
        const nextSavedCharts = { ...savedCharts, [chartName]: controlsRef.current.getDefinition() };
        if (localStorageApi.storageAvailable()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSavedCharts));
        }
        setSavedCharts(nextSavedCharts);
        setName(chartName);
        setSelectedChart(chartName);
    };

    const loadChart = () => {
        const definition = savedCharts[selectedChart];
        if (!controlsRef.current || !definition) return;
        setName(selectedChart);
        controlsRef.current.resetChart();
        controlsRef.current.applyDefinition(definition);
    };

    const savedChartNames = Object.keys(savedCharts);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row justify-start">
                <div className="sc-button-group" role="group" aria-label="Chart mode">
                    <button
                        type="button"
                        className="sc-button"
                        disabled={!isReady}
                        aria-pressed={chartMode === "pan"}
                        onClick={() => setMode("pan")}
                    >
                        Pan
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        disabled={!isReady}
                        aria-pressed={chartMode === "line"}
                        onClick={() => setMode("line")}
                    >
                        Lines
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        disabled={!isReady}
                        aria-pressed={chartMode === "marker"}
                        onClick={() => setMode("marker")}
                    >
                        Markers
                    </button>
                </div>

                <div className="flex items-center gap-2 ml-auto" role="group" aria-label="Save chart">
                    <input
                        className="sc-input"
                        id="chartName"
                        type="text"
                        aria-label="Chart name"
                        placeholder="Chart name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") saveChart();
                        }}
                        disabled={!isReady}
                        style={{ width: 110 }}
                    />
                    <button
                        className="sc-button sc-button-outline"
                        type="button"
                        id="btnSave"
                        onClick={saveChart}
                        disabled={!isReady || !name.trim()}
                        title={name.trim() ? "Save chart with this name" : "Enter a chart name to save"}
                    >
                        Save
                    </button>
                </div>

                <div className="flex items-center gap-2" role="group" aria-label="Load chart">
                    <select
                        className="sc-select"
                        id="select-chart-names"
                        aria-label="Select saved chart"
                        value={selectedChart}
                        onChange={(event) => setSelectedChart(event.target.value)}
                        disabled={!isReady || savedChartNames.length === 0}
                        style={{ width: 130 }}
                    >
                        <option value="" disabled>
                            {savedChartNames.length > 0 ? "Saved charts" : "No saved charts"}
                        </option>
                        {savedChartNames.map((chartName) => (
                            <option value={chartName} key={chartName}>
                                {chartName}
                            </option>
                        ))}
                    </select>
                    <button
                        className="sc-button sc-button-outline"
                        type="button"
                        id="btnLoad"
                        onClick={loadChart}
                        disabled={!isReady || !savedCharts[selectedChart]}
                        title={savedCharts[selectedChart] ? "Load selected chart" : "Select a saved chart to load"}
                    >
                        Load
                    </button>
                </div>
                <button
                    className="sc-button sc-button-icon sc-button-danger"
                    type="button"
                    id="btnReset"
                    aria-label="Refresh chart"
                    title="Clear annotations and reset zoom"
                    disabled={!isReady}
                    onClick={() => controlsRef.current?.resetChart()}
                >
                    <RefreshIcon />
                </button>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                    setIsReady(true);
                }}
            />
        </div>
    );
}
