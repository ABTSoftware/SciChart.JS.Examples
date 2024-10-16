import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import classes from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
    const [updateEnabled, setUpdateEnabled] = React.useState(true);

    const localClasses = useStyles();

    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <Button
                            onClick={() => {
                                updateEnabled ? controlsRef.current.stopDemo() : controlsRef.current.startDemo();
                                setUpdateEnabled(!updateEnabled);
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            {updateEnabled ? "Stop" : "Start"}
                        </Button>
                        <div
                            style={{
                                margin: 12,
                                flex: "auto",
                            }}
                        >
                            # DataPoints: {stats.numberPoints.toLocaleString()}
                        </div>
                        <div style={{ margin: 12, flex: "none", alignSelf: "center" }}>FPS: {stats.fps.toFixed(0)}</div>
                    </div>
                    <SciChartReact
                        className={localClasses.chartArea}
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
