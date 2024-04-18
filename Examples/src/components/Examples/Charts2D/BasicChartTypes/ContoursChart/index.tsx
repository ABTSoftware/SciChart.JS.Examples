import * as React from "react";
import {
    SciChartSurface,
    HeatmapLegend
} from "scichart";
import classes from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend, divHeatmapLegend, divElementId } from "./drawExample";

export default function ContourChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();

    React.useEffect(() => {
            const chartInitializationPromise = Promise.all([
                drawExample(),
                drawHeatmapLegend()
            ]).then(([{ sciChartSurface }, legend]) => {
                sciChartSurfaceRef.current = sciChartSurface;
                heatmapLegendRef.current = legend;
            })

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
            });
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId} style={{ width: "100%", height: "100%" }}></div>
            <div
                id={divHeatmapLegend}
                style={{ position: "absolute", height: "92%", width: "100px", top: 0, right: "70px", margin: "20px" }}
            ></div>
        </div>
    );
}
