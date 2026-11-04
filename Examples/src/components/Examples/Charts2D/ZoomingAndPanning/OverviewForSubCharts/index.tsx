import { useState, useRef, useEffect } from "react";
import { SciChartSurface } from "scichart";
import { drawExample, SubChartManager, SubChartConfig } from "./drawExample";
import { appTheme } from "../../../theme";

const colorsArr = [
    appTheme.MutedBlue,
    appTheme.MutedOrange,
    appTheme.MutedPink,
    appTheme.MutedPurple,
    appTheme.MutedRed,
    appTheme.MutedSkyBlue,
    appTheme.MutedTeal,
];

export default function OverviewForSubCharts() {
    const [subCharts, setSubCharts] = useState<SubChartConfig[]>([
        { id: "subchart-0", phase: 0, color: appTheme.MutedBlue, title: "Pane 1" },
        { id: "subchart-1", phase: 0.7, color: appTheme.MutedOrange, title: "Pane 2" },
        { id: "subchart-2", phase: 1.4, color: appTheme.MutedPink, title: "Pane 3" },
        { id: "subchart-3", phase: 2.1, color: appTheme.MutedPurple, title: "Pane 4" },
    ]);

    const chartRef = useRef<HTMLDivElement>(null);
    const sciChartSurfaceRef = useRef<SciChartSurface | null>(null);
    const managerRef = useRef<SubChartManager | null>(null);

    useEffect(() => {
        const initChart = async () => {
            if (chartRef.current) {
                const { sciChartSurface, manager } = await drawExample(chartRef.current, subCharts);
                sciChartSurfaceRef.current = sciChartSurface;
                managerRef.current = manager;
            }
        };

        initChart();

        return () => {
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
            }
        };
    }, []);

    // Update subcharts when state changes
    useEffect(() => {
        if (managerRef.current) {
            managerRef.current.updateSubCharts(subCharts);
        }
    }, [subCharts]);

    const createSubChartConfig = (index: number): SubChartConfig => ({
        id: `subchart-${Date.now()}-${index}`,
        phase: Math.random() * 3,
        color: colorsArr[index % colorsArr.length],
        title: `Pane ${index + 1}`,
    });

    const addSubChart = () => {
        const newConfig = createSubChartConfig(subCharts.length);
        setSubCharts((prev) => [...prev, newConfig]);
    };

    const removeSubChart = (id: string) => {
        setSubCharts((prev) => prev.filter((config) => config.id !== id));
    };

    const updateSubChart = (id: string, updates: Partial<SubChartConfig>) => {
        setSubCharts((prev) => prev.map((config) => (config.id === id ? { ...config, ...updates } : config)));
    };

    return (
        <div className="sc-chart-wrapper flex flex-col">
            <header className="sc-toolbar-row">
                <div className="flex flex-wrap items-center gap-2">
                    {subCharts.map((config) => (
                        <input
                            key={config.id}
                            type="color"
                            value={config.color}
                            onChange={(e) => updateSubChart(config.id, { color: e.target.value })}
                            className="sc-input"
                            aria-label={`Change color for ${config.title}`}
                            title={`Change color for ${config.title}`}
                        />
                    ))}
                </div>

                <button className="sc-button ml-auto" type="button" onClick={addSubChart} title="Add SubChart">
                    Add Chart
                </button>

                <button
                    className="sc-button sc-button-danger"
                    type="button"
                    onClick={() => removeSubChart(subCharts[subCharts.length - 1]?.id)}
                    disabled={subCharts.length === 0}
                    title="Remove Last SubChart"
                >
                    Remove Chart
                </button>
            </header>
            <div ref={chartRef} className="w-full h-full" />
        </div>
    );
}
