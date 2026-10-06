import { useState } from "react";
import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";

export default function Interactive3DWaterfallSpectralChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <div className="sc-chart-wrapper flex flex-col" >
            <ChartGroupLoader
                className="flex flex-col flex-1 min-h-0"

                onInit={chartsInitializationAPI.configureAfterInit}
            >
                <SciChartReact
                    className="min-h-0"
                    style={{ flex: "1 1 60%" }}
                    initChart={chartsInitializationAPI.initMainChart3D}
                />
                <div className="flex min-h-0" style={{ flex: "1 1 40%" }}>
                    <SciChartReact
                        className="flex-1 min-w-0"
                        initChart={chartsInitializationAPI.initCrossSectionLeft}
                    />
                    <SciChartReact
                        className="flex-1 min-w-0"
                        initChart={chartsInitializationAPI.initCrossSectionRight}
                    />
                </div>
            </ChartGroupLoader>
        </div>
    );
}
