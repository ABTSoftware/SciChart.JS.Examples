import * as React from "react";
import { useState } from "react";
import { EColumnDataLabelPosition } from "scichart";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedColumnChart() {
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);
    const [controls, setControls] = useState<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [areDataLabelsVisible, setAreDataLabelsVisible] = React.useState(true);
    const [dataLabelPosition, setDataLabelPosition] = React.useState(EColumnDataLabelPosition.Center);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null && controls) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            controls.toggleHundredPercentMode(value);
        }
    };

    const handleToggleDataLabels = () => {
        const visible = !areDataLabelsVisible;
        setAreDataLabelsVisible(visible);
        controls?.toggleDataLabels(visible);
    };

    const handleDataLabelPositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const position = event.currentTarget.value as EColumnDataLabelPosition;
        setDataLabelPosition(position);
        controls?.setDataLabelPosition(position);
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
                    <span>100% Mode</span>
                </label>

                <label className="sc-control">
                    <span>Label position</span>
                    <select className="sc-select" value={dataLabelPosition} onChange={handleDataLabelPositionChange}>
                        {Object.values(EColumnDataLabelPosition)
                            .filter((p) => p !== EColumnDataLabelPosition.Position)
                            .map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                    </select>
                </label>

                <label className="sc-switch">
                    <input type="checkbox" checked={areDataLabelsVisible} onChange={handleToggleDataLabels} />
                    Show Data Labels
                </label>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
            />
        </div>
    );
}
