import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { Button } from "@mui/material";
import { appTheme } from "../../../theme";
import { makeStyles } from "@mui/styles";
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
    const [stats, setStats] = React.useState({ xSize: 0, ySize: 0, fps: 0 });

    const classes = useStyles();

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <div className={classes.toolbarRow}>
                    <Button onClick={() => controlsRef.current.startDemo()} style={{ color: appTheme.ForegroundColor }}>
                        Start
                    </Button>
                    <Button onClick={() => controlsRef.current.stopDemo()} style={{ color: appTheme.ForegroundColor }}>
                        Stop
                    </Button>
                    <span style={{ margin: 12, minWidth: "200px" }}>
                        # Heatmap Size: {stats.xSize} x {stats.ySize}
                    </span>
                    <span style={{ margin: 12 }}>FPS: {stats.fps.toFixed(0)}</span>
                </div>
                <div className={classes.chartArea} style={{ position: "relative" }}>
                    <SciChartReact
                        initChart={drawExample}
                        style={{ width: "100%", height: "100%" }}
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            const { subscribeToRenderStats, controls } = initResult;
                            controlsRef.current = controls;

                            subscribeToRenderStats((stats) => setStats(stats));

                            // Start the demo
                            controls.startDemo();

                            // Cleanup function
                            return () => {
                                controls.stopDemo();
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
    );
}
