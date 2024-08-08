import * as React from "react";
import { useState } from "react";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
    const [areDataLabelsVisible, setAreDataLabelsVisible] = React.useState(true);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null && controls) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            controls.toggleHundredPercentMode(value);
        }
    };

    const handleToggleDataLabels = () => {
        setAreDataLabelsVisible(!areDataLabelsVisible);
        controls.toggleDataLabels(areDataLabelsVisible);
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <ToggleButtonGroup
                        className={localClasses.toolbarRow}
                        exclusive
                        size="small"
                        value={use100PercentStackedMode}
                        onChange={handleUsePercentage}
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                            Stacked&nbsp;mode
                        </ToggleButton>
                        <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                            100%&nbsp;Stacked&nbsp;mode
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup style={{ marginLeft: "auto" }} className={localClasses.toolbarRow} size="small">
                        <ToggleButton
                            value={areDataLabelsVisible}
                            style={{ color: appTheme.ForegroundColor }}
                            onClick={handleToggleDataLabels}
                        >
                            {areDataLabelsVisible ? "Hide" : "Show"}&nbsp;Data&nbsp;Labels
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
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
