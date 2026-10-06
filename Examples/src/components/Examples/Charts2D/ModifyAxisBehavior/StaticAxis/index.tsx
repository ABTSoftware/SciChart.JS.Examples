import { useState, useRef } from "react";

import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
export default function ChartComponent() {
    const [isStaticAxis, setIsStaticAxis] = useState(false);

    const controlsRef = useRef<{ toggleStaticAxis: () => void }>(undefined);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div
                    className="sc-button-group"
                    role="group"
                    aria-label="Primary X Axis mode"
                >
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={isStaticAxis}
                        onClick={() => {
                            if (!isStaticAxis) controlsRef.current.toggleStaticAxis();
                            setIsStaticAxis(true);
                        }}
                    >
                        Normal Primary X Axis
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={!isStaticAxis}
                        onClick={() => {
                            if (isStaticAxis) controlsRef.current.toggleStaticAxis();
                            setIsStaticAxis(false);
                        }}
                    >
                        Static Primary X Axis
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
