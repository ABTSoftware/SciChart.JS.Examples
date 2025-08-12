import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, ChartGroupLoader } from "scichart-react";

// REACT COMPONENT
export default function PointLine3DChart() {
    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <SciChartReact style={{ height: "100%", width: "100%" }} initChart={drawExample} />
            <SciChartReact
                style={{ position: "absolute", height: "100%", width: "65px", top: "0px", right: "0px" }}
                initChart={drawHeatmapLegend}
            />
        </ChartGroupLoader>
    );
}
