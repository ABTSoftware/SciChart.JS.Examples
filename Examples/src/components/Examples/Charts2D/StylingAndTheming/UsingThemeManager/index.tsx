import * as React from "react";
import { SciChartReact } from "scichart-react";
import { appTheme } from "../../../theme";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// Styles for the 2x2 grid
const itemStyle: React.CSSProperties = { flex: "auto", flexBasis: "50%", minWidth: "200px" };

export default function ChartComponent() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper flex flex-wrap">
            <SciChartReact style={itemStyle} initChart={chartsInitializationAPI.createNavyThemeChart} />
            <SciChartReact style={itemStyle} initChart={chartsInitializationAPI.createLightThemeChart} />
            <SciChartReact style={itemStyle} initChart={chartsInitializationAPI.createDarkThemeChart} />
            <SciChartReact style={itemStyle} initChart={chartsInitializationAPI.createCustomThemeChart} />
        </ChartGroupLoader>
    );
}
