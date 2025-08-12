import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StyleAnimation() {
    const [preset, setPreset] = React.useState<number>(0);
    const [controls, setControls] = React.useState({ animateChartStyle: (state: boolean) => {} });

    const handleToggleButtonChanged = (event: any, value: number) => {
        if (value === null) return;
        setPreset(value);
        const isStyle1 = value === 0;
        controls.animateChartStyle(isStyle1);
    };

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <ToggleButtonGroup
                    exclusive
                    value={preset}
                    onChange={handleToggleButtonChanged}
                    size="medium"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                        Animate Styles 1
                    </ToggleButton>
                    <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                        Animate Styles 2
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <SciChartReact
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
                initChart={drawExample}
            />
        </div>
    );
}
