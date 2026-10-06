import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationApi } from "./drawExample";

export default function VirtualizedDataOverview() {
    const [chartInitializationApi] = useState(getChartsInitializationApi);
    const [isMainChartInitialized, setIsMainChartInitialized] = useState(false);

    return (
        <div className="sc-chart-wrapper">
            <div className="flex flex-col h-full">
                <SciChartReact
                    style={{ flex: "1 1 600px" }}
                    initChart={chartInitializationApi.createMainChart}
                    onInit={() => setIsMainChartInitialized(true)}
                />
                {isMainChartInitialized ? (
                    <SciChartReact
                        style={{ flex: "1 1 100px" }}
                        initChart={chartInitializationApi.createOverview}
                        onInit={chartInitializationApi.afterOverviewInit}
                    />
                ) : null}
            </div>
        </div>
    );
}
