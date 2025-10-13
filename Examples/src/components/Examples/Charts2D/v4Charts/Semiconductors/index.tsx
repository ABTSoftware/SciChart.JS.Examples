import { useEffect, useState, useRef } from "react";
import { generateWaferLotData, WaferLotData } from "./waferData";
import { SciChartReact } from "scichart-react";
import { drawLineChart } from "./lineChart";
import { drawColumnChart } from "./columnChart";
import { drawScatterChart } from "./scatterChart";
import { drawWaferChart } from "./waferChart";
import { drawPlot } from "./plot";
import { drawPareoChart } from "./pareoChart";

import "./styles.css";

export default function Overview() {
    const [data, setData] = useState<WaferLotData[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<WaferLotData | null>(null);
    const [selectedWafer, setSelectedWafer] = useState<number>(0);
    const lineChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const columnChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const pareoChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const scatterChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const plotChartRef = useRef<{ sciChartSurface: any; wasmContext: any; generateSubcharts: any } | null>(null);
    const waferChartRef = useRef<{ sciChartSurface: any; wasmContext: any; setDataIndex: any } | null>(null);

    const resetToInitialState = () => {
        // Simply reset the state - this will trigger re-rendering
        // and the charts will naturally return to their initial state
        setSelectedPoint(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Generate data
            let data = generateWaferLotData(15, new Date(2023, 0, 1));
            setData(data);
        };

        fetchData();
    }, []);

    const handleLineChartInit = (chartInstance: any) => {
        lineChartRef.current = chartInstance;
    };

    const handleColumnChartInit = (chartInstance: any) => {
        columnChartRef.current = chartInstance;
    };

    const handlePareoChartInit = (chartInstance: any) => {
        pareoChartRef.current = chartInstance;
    };

    const handleScatterChartInit = (chartInstance: any) => {
        scatterChartRef.current = chartInstance;
    };

    const handleWaferChartInit = (chartInstance: any) => {
        waferChartRef.current = chartInstance;
    };

    const handlePlotChartInit = (chartInstance: any) => {
        plotChartRef.current = chartInstance;
    };

    // Handler for when a point is selected in the line chart
    const handlePointSelected = (point: WaferLotData, index: number) => {
        setSelectedPoint(point);
    };

    // Handler for when a wafer is selected in the plot chart
    const handleWaferSelected = (waferIndex: number) => {
        setSelectedWafer(waferIndex);
    };

    // Custom init functions that pass data to chart drawing functions
    const initLineChart = async (rootElement: string | HTMLDivElement) => {
        return drawLineChart(rootElement, data, handlePointSelected);
    };

    const initColumnChart = async (rootElement: string | HTMLDivElement) => {
        return drawColumnChart(rootElement, data);
    };

    const initPareoChart = async (rootElement: string | HTMLDivElement) => {
        return drawPareoChart(rootElement, data);
    };

    const initScatterChart = async (rootElement: string | HTMLDivElement) => {
        return drawScatterChart(rootElement, data);
    };

    const initWaferChart = async (rootElement: string | HTMLDivElement) => {
        return drawWaferChart(rootElement, selectedPoint);
    };

    const initPlotChart = async (rootElement: string | HTMLDivElement) => {
        if (selectedPoint) {
            return drawPlot(rootElement, selectedPoint, handleWaferSelected); // Pass selectedPoint and wafer selection callback
        }
        return null;
    };

    // Re-render charts when data changes
    useEffect(() => {
        if (data.length > 0 && selectedPoint) {
            // Use setTimeout to ensure charts are fully initialized
            setTimeout(() => {
                try {
                    if (plotChartRef.current?.generateSubcharts && !plotChartRef.current.sciChartSurface?.isDisposed) {
                        plotChartRef.current.generateSubcharts(selectedPoint);
                        setSelectedWafer(0);
                    }
                } catch (error) {
                    console.warn("Could not update plot chart:", error);
                }
            }, 100);
        }
    }, [data, selectedPoint]);

    useEffect(() => {
        //setDataIndex
        setTimeout(() => {
            if (data.length && selectedPoint) {
                waferChartRef.current.setDataIndex(selectedPoint, selectedWafer);
            }
        }, 100);
    }, [selectedWafer, selectedPoint]);

    return data.length ? (
        <div className="dashboard-container">
            {selectedPoint ? (
                <button
                    className="reset-button"
                    onClick={resetToInitialState}
                    aria-label="Reset dashboard to initial state"
                    type="button"
                >
                    Back to main screen
                </button>
            ) : null}

            <div className="dashboard-layout">
                {/* Line Chart - Input1 over time */}
                <div className="line-chart-container">
                    {/* <h3>Input Temperature Over Time</h3> */}
                    <SciChartReact initChart={initLineChart} className="sci-chart" onInit={handleLineChartInit} />
                </div>

                {/* Row for Column and Scatter Charts side by side */}
                <div className="charts-row">
                    {/* Column Chart - Measure1 (thickness) over time */}
                    <div className="column-chart-container">
                        {/* <h3>Film Thickness Over Time</h3> */}
                        <div className="chart-wrapper">
                            {selectedPoint ? (
                                <SciChartReact
                                    key="plotChart"
                                    initChart={initPlotChart}
                                    className="sci-chart"
                                    onInit={handlePlotChartInit}
                                />
                            ) : (
                                <SciChartReact
                                    key="columnChart"
                                    initChart={initColumnChart}
                                    className="sci-chart"
                                    onInit={handleColumnChartInit}
                                />
                            )}
                        </div>
                    </div>

                    {/* Scatter Chart or Wafer Chart based on selection */}
                    <div className="scatter-wafer-container">
                        <div className="chart-wrapper">
                            {selectedPoint ? (
                                <SciChartReact
                                    key="waferChart"
                                    initChart={initWaferChart}
                                    className="sci-chart"
                                    onInit={handleWaferChartInit}
                                />
                            ) : (
                                <SciChartReact
                                    key="columnChart"
                                    initChart={initPareoChart}
                                    className="sci-chart"
                                    onInit={handlePareoChartInit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
