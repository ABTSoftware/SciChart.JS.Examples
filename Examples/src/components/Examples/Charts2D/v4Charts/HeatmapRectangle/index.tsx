import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useRef, useState } from "react";

export default function ChartComponent() {
    const [isGradient, setIsGradient] = useState(true);
    const setChartFunc = useRef(null);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Heatmap colors">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={isGradient}
                        onClick={() => {
                            setIsGradient(true);
                            setChartFunc.current(true);
                        }}
                    >
                        Gradient colors
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={!isGradient}
                        onClick={() => {
                            setIsGradient(false);
                            setChartFunc.current(false);
                        }}
                    >
                        Solid colors
                    </button>
                </div>
            </header>
            <SciChartReact
                initChart={drawExample}
                className="sc-chart-wrapper"
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "setChart" function that is returned by "drawExample"
                    let { setChart } = initResult;

                    // assign function to ref so we can call it later
                    setChartFunc.current = setChart;
                }}
            />
        </div>
    );
}
