import { useState, useRef, useEffect } from "react";

import { SciChartReact } from "scichart-react";
import { drawExample, TFilterMode } from "./drawExample";

const FILTER_LABELS: Array<{ mode: TFilterMode; label: string }> = [
    { mode: "source", label: "Default (no filter)" },
    { mode: "heikinAshi", label: "Heikin-Ashi" },
    { mode: "renko", label: "Renko" },
    { mode: "pointAndFigure", label: "Point & Figure" },
];

export default function FinancialDataFilters() {
    const [filterMode, setFilterMode] = useState<TFilterMode>("source");
    const chartApiRef = useRef<Awaited<ReturnType<typeof drawExample>> | undefined>(undefined);

    useEffect(() => {
        chartApiRef.current?.setFilterMode(filterMode);
    }, [filterMode]);

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group">
                    {FILTER_LABELS.map(({ mode, label }) => (
                        <button
                            className="sc-button"
                            type="button"
                            key={mode}
                            aria-pressed={filterMode === mode}
                            onClick={() => setFilterMode(mode)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </header>

            <SciChartReact
                className="w-full h-full"
                initChart={async (rootElement) => {
                    const chartApi = await drawExample(rootElement);
                    chartApiRef.current = chartApi;
                    chartApi.setFilterMode(filterMode);
                    return chartApi;
                }}
            />
        </div>
    );
}
