import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

import { SciChart3DSurface } from "scichart";

export default function LiDAR3DPointCloudDemo() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative" }}>
                <SciChartReact
                    initChart={drawExample}
                    style={{ width: "100%", height: "100%" }}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { sciChartSurface } = initResult;
                        sciChartSurfaceRef.current = sciChartSurface;
                    }}
                />
                <SciChartReact
                    initChart={drawHeatmapLegend}
                    style={{ position: "absolute", height: "90%", width: "100px", top: 0, right: "75px", margin: "20" }}
                />
            </div>
        </div>
    );
}
