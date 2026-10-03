import * as React from "react";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

export default function ChartComponent() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper flex flex-wrap">
            <SciChartReact
                style={{ flex: "auto", flexBasis: "50%", minWidth: "200px" }}
                initChart={chartsInitializationAPI.createNavyThemeChart}
            />
            <SciChartReact
                style={{ flex: "auto", flexBasis: "50%", minWidth: "200px" }}
                initChart={chartsInitializationAPI.createLightThemeChart}
            />
            <SciChartReact
                style={{ flex: "auto", flexBasis: "50%", minWidth: "200px" }}
                initChart={chartsInitializationAPI.createDarkThemeChart}
            />
            <SciChartReact
                style={{ flex: "auto", flexBasis: "50%", minWidth: "200px" }}
                initChart={chartsInitializationAPI.createCustomThemeChart}
            />
        </ChartGroupLoader>
    );
}
