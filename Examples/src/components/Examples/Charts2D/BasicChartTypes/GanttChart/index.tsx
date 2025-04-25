import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, EGanttChartTypeBaseSeries } from "./drawExample";
import { useState } from "react";
import { EPolarLabelMode } from "scichart";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [preset, setPreset] = useState<EGanttChartTypeBaseSeries>(EGanttChartTypeBaseSeries.rectangle);

    const [controls, setControls] = useState({ 
        changeSeriesType: (type: EGanttChartTypeBaseSeries) => {}
    })

    const handleToggleButtonChanged = (event: any, value: EGanttChartTypeBaseSeries) => {
        if (value === null) return;
        setPreset(value);
        controls.changeSeriesType(value);
    };

    return (
        <div className={commonClasses.ChartWrapper}>
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: appTheme.DarkIndigo,
            }}>
                <div className={commonClasses.ToolbarRow}>
                    <ToggleButtonGroup
                        exclusive
                        value={preset}
                        onChange={handleToggleButtonChanged}
                        size="medium"
                        color="primary"
                        aria-label="small outlined button group"
                    >   
                        {Object.values(EGanttChartTypeBaseSeries).map((key) => (
                            <ToggleButton 
                                key={key} 
                                value={key} 
                                style={{ color: appTheme.ForegroundColor }}
                            >
                                {key}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
                <SciChartReact
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        setControls(initResult.controls);
                    }}
                    initChart={drawExample}
                    style={{ flex: 1 }}
                />
            </div>
        </div>
    )
}
