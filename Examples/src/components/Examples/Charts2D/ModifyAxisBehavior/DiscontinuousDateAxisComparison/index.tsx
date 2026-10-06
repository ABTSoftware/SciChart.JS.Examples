import { SciChartReact, SciChartGroup, IInitResult } from "scichart-react";
import { createNumericChart, createDiscontinuousDateChart, createCategoryChart } from "./drawExample";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";
import { SciChartSurface } from "scichart";
import React from "react";

export default function DiscontinuousDateAxisComparisonExample() {
    const axisSynchroniserRef = React.useRef<AxisSynchroniser>(new AxisSynchroniser());
    const [customSettings, setCustomSettings] = React.useState(true);

    const onAllInit = (initResults: IInitResult[]) => {
        // Synchronise all x axes
        const xAxes = initResults.map((r) => (r.sciChartSurface as SciChartSurface).xAxes.get(0));
        xAxes.forEach((axis) => axisSynchroniserRef.current.addAxis(axis));
    };

    const handleToggleButtonChanged = (value: boolean) => {
        axisSynchroniserRef.current.clear();
        setCustomSettings(value);
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="axis settings toggle">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={customSettings === false}
                        onClick={() => handleToggleButtonChanged(false)}
                    >
                        Default axis settings
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={customSettings === true}
                        onClick={() => handleToggleButtonChanged(true)}
                    >
                        Custom LabelProvider & explicit tick delta
                    </button>
                </div>
            </header>
            <div className="flex flex-col h-full w-full" style={{ gap: 2, backgroundColor: "black" }}>
                <SciChartGroup onInit={onAllInit} key={customSettings ? "custom" : "default"}>
                    {/* Numeric Chart */}
                    <SciChartReact
                        initChart={createDiscontinuousDateChart(customSettings)}
                        className="w-full min-h-0"
                        style={{ flex: "1 1 0" }}
                    />

                    {/* Numeric Chart */}
                    <SciChartReact
                        initChart={createNumericChart(customSettings)}
                        className="w-full min-h-0"
                        style={{ flex: "1 1 0" }}
                    />

                    {/* Category Chart */}
                    <SciChartReact
                        initChart={createCategoryChart(customSettings)}
                        className="w-full min-h-0"
                        style={{ flex: "1 1 0" }}
                    />
                </SciChartGroup>
            </div>
        </div>
    );
}
