import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
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

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <SciChartReact
                    className={localClasses.chartArea}
                    initChart={drawExample}
                    onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        setControls(controls);
                        const autoStartTimerId = setTimeout(() => controls.loadPoints(updateTimeSpans), 0);

                        return () => {
                            clearTimeout(autoStartTimerId);
                        };
                    }}
                />
                <div className={localClasses.toolbarRow} style={{ minHeight: "140px" }}>
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
                                className={classes.Notification}
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
