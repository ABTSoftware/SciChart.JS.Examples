import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

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
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: 1,
    },
}));

export default function RealtimePerformanceDemo() {
    const controlsRef = React.useRef<{
        startDemo: () => void;
        stopDemo: () => void;
    }>();

    const [stats, setStats] = React.useState({ numberPoints: 0, fps: 0 });

    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={commonClasses.ChartWrapper}>
                <div className={classes.flexOuterContainer}>
                    <div className={classes.toolbarRow}>
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
                        <span
                            style={{
                                margin: 12,
                                minWidth: "200px",
                            }}
                        >
                            # DataPoints: {stats.numberPoints.toLocaleString()}
                        </span>
                        <span style={{ margin: 12 }}>FPS: {stats.fps.toFixed(0)}</span>
                    </div>
                    <SciChartReact
                        className={classes.chartArea}
                        initChart={drawExample}
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            controlsRef.current = initResult.controls;
                            initResult.controls.setStatsChangedCallback((renderStats) => setStats(renderStats));
                            initResult.controls.startDemo();
                        }}
                        onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            initResult.controls.stopDemo();
                        }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}
