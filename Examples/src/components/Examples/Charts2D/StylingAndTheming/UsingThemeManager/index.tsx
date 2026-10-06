import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

export default function ChartComponent() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper sc-chart-grid sc-chart-grid-two">
            <SciChartReact initChart={chartsInitializationAPI.createNavyThemeChart} />
            <SciChartReact initChart={chartsInitializationAPI.createLightThemeChart} />
            <SciChartReact initChart={chartsInitializationAPI.createDarkThemeChart} />
            <SciChartReact initChart={chartsInitializationAPI.createCustomThemeChart} />
        </ChartGroupLoader>
    );
}
