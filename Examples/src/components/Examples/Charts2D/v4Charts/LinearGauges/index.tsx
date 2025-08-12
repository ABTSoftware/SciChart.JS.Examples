import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { getChartsInitializationAPI } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function GaugeChart() {
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
            <SciChartReact initChart={chartsInitializationAPI.gauge1} />
            <SciChartReact initChart={chartsInitializationAPI.gauge2} />
            <SciChartReact initChart={chartsInitializationAPI.gauge3} />
            <SciChartReact initChart={chartsInitializationAPI.gauge4} />
            <SciChartReact initChart={chartsInitializationAPI.gauge5} />
            <SciChartReact initChart={chartsInitializationAPI.gauge6} />
        </ChartGroupLoader>
    );
}
