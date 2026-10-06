import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

export default function LineChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper sc-chart-grid">
            <SciChartReact initChart={chartsInitializationAPI.initJustLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initDigitalLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initTooltipsOnLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initDashedLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initPalettedLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initHoveredLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initGapsInLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initVerticalLineCharts} />
            <SciChartReact initChart={chartsInitializationAPI.initThresholdedLineCharts} />
        </ChartGroupLoader>
    );
}
