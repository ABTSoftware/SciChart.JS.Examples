import { useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import { makeStyles } from "tss-react/mui";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { ChartGroupLoader } from "../../../ChartGroupLoader";

// Styles for layout of the toolbar / chart area
const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    chartArea: {
        flex: 1,
    },
}));

export default function HeatmapChart() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ xSize: 0, ySize: 0, fps: 0 });

    const { classes } = useStyles();

    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <div className={commonClasses.ToolbarRow}>
                    <Button
                        onClick={() => {
                            if (isStarted) {
                                controlsRef.current.stopUpdate();
                            } else {
                                controlsRef.current.startUpdate();
                            }
                            setIsStarted(!isStarted);
                        }}
                    >
                        {isStarted ? <PauseIcon /> : <PlayArrowIcon />}
                    </Button>
                    <div>
                        # Heatmap Size: {stats.xSize} x {stats.ySize}
                    </div>
                    <div style={{ flex: "none", flexBasis: "4em", textAlign: "left" }}>
                        FPS: {stats.fps.toFixed(0).padStart(2, "0")}
                    </div>
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
                            controls.startUpdate();
                            setIsStarted(true);

                            // Cleanup function
                            return () => {
                                controls.stopUpdate();
                            };
                        }}
                    />
                    <SciChartReact
                        initChart={drawHeatmapLegend}
                        style={{
                            position: "absolute",
                            height: "100%",
                            width: "65px",
                            top: "0px",
                            right: "0px",
                        }}
                    />
                </div>
            </div>
        </ChartGroupLoader>
    );
}
