import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationAPI);

    return (
        <ChartGroupLoader
            className={commonClasses.ChartWrapper}
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: "5px",
                padding: "5px",
            }}
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
