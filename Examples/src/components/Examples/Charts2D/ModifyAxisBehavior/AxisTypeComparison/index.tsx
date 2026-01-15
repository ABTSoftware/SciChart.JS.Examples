import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, SciChartGroup, TResolvedReturnType, IInitResult } from "scichart-react";
import { createIndexChart, createDiscontinuousDateChart, createCategoryChart } from "./drawExample";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";
import { NumberRange, SciChartSurface } from "scichart";
import React from "react";

export default function AxisTypeComparisonExample() {
    const axisSynchroniserRef = React.useRef<AxisSynchroniser>(new AxisSynchroniser(new NumberRange(0, 17)));

    const onAllInit = (initResults: IInitResult[]) => {
        // Synchronise all x axes
        const xAxes = initResults.map((r) => (r.sciChartSurface as SciChartSurface).xAxes.get(0));
        xAxes.forEach((axis) => axisSynchroniserRef.current.addAxis(axis));
    };

    return (
        <div className={commonClasses.ChartWrapper}>
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
                <SciChartGroup onInit={onAllInit}>
                    {/* Numeric Chart */}
                    <SciChartReact
                        initChart={createDiscontinuousDateChart}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />

                    {/* Index Chart */}
                    <SciChartReact
                        initChart={createIndexChart}
                        style={{
                            width: "100%",
                            flex: "1 1 0",
                            minHeight: "0",
                        }}
                    />

                    {/* Category Chart */}
                    <SciChartReact
                        initChart={createCategoryChart}
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
