import { useState } from "react";
import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";

export default function Interactive3DWaterfallSpectralChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className="sc-chart-wrapper flex flex-col"
            onInit={chartsInitializationAPI.configureAfterInit}
        >
            <SciChartReact
                className="min-h-0"
                style={{ flex: "1 1 60%" }}
                initChart={chartsInitializationAPI.initMainChart3D}
            />
            <div className="flex min-h-0 w-full" style={{ flex: "1 1 40%" }}>
                <SciChartReact
                    className="w-full h-full"
                    initChart={chartsInitializationAPI.initCrossSectionLeft}
                />
                <SciChartReact
                    className="w-full h-full"
                    initChart={chartsInitializationAPI.initCrossSectionRight}
                />
            </div>
        </ChartGroupLoader>
    );
}
