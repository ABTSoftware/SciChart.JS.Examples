import { SciChartReact, SciChartGroup, TResolvedReturnType, IInitResult } from "scichart-react";
import { createNumericChart, createDiscontinuousDateChart, createCategoryChart } from "./drawExample";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";
import { NumberRange, SciChartSurface } from "scichart";
import React from "react";

import { appTheme } from "../../../theme";

export default function DiscontinuousDateAxisComparisonExample() {
    const axisSynchroniserRef = React.useRef<AxisSynchroniser>(new AxisSynchroniser());
    const [customSettings, setCustomSettings] = React.useState(true);

    const onAllInit = (initResults: IInitResult[]) => {
        // Synchronise all x axes
        const xAxes = initResults.map((r) => (r.sciChartSurface as SciChartSurface).xAxes.get(0));
        xAxes.forEach((axis) => axisSynchroniserRef.current.addAxis(axis));
    };

    const handleToggleButtonChanged = (event: any, value: boolean) => {
        if (value !== null) {
            axisSynchroniserRef.current.clear();
            setCustomSettings(value);
        }
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="axis settings toggle">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={customSettings === false}
                        onClick={(event) => handleToggleButtonChanged(event, false)}
                    >
                        Default axis settings
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={customSettings === true}
                        onClick={(event) => handleToggleButtonChanged(event, true)}
                    >
                        Custom LabelProvider & explicit tick delta
                    </button>
                </div>
            </header>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    gap: "2px",
                    backgroundColor: "black",
                }}
            >
                <SciChartGroup onInit={onAllInit} key={customSettings ? "custom" : "default"}>
                    {/* Numeric Chart */}
                    <SciChartReact
                        initChart={createDiscontinuousDateChart(customSettings)}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />

                    {/* Numeric Chart */}
                    <SciChartReact
                        initChart={createNumericChart(customSettings)}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />

                    {/* Category Chart */}
                    <SciChartReact
                        initChart={createCategoryChart(customSettings)}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />
                </SciChartGroup>
            </div>
        </div>
    );
}
