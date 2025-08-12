import * as React from "react";
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import Switch from "@mui/material/Switch";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

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

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                {/* <ToggleButtonGroup
                        className={commonClasses.ToggleButtonGroup}
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

                    <ToggleButtonGroup style={{ marginLeft: "auto" }} className={commonClasses.ToolbarRow} size="small">
                        <ToggleButton
                            value={areDataLabelsVisible}
                            style={{ color: appTheme.ForegroundColor }}
                            onClick={handleToggleDataLabels}
                        >
                            {areDataLabelsVisible ? "Hide" : "Show"}&nbsp;Data&nbsp;Labels
                        </ToggleButton>
                    </ToggleButtonGroup> */}
                <FormControlLabel
                    control={<Switch checked={use100PercentStackedMode} onChange={handleUsePercentage} />}
                    label="100%&nbsp;Mode"
                    style={{ margin: 0, padding: "1em" }}
                />
                <ToggleButton value={areDataLabelsVisible} onClick={handleToggleDataLabels}>
                    {areDataLabelsVisible ? "Hide" : "Show"}&nbsp;Data&nbsp;Labels
                </ToggleButton>
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
            />
        </div>
    );
}
