import { useState } from "react";
import { SciChartReact } from "scichart-react";
import { drawExample } from "./drawExample";

export default function PercentageChange() {
    const [usePercentage, setUsePercentage] = useState(true);
    const [chartKey, setChartKey] = useState(0);

    const handleUsePercentage = (newValue: boolean) => {
        setUsePercentage(newValue);
        // Force reinitialization of the chart by updating the key
        setChartKey((prevKey) => prevKey + 1);
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Data display mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={usePercentage === true}
                        onClick={() => handleUsePercentage(true)}
                    >
                        Percentage Change
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={usePercentage === false}
                        onClick={() => handleUsePercentage(false)}
                    >
                        Original Data
                    </button>
                </div>
            </header>
            <SciChartReact
                key={chartKey} // Change the key to force re-render
                initChart={(rootElement) => drawExample(rootElement, usePercentage)}
                className="sc-chart-wrapper"
            />
        </div>
    );
}
