import * as React from "react";
import { SciChartSurface, StackedMountainCollection } from "scichart";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedMountainChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);
    const stackedMountainCollectionRef = React.useRef<StackedMountainCollection>(undefined);
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            stackedMountainCollectionRef.current.isOneHundredPercent = value;
            sciChartSurfaceRef.current.zoomExtents(200);
        }
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <label className="sc-switch">
                    <input
                        type="checkbox"
                        checked={use100PercentStackedMode}
                        onChange={(event) => handleUsePercentage(event, event.currentTarget.checked)}
                    />
                    100% Mode
                </label>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface, stackedMountainCollection } = initResult;
                    stackedMountainCollectionRef.current = stackedMountainCollection;
                    sciChartSurfaceRef.current = sciChartSurface;
                }}
            />
        </div>
    );
}
