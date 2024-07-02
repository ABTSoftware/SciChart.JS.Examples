import * as React from "react";
import { Button } from "@material-ui/core";
import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

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

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [isStaticAxis, setIsStaticAxis] = React.useState(true);

    const controlsRef = React.useRef<{toggleStaticAxis: () => void;}>();

    const localClasses = useStyles();
    return (
    <>
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <Button 
                        onClick={() => {
                            controlsRef.current.toggleStaticAxis()
                            setIsStaticAxis(!isStaticAxis)
                        }}
                        style={{ color: appTheme.ForegroundColor }}
                    >
                        IsStaticAxis: {isStaticAxis ? "true" : "false"}
                    </Button>
                </div>

                <SciChartReact
                    className={localClasses.chartArea}
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = initResult.controls;
                    }}
                />
            </div>
        </div>
    </>
    );
}
