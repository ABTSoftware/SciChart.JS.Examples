import React, { useState, useRef, useEffect } from "react";
import { SciChartSurface } from "scichart";
import commonClasses from "../../../styles/Examples.module.scss";
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
        <div className={commonClasses.ChartWithNestedToolbar} style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />

            {/* Compact floating controls positioned at bottom-right */}
            <div
                style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    padding: "4px 8px",
                    backgroundColor: "rgba(30, 30, 30, 0.95)",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                    maxWidth: "calc(100% - 16px)",
                    flexWrap: "wrap",
                    zIndex: 1000,
                    pointerEvents: "auto",
                }}
            >
                <button
                    onClick={addSubChart}
                    style={{
                        padding: "3px 8px",
                        backgroundColor: "#007acc",
                        color: "white",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                        fontSize: "11px",
                        minWidth: "auto",
                    }}
                    title="Add SubChart"
                >
                    Add Chart
                </button>

                <button
                    onClick={() => removeSubChart(subCharts[subCharts.length - 1]?.id)}
                    disabled={subCharts.length === 0}
                    style={{
                        padding: "3px 8px",
                        backgroundColor: subCharts.length === 0 ? "#666" : "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "2px",
                        cursor: subCharts.length === 0 ? "not-allowed" : "pointer",
                        fontSize: "11px",
                        minWidth: "auto",
                    }}
                    title="Remove Last SubChart"
                >
                    Remove Chart
                </button>

                <span style={{ color: "#ccc", fontSize: "11px", margin: "0 4px" }}>
                    {subCharts.length}
                </span>

                <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
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
