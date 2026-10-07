import { useState } from "react";
import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";

export default function LineChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className="sc-chart-wrapper sc-chart-grid"
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
