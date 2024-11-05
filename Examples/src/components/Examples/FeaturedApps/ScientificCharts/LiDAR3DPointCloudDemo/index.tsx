import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

import { SciChart3DSurface } from "scichart";

export default function LiDAR3DPointCloudDemo() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();

    return (
        <div className={commonClasses.ChartWrapper}>
            <SciChartReact
                initChart={drawExample}
                style={{ height: "100%", width: "100%" }}
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
    );
}
