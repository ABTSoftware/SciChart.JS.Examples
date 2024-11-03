import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import * as React from "react";
import { makeStyles } from "@mui/styles";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, TTimeSpan } from "./drawExample";

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

export default function Load1MillionPointsChart() {
    const [timeSpans, setTimeSpans] = React.useState<TTimeSpan[]>([]);
    const [controls, setControls] = React.useState<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const updateTimeSpans = (newTimeSpans: TTimeSpan[]) => {
        setTimeSpans([...newTimeSpans]);
    };

    const classes = useStyles();

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <SciChartReact
                    className={classes.chartArea}
                    initChart={drawExample}
                    onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        setControls(controls);
                        const autoStartTimerId = setTimeout(() => controls.loadPoints(updateTimeSpans), 0);

                        return () => {
                            clearTimeout(autoStartTimerId);
                        };
                    }}
                />
                <div className={classes.toolbarRow} style={{ minHeight: "140px" }}>
                    <Button
                        id="loadPoints"
                        onClick={() => {
                            controls.loadPoints(updateTimeSpans);
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
