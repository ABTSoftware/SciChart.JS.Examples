import { useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import { makeStyles } from "tss-react/mui";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

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

export default function RealtimeGhostedTraces() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>();

    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ numberSeries: 0, numberPoints: 0, fps: 0 });

    const { classes } = useStyles();

    return (
        <div className={commonClasses.ChartWrapper}>
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
                    <div># Series: {stats.numberSeries}</div>
                    <div># DataPoints: {stats.numberPoints.toLocaleString()}</div>
                    <div style={{ flex: "none", flexBasis: "5em", textAlign: "left" }}>
                        FPS: {stats.fps.toFixed(0).padStart(2, "0")}
                    </div>
                </div>
                <SciChartReact
                    className={classes.chartArea}
                    initChart={drawExample}
                    onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = controls;

                        let lastRendered = Date.now();
                        sciChartSurface.rendered.subscribe(() => {
                            const currentTime = Date.now();
                            const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
                            lastRendered = currentTime;
                            const fps = 1 / timeDiffSeconds;
                            setStats({
                                numberSeries: sciChartSurface.renderableSeries.size(),
                                numberPoints:
                                    sciChartSurface.renderableSeries.size() *
                                    sciChartSurface.renderableSeries.get(0).dataSeries.count(),
                                fps,
                            });
                        });

                        controls.startUpdate();
                        setIsStarted(true);
                    }}
                    onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        controls.stopUpdate();
                    }}
                />
            </div>
        </div>
    );
}
