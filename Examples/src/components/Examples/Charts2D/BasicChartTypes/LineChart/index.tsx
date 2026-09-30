import * as React from "react";
import { SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// Styles for the 3x3 grid
const itemStyle: React.CSSProperties = { flex: "auto", flexBasis: "33%", minWidth: "200px", height: "auto" };

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper flex flex-wrap" style={{ background: appTheme.Background }}>
            <SciChartReact initChart={chartsInitializationAPI.initJustLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initDigitalLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initTooltipsOnLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initDashedLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initPalettedLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initHoveredLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initGapsInLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initVerticalLineCharts} style={itemStyle} />
            <SciChartReact initChart={chartsInitializationAPI.initThresholdedLineCharts} style={itemStyle} />
        </ChartGroupLoader>
    );
}
