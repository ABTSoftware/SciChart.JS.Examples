import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function SmoothStackedMountainChart() {
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            controlsRef.current.toggleHundredPercentMode(value);
        }
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Stacked chart mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={!use100PercentStackedMode}
                        onClick={(event) => handleUsePercentage(event, false)}
                    >
                        Stacked mode
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={use100PercentStackedMode}
                        onClick={(event) => handleUsePercentage(event, true)}
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
