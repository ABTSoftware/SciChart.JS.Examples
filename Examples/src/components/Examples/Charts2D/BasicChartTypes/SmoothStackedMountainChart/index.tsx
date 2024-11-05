import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { makeStyles } from "tss-react/mui";
import { SciChartSurface, StackedMountainCollection } from "scichart";
import { drawExample } from "./drawExample";
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
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function SmoothStackedMountainChart() {
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>();

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            controlsRef.current.toggleHundredPercentMode(value);
        }
    };

    const { classes } = useStyles();
    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <ToggleButtonGroup
                    className={classes.toolbarRow}
                    exclusive
                    value={use100PercentStackedMode}
                    onChange={handleUsePercentage}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                        Stacked mode
                    </ToggleButton>
                    <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                        100% Stacked mode
                    </ToggleButton>
                </ToggleButtonGroup>
                <SciChartReact
                    className={classes.chartArea}
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = initResult.controls;
                    }}
                />
            </div>
        </div>
    );
}
