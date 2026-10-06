import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

export default function GaugeChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className="sc-chart-wrapper sc-grid-2x3"
        >
            <SciChartReact initChart={chartsInitializationAPI.gauge1} />
            <SciChartReact initChart={chartsInitializationAPI.gauge2} />
            <SciChartReact initChart={chartsInitializationAPI.gauge3} />
            <SciChartReact initChart={chartsInitializationAPI.gauge4} />
            <SciChartReact initChart={chartsInitializationAPI.gauge5} />
            <SciChartReact initChart={chartsInitializationAPI.gauge6} />
        </ChartGroupLoader>
    );
}
