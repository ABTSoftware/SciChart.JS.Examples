import * as React from "react";
import { useState } from "react";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { drawExample } from "./drawExample";
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
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedColumnChart() {
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);
    const [controls, setControls] = useState<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null && controls) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            controls.toggleHundredPercentMode(value);
        }
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
                    exclusive
                    value={use100PercentStackedMode}
                    onChange={handleUsePercentage}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton disabled={!controls} value={false} style={{ color: appTheme.ForegroundColor }}>
                        Stacked mode
                    </ToggleButton>
                    <ToggleButton disabled={!controls} value={true} style={{ color: appTheme.ForegroundColor }}>
                        100% Stacked mode
                    </ToggleButton>
                </ToggleButtonGroup>
                <SciChartReact
                    initChart={drawExample}
                    className={localClasses.chartArea}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        setControls(initResult.controls);
                    }}
                />
            </div>
        </div>
    );
}
