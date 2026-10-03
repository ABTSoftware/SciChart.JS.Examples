import * as React from "react";
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
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Style animation">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 0}
                        onClick={(event) => handleToggleButtonChanged(event, 0)}
                    >
                        Animation Style 1
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={(event) => handleToggleButtonChanged(event, 1)}
                    >
                        Animation Style 2
                    </button>
                </div>
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
