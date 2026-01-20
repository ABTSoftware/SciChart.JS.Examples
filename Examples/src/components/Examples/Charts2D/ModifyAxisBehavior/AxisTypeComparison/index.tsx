import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, SciChartGroup, TResolvedReturnType, IInitResult } from "scichart-react";
import { createIndexChart, createDiscontinuousDateChart, createCategoryChart } from "./drawExample";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";
import { NumberRange, SciChartSurface } from "scichart";
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";

export default function AxisTypeComparisonExample() {
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
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <ToggleButtonGroup
                    className={commonClasses.ToggleButtonGroup}
                    exclusive
                    value={customSettings}
                    onChange={handleToggleButtonChanged}
                    size="medium"
                    color="primary"
                    aria-label="axis settings toggle"
                >
                    <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                        Default axis settings
                    </ToggleButton>
                    <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                        Custom LabelProvider and explicit tick delta
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
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

                    {/* Index Chart */}
                    <SciChartReact
                        initChart={createIndexChart(customSettings)}
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
