import * as React from "react";
import { useRef } from "react";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { makeStyles } from "tss-react/mui";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, TTimeSpan } from "./drawExample";

const useStyles = makeStyles()((theme) => ({
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

export default function Load500By500() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(null);
    const [timeSpans, setTimeSpans] = React.useState<TTimeSpan[]>([]);

    const { classes } = useStyles();

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <SciChartReact
                    className={classes.chartArea}
                    initChart={(rootElement: string | HTMLDivElement) =>
                        drawExample(rootElement, (newTimeSpans: TTimeSpan[]) => {
                            setTimeSpans([...newTimeSpans]);
                        })
                    }
                    onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        controls.startUpdate();
                        controlsRef.current = controls;
                    }}
                    onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        controls.stopUpdate();
                    }}
                />
                <div className={classes.toolbarRow} style={{ minHeight: "140px" }}>
                    <Button
                        onClick={() => {
                            controlsRef.current?.startUpdate();
                        }}
                        style={{ color: appTheme.ForegroundColor }}
                    >
                        🗘 Reload Test
                    </Button>
                    <div style={{ width: "100%", marginLeft: "10px" }}>
                        {timeSpans.length > 0 && (
                            <Alert
                                key="0"
                                className={commonClasses.Notification}
                                style={{ backgroundColor: appTheme.Indigo, color: appTheme.ForegroundColor }}
                            >
                                <AlertTitle>Performance Results</AlertTitle>
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
        </div>
    );
}
