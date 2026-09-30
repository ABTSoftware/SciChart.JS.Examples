import React, { useState, useRef, useEffect } from "react";
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
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />

            {/* Compact floating controls positioned at bottom-right */}
            <div
                className="sc-control-row"
                style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    padding: "4px 8px",
                    backgroundColor: "rgba(30, 30, 30, 0.95)",
                    border: "1px solid #444",
                    borderRadius: 4,
                    fontSize: 12,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                    maxWidth: "calc(100% - 16px)",
                    zIndex: 1000,
                }}
            >
                <button
                    type="button"
                    onClick={addSubChart}
                    title="Add SubChart"
                    className="sc-button sc-button-primary"
                >
                    Add Chart
                </button>

                <button
                    type="button"
                    onClick={() => removeSubChart(subCharts[subCharts.length - 1]?.id)}
                    disabled={subCharts.length === 0}
                    title="Remove Last SubChart"
                    className="sc-button sc-button-danger"
                >
                    Remove Chart
                </button>

                <span>{subCharts.length}</span>

                <div className="sc-control-row">
                    {subCharts.map((config, index) => (
                        <input
                            key={config.id}
                            type="color"
                            value={config.color}
                            onChange={(e) => updateSubChart(config.id, { color: e.target.value })}
                            style={{
                                width: "14px",
                                height: "14px",
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                padding: "0",
                            }}
                            title={`Change color for ${config.title}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
