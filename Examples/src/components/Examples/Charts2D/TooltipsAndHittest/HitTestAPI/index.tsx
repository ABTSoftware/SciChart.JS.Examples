import * as React from "react";
import { appTheme } from "../../../theme";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { HIT_TEST, HIT_TEST_DATAPOINT, HIT_TEST_X_SLICE, drawExample } from "./drawExample";

export default function ChartComponent() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [preset, setPreset] = React.useState<string>(HIT_TEST_DATAPOINT);

    const handlePreset = (event: any, value: string) => {
        // When user clicks a togglebutton, update state
        if (value) {
            console.log("ToggleButton changed " + value);
            setPreset(value);
            controlsRef.current.updateHitTestMethod(value);
        }
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Hit test mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === HIT_TEST_DATAPOINT}
                        onClick={(event) => handlePreset(event, HIT_TEST_DATAPOINT)}
                    >
                        Hit-Test Datapoint
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === HIT_TEST_X_SLICE}
                        onClick={(event) => handlePreset(event, HIT_TEST_X_SLICE)}
                    >
                        Hit-Test X-Slice
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === HIT_TEST}
                        onClick={(event) => handlePreset(event, HIT_TEST)}
                    >
                        Hit-Test Series Body
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
