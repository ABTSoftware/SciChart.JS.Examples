import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { makeStyles } from "@mui/styles";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";

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
export default function FeatureAxisTypes() {
    const [controls, setControls] = useState<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [preset, setPreset] = useState<number>(0);

    const handlePreset = (event: any, value: number) => {
        setPreset(value);
        switch (value) {
            case 0:
                controls.updateLabelProvider(0, 9);
                break;
            case 1:
                controls.updateLabelProvider(20, 0);
                break;
            case 2:
                controls.updateLabelProvider(30, 12);
                break;
            default:
                controls.updateLabelProvider(0, 9);
                break;
        }
    };

    const localClasses = useStyles();

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <ToggleButtonGroup
                        exclusive
                        value={preset}
                        onChange={handlePreset}
                        size="medium"
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                            Multi-Line
                        </ToggleButton>
                        <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                            Single Line Rotated
                        </ToggleButton>
                        <ToggleButton value={2} style={{ color: appTheme.ForegroundColor }}>
                            Multi-Line Rotated
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <SciChartReact
                    className={localClasses.chartArea}
                    initChart={drawExample}
                    onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        setControls(controls);
                    }}
                />
            </div>
        </div>
    );
}
