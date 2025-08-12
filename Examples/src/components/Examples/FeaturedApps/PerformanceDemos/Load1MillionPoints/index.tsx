import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, TTimeSpan } from "./drawExample";
import { useRef, useState } from "react";

export default function Load1MillionPointsChart() {
    const [timeSpans, setTimeSpans] = useState<TTimeSpan[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(null);

    const updateTimeSpans = (newTimeSpans: TTimeSpan[]) => {
        setTimeSpans([...newTimeSpans]);
    };

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                    controls.subscribeToInfo(updateTimeSpans);
                    controls.startUpdate();
                    setIsStarted(true);

                    return controls.stopUpdate;
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
                    {timeSpans.length > 0 && (
                        <Alert
                            key="0"
                            className={commonClasses.Notification}
                            sx={{
                                backgroundColor: appTheme.Indigo,
                                color: appTheme.ForegroundColor,
                                textAlign: "left",
                            }}
                            severity="info"
                        >
                            <AlertTitle className={commonClasses.NotificationTitle}>Performance Results</AlertTitle>
                            {timeSpans.map((ts, index) => (
                                <div key={index}>
                                    {ts.title}: {ts.durationMs.toFixed(0)} ms
                                </div>
                            ))}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
