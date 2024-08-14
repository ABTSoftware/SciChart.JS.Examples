import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact } from "scichart-react";

// REACT COMPONENT
export default function PointLine3DChart() {
    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <SciChartReact
                    style={{ position: "absolute", height: "100%", width: "100%" }}
                    initChart={drawExample}
                />
                <SciChartReact
                    style={{ position: "absolute", height: "95%", width: "110px", right: "20px", margin: "20" }}
                    initChart={drawHeatmapLegend}
                />
            </div>
        </div>
    );
}
