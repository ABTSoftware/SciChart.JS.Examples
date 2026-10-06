import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

export default function LineChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className="sc-chart-wrapper sc-grid-2x3"
        >
            <SciChartReact initChart={chartsInitializationAPI.line1} />
            <SciChartReact initChart={chartsInitializationAPI.line2} />
            <SciChartReact initChart={chartsInitializationAPI.line3} />
            <SciChartReact initChart={chartsInitializationAPI.line4} />
            <SciChartReact initChart={chartsInitializationAPI.line5} />
            <SciChartReact initChart={chartsInitializationAPI.line6} />
        </ChartGroupLoader>
    );
}
