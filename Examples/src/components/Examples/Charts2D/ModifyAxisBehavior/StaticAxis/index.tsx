import * as React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { makeStyles } from "tss-react/mui";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { Typography } from "@mui/material";

const useStyles = makeStyles()(() => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    toolbarRow: {
        display: "flex",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        alignItems: "center",
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [isStaticAxis, setIsStaticAxis] = React.useState(false);

    const controlsRef = React.useRef<{ toggleStaticAxis: () => void }>();

    const { classes } = useStyles();
    return (
        <>
            <div className={commonClasses.ChartWrapper}>
                <div className={classes.flexOuterContainer}>
                    <div className={classes.toolbarRow}>
                        <Typography style={{ color: appTheme.ForegroundColor }}>Primary Axis: </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={isStaticAxis ? 1 : 0}
                            onChange={() => {
                                controlsRef.current.toggleStaticAxis();
                                setIsStaticAxis(!isStaticAxis);
                            }}
                            size="medium"
                            color="primary"
                            aria-label="small outlined button group"
                        >
                            <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                                Normal Axis
                            </ToggleButton>
                            <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                                Static Axis
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    <SciChartReact
                        className={classes.chartArea}
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
