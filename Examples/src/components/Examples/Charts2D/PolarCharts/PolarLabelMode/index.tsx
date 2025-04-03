import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useState } from "react";
import { EPolarLabelMode } from "scichart";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { appTheme } from "../../../theme";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [preset, setPreset] = useState<EPolarLabelMode>(EPolarLabelMode.Horizontal);
    const [isInnerAxis, setIsInnerAxis] = useState<boolean>(false);

    const [controls, setControls] = useState({ 
        changePolarLabelMode: (newMode: EPolarLabelMode) => {},
        toggleIsInnerAxis: (isInnerAxis: boolean) => {},
    })

    const handleToggleButtonChanged = (event: any, value: EPolarLabelMode) => {
        if (value === null) return;
        setPreset(value);
        controls.changePolarLabelMode(value);
    };

    const handleToggleIsInnerAxis = () => {
        setIsInnerAxis(!isInnerAxis);
        controls.toggleIsInnerAxis(!isInnerAxis);
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
                        {Object.keys(EPolarLabelMode).map((key) => (
                            <ToggleButton 
                                key={key} 
                                value={key} 
                                style={{ color: appTheme.ForegroundColor }}
                            >
                                {key}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleToggleIsInnerAxis()}
                        style={{ marginLeft: "auto" }}
                    >
                        <strong>isInnerAxis</strong>: {isInnerAxis ? "true" : "false"}
                    </Button>
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
