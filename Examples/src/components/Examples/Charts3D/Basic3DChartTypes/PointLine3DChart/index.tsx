import * as React from "react";
import classes from "../../../styles/Examples.module.scss";

import {
    SciChart3DSurface,
    HeatmapLegend
} from "scichart";
import { drawExample, drawHeatmapLegend, divHeatmapLegend, divElementId } from "./drawExample";

// REACT COMPONENT
export default function PointLine3DChart() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();

    React.useEffect(() => {
        const chartInitializationPromise = Promise.all([
            drawExample(),
            drawHeatmapLegend()
        ]).then(([{ sciChart3DSurface }, legend]) => {
            sciChartSurfaceRef.current = sciChart3DSurface;
            heatmapLegendRef.current = legend;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                heatmapLegendRef.current = undefined;
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                heatmapLegendRef.current = undefined;
            });
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <div id={divElementId} style={{ position: "absolute", height: "100%", width: "100%" }}></div>
                <div
                    id={divHeatmapLegend}
                    style={{ position: "absolute", height: "95%", width: "110px", right: "20px", margin: "20" }}
                ></div>
            </div>
        </div>
    );
}
