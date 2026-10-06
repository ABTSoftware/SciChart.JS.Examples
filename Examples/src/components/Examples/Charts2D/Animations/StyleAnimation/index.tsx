import { useState } from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function StyleAnimation() {
    const [preset, setPreset] = useState<number>(0);
    const [controls, setControls] = useState({ animateChartStyle: (state: boolean) => {} });

    const handleToggleButtonChanged = (value: number) => {
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
                        onClick={() => handleToggleButtonChanged(0)}
                    >
                        Animation Style 1
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={() => handleToggleButtonChanged(1)}
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
