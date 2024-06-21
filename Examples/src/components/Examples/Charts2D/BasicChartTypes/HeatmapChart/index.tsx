import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { Button } from "@material-ui/core";
import { appTheme } from "../../../theme";
import { makeStyles } from "@material-ui/core/styles";
import { SciChartSurface, HeatmapLegend } from "scichart";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

// Styles for layout of the toolbar / chart area
const useStyles = makeStyles((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    toolbarRow: {
        display: "flex",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: 1,
    },
}));

export default function HeatmapChart() {
    const controlsRef = React.useRef({
        startDemo: () => {},
        stopDemo: () => {},
    });
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();
    const [stats, setStats] = React.useState({ xSize: 0, ySize: 0, fps: 0 });

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
                        <SciChartReact
                            initChart={drawExample}
                            style={{ width: "100%", height: "100%" }}
                            onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                                const { sciChartSurface, heatmapDataSeries, controls } = initResult;
                                sciChartSurfaceRef.current = sciChartSurface;
                                controlsRef.current = controls;

                                // Initialize heatmap legend not required for now
                                // drawHeatmapLegend().then((legend) => {
                                //     heatmapLegendRef.current = legend;
                                // });

                                // Handle drawing/updating FPS
                                let lastRendered = Date.now();
                                sciChartSurface.rendered.subscribe(() => {
                                    const currentTime = Date.now();
                                    const timeDiffSeconds = (currentTime - lastRendered) / 1000;
                                    lastRendered = currentTime;
                                    const fps = 1 / timeDiffSeconds;
                                    setStats({
                                        xSize: heatmapDataSeries.arrayWidth,
                                        ySize: heatmapDataSeries.arrayHeight,
                                        fps,
                                    });
                                });

                                // Start the demo
                                controls.startDemo();

                                // Cleanup function
                                return () => {
                                    controls.stopDemo();
                                    sciChartSurface.delete();
                                    if (heatmapLegendRef.current) {
                                        heatmapLegendRef.current.delete();
                                    }
                                };
                            }}
                        />
                        <SciChartReact
                            initChart={drawHeatmapLegend}
                            style={{
                                position: "absolute",
                                height: "90%",
                                width: "100px",
                                top: 0,
                                right: "75px",
                                margin: "20px",
                            }}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
