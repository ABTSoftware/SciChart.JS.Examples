import * as React from "react";
import classes from "../../../styles/Examples.module.scss";

import { SciChart3DSurface } from "scichart";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

// REACT COMPONENT
export default function SurfaceMesh3DChart() {
    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <SciChartReact
                    initChart={drawExample}
                    style={{ position: "absolute", height: "100%", width: "100%" }}
                />
                <SciChartReact
                    initChart={drawHeatmapLegend}
                    style={{ position: "absolute", height: "95%", width: "100px", right: "75px", margin: "20" }}
                />
            </div>
        </div>
    );
}
