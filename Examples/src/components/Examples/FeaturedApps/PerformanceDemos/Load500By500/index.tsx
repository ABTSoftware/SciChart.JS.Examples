import * as React from "react";
import { useRef } from "react";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { makeStyles } from "tss-react/mui";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, TTimeSpan } from "./drawExample";
import { useViewType } from "../../../containerSizeHooks";

const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
}));

export default function Load500By500() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(null);
    const [timeSpans, setTimeSpans] = React.useState<TTimeSpan[]>([
        { title: "Generate Data Points", durationMs: 0 },
        { title: "Append Data Points", durationMs: 0 },
        { title: "Render the frame", durationMs: 0 },
    ]);
    const [isStarted, setIsStarted] = React.useState(false);

    const { classes } = useStyles();

    const viewRef = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(viewRef);
    const { isLargeView, isMobileView } = viewInfo ?? {};

    return (
        <div ref={viewRef} className={commonClasses.ChartWrapper}>
            {viewInfo ? (
                <div className={classes.flexOuterContainer}>
                    <SciChartReact
                        style={{ flex: 1 }}
                        initChart={(rootElement: string | HTMLDivElement) =>
                            drawExample(
                                rootElement,
                                (newTimeSpans: TTimeSpan[]) => {
                                    setTimeSpans([...newTimeSpans]);
                                },
                                isMobileView
                            )
                        }
                        onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                            controls.startUpdate();
                            controlsRef.current = controls;
                            setIsStarted(true);
                        }}
                        onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                            controls.stopUpdate();
                        }}
                    />
                    <div className={commonClasses.ToolbarRow} style={{ gap: "0px", paddingRight: "0px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    if (isStarted) {
                                        controlsRef.current.stopUpdate();
                                    } else {
                                        controlsRef.current.startUpdate();
                                    }
                                    setIsStarted(!isStarted);
                                }}
                                title="Toggle reload every 200 milliseconds"
                            >
                                {isStarted ? <PauseIcon /> : <PlayArrowIcon />}
                            </Button>
                            <Button
                                onClick={() => {
                                    controlsRef.current.reloadOnce();
                                }}
                                style={{ color: appTheme.ForegroundColor }}
                                title="Reload Test"
                            >
                                <RefreshIcon />
                            </Button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <Alert
                                key="0"
                                className={commonClasses.Notification}
                                sx={{
                                    backgroundColor: appTheme.Indigo,
                                    color: appTheme.ForegroundColor,

                                    "& .MuiAlert-message": {
                                        flex: "auto",
                                    },
                                }}
                                severity="info"
                            >
                                <AlertTitle className={commonClasses.NotificationTitle}>Performance Results</AlertTitle>
                                {timeSpans.map((ts, index) => (
                                    <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                                        <p>{ts.title}</p>
                                        <p>{ts.durationMs.toFixed(0)} ms</p>
                                    </div>
                                ))}
                            </Alert>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
