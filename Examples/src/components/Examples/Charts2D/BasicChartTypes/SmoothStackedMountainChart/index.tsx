import { useState, useRef } from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function SmoothStackedMountainChart() {
    const [use100PercentStackedMode, setUse100PercentStackedMode] = useState(false);
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const handleUsePercentage = (value: boolean) => {
        console.log(`100% stacked? ${value}`);
        setUse100PercentStackedMode(value);
        controlsRef.current.toggleHundredPercentMode(value);
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Stacked chart mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={!use100PercentStackedMode}
                        onClick={() => handleUsePercentage(false)}
                    >
                        Stacked mode
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={use100PercentStackedMode}
                        onClick={() => handleUsePercentage(true)}
                    >
                        100% Stacked mode
                    </button>
                </div>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = initResult.controls;
                }}
            />
        </div>
    );
}
