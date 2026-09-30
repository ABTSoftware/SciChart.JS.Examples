import * as React from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

export default function PercentageChange() {
    const [usePercentage, setUsePercentage] = React.useState(true);
    const [chartKey, setChartKey] = React.useState(0);
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);

    const handleUsePercentage = (event: React.MouseEvent<HTMLElement>, newValue: boolean) => {
        if (newValue !== null) {
            setUsePercentage(newValue);
            // Force reinitialization of the chart by updating the key
            setChartKey((prevKey) => prevKey + 1);
        }
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Data display mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={usePercentage === true}
                        onClick={(event) => handleUsePercentage(event, true)}
                    >
                        Percentage Change
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={usePercentage === false}
                        onClick={(event) => handleUsePercentage(event, false)}
                    >
                        Original Data
                    </button>
                </div>
            </header>
            {/* // Usage in SciChartReact */}
            <SciChartReact
                key={chartKey} // Change the key to force re-render
                initChart={(rootElement) => drawExample(rootElement, usePercentage)}
                className="sc-chart-wrapper"
            />
        </div>
    );
}
