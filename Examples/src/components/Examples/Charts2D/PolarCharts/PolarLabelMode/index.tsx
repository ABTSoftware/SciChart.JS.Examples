import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";
import { EPolarLabelMode } from "scichart";

export default function ChartComponent() {
    const [preset, setPreset] = useState<EPolarLabelMode>(EPolarLabelMode.Horizontal);
    const [isInnerAxis, setIsInnerAxis] = useState<boolean>(false);

    const [controls, setControls] = useState({
        changePolarLabelMode: (newMode: EPolarLabelMode) => {},
        toggleIsInnerAxis: (isInnerAxis: boolean) => {},
    });

    const handleToggleButtonChanged = (value: EPolarLabelMode) => {
        if (value === null) return;
        setPreset(value);
        controls.changePolarLabelMode(value);
    };

    const handleToggleIsInnerAxis = () => {
        setIsInnerAxis(!isInnerAxis);
        controls.toggleIsInnerAxis(!isInnerAxis);
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Polar label mode">
                    {Object.keys(EPolarLabelMode).map((key) => (
                        <button
                            type="button"
                            className="sc-button"
                            aria-pressed={preset === key}
                            key={key}
                            onClick={() => handleToggleButtonChanged(key as EPolarLabelMode)}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <label className="sc-switch">
                    <input type="checkbox" role="switch" checked={isInnerAxis} onChange={handleToggleIsInnerAxis} />
                    Inner axis
                </label>
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
