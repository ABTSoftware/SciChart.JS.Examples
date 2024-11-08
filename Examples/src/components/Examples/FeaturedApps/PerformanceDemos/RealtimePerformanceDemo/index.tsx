import { useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import { makeStyles } from "tss-react/mui";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
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

export default function RealtimePerformanceDemo() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>();

    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ numberPoints: 0, fps: 0 });

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
                    <div># DataPoints: {stats.numberPoints.toLocaleString()}</div>
                    <div>FPS: {stats.fps.toFixed(0).padStart(2, "0")}</div>
                </div>
                <SciChartReact
                    className={classes.chartArea}
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = initResult.controls;
                        initResult.controls.setStatsChangedCallback((stats) => setStats(stats));
                        initResult.controls.startUpdate();
                        setIsStarted(true);
                    }}
                    onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        initResult.controls.stopUpdate();
                    }}
                />
            </div>
        </div>
    );
}
