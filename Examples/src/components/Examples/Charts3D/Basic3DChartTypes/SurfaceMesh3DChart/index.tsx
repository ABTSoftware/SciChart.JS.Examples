import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";

import { SciChart3DSurface } from "scichart";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { ChartGroupLoader } from "../../../ChartGroupLoader";

// REACT COMPONENT
export default function SurfaceMesh3DChart() {
    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <SciChartReact initChart={drawExample} style={{ height: "100%", width: "100%" }} />
            <SciChartReact
                initChart={drawHeatmapLegend}
                style={{ position: "absolute", height: "100%", width: "65px", top: "0px", right: "0px" }}
            />
        </ChartGroupLoader>
    );
}
