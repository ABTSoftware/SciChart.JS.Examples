import { useState } from "react";
import { SciChartReact, ChartGroupLoader } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";

export default function ChartComponent() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper sc-chart-grid">
            <SciChartReact initChart={chartsInitializationAPI.createNavyThemeChart} />
            <SciChartReact initChart={chartsInitializationAPI.createLightThemeChart} />
            <SciChartReact initChart={chartsInitializationAPI.createDarkThemeChart} />
            <SciChartReact initChart={chartsInitializationAPI.createCustomThemeChart} />
        </ChartGroupLoader>
    );
}
