import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

export default function InteractiveWaterfallChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className="sc-chart-wrapper w-full h-full flex flex-col"
            onInit={() => {
                chartsInitializationAPI.configureAfterInit();
            }} // callback executed when all charts within the group are initialized
        >
            <SciChartReact style={{ flex: "1 1 60%" }} initChart={chartsInitializationAPI.initMainChart} />
            <div className="flex" style={{ flex: "1 1 40%" }}>
                <SciChartReact className="flex-1" initChart={chartsInitializationAPI.initCrossSectionLeft} />
                <SciChartReact className="flex-1" initChart={chartsInitializationAPI.initCrossSectionRight} />
            </div>
        </ChartGroupLoader>
    );
}
