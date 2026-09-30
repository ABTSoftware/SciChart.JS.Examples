import * as React from "react";

import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [isStaticAxis, setIsStaticAxis] = React.useState(false);

    const controlsRef = React.useRef<{ toggleStaticAxis: () => void }>(undefined);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <span style={{ color: appTheme.ForegroundColor, alignSelf: "center" }}>Primary Axis: </span>
                <div className="sc-button-group" role="group" aria-label="small outlined button group">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={isStaticAxis}
                        onClick={() => {
                            if (!isStaticAxis) controlsRef.current.toggleStaticAxis();
                            setIsStaticAxis(true);
                        }}
                    >
                        Normal Axis
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
                        Static Axis
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
