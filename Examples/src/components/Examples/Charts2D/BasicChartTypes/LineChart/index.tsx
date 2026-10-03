import * as React from "react";
import { SciChartSurface } from "scichart";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader className="sc-chart-wrapper flex flex-wrap">
            <SciChartReact
                initChart={chartsInitializationAPI.initJustLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initDigitalLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initTooltipsOnLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initDashedLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initPalettedLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initHoveredLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initGapsInLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initVerticalLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
            <SciChartReact
                initChart={chartsInitializationAPI.initThresholdedLineCharts}
                style={{
                    flex: "auto",
                    flexBasis: "33%",
                    minWidth: "200px",
                    height: "auto",
                }}
            />
        </ChartGroupLoader>
    );
}
