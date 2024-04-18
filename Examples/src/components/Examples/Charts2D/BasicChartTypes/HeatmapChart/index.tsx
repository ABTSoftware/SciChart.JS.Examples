import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { Button } from "@material-ui/core";
import { appTheme } from "scichart-example-dependencies";
import { makeStyles } from "@material-ui/core/styles";
import {
    SciChartSurface,
    HeatmapLegend
} from "scichart";
import {drawExample, divElementId, drawHeatmapLegend, divHeatmapLegend } from "./drawExample";

// Styles for layout of the toolbar / chart area
const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function HeatmapChart() {
    const controlsRef = React.useRef({
        startDemo: () => {},
        stopDemo: () => {}
    });
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();
    const [stats, setStats] = React.useState({ xSize: 0, ySize: 0, fps: 0 });

    React.useEffect(() => {
        const chartInitializationPromise = Promise.all([drawExample(), drawHeatmapLegend()]).then(([res, legend]) => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            heatmapLegendRef.current = legend;
            controlsRef.current = res.controls;

            // Handle drawing/updating FPS
            let lastRendered = Date.now();
            res.sciChartSurface.rendered.subscribe(() => {
                const currentTime = Date.now();
                const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
                lastRendered = currentTime;
                const fps = 1 / timeDiffSeconds;
                setStats({
                    xSize: res.heatmapDataSeries.arrayWidth,
                    ySize: res.heatmapDataSeries.arrayHeight,
                    fps
                });
            });
            res.controls.startDemo();
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                controlsRef.current.stopDemo();
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                controlsRef.current.stopDemo();
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
            });
        };
    }, []);

    const localClasses = useStyles();

    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <Button
                            onClick={() => controlsRef.current.startDemo()}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Start
                        </Button>
                        <Button
                            onClick={() => controlsRef.current.stopDemo()}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Stop
                        </Button>
                        <span style={{ margin: 12, minWidth: "200px" }}>
                            # Heatmap Size: {stats.xSize} x {stats.ySize}
                        </span>
                        <span style={{ margin: 12 }}>FPS: {stats.fps.toFixed(0)}</span>
                    </div>
                    <div className={localClasses.chartArea} style={{ position: "relative" }}>
                        <div id={divElementId} style={{ width: "100%", height: "100%" }}></div>
                        <div
                            id={divHeatmapLegend}
                            style={{
                                position: "absolute",
                                height: "90%",
                                width: "100px",
                                top: 0,
                                right: "75px",
                                margin: "20"
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
