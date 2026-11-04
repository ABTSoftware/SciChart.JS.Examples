import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationApi } from "./drawExample";

export default function VirtualizedDataOverview() {
    const [chartInitializationApi] = useState(getChartsInitializationApi);
    const [isMainChartInitialized, setIsMainChartInitialized] = useState(false);

    return (
        <div className="sc-chart-wrapper flex flex-col">
            <SciChartReact
                style={{ flex: "1 1 37.5rem" }}
                initChart={chartInitializationApi.createMainChart}
                onInit={() => setIsMainChartInitialized(true)}
            />
            {isMainChartInitialized ? (
                <SciChartReact
                    style={{ flex: "1 1 6.25rem" }}
                    initChart={chartInitializationApi.createOverview}
                    onInit={chartInitializationApi.afterOverviewInit}
                />
            ) : null}
        </div>
    );
}
