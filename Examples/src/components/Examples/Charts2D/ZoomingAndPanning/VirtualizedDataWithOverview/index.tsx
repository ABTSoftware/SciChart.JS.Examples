import * as React from "react";
import { useState } from "react";
import { SciChartReact } from "scichart-react";
import classes from "../../../styles/Examples.module.scss";
import { getChartsInitializationApi } from "./drawExample";

export default function VirtualizedDataOverview() {
    const [chartInitializationApi] = useState(getChartsInitializationApi);
    const [isMainChartInitialized, setIsMainChartInitialized] = useState(false);

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <SciChartReact
                    style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1 }}
                    initChart={chartInitializationApi.createMainChart}
                    onInit={() => setIsMainChartInitialized(true)}
                />
                {isMainChartInitialized ? (
                    <SciChartReact
                        style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }}
                        initChart={chartInitializationApi.createOverview}
                        onInit={chartInitializationApi.afterOverviewInit}
                    />
                ) : null}
            </div>
        </div>
    );
}
