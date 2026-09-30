import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";
import { EPolarLabelMode } from "scichart";

import { appTheme } from "../../../theme";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [preset, setPreset] = useState<EPolarLabelMode>(EPolarLabelMode.Horizontal);
    const [isInnerAxis, setIsInnerAxis] = useState<boolean>(false);

    const [controls, setControls] = useState({
        changePolarLabelMode: (newMode: EPolarLabelMode) => {},
        toggleIsInnerAxis: (isInnerAxis: boolean) => {},
    });

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
        <div className="sc-chart-wrapper" style={{ background: appTheme.DarkIndigo }}>
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="small outlined button group">
                    {Object.keys(EPolarLabelMode).map((key) => (
                        <button
                            type="button"
                            className="sc-button"
                            aria-pressed={preset === key}
                            key={key}
                            onClick={(event) => handleToggleButtonChanged(event, key as EPolarLabelMode)}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <button className="sc-button" onClick={() => handleToggleIsInnerAxis()} type="button">
                    <strong>isInnerAxis</strong>: {isInnerAxis ? "true" : "false"}
                </button>
            </header>
            <SciChartReact
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
                initChart={drawExample}
            />
        </div>
    );
}
