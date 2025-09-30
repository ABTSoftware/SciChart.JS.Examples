import { useEffect, useState, useRef } from "react";
import { generateWaferLotData, WaferLotData } from "./waferData";
import { SciChartReact } from "scichart-react";
import { SciChartSurface } from "scichart";
import { drawExample } from "./lineChart";
import { drawColumnChart } from "./columnChart";
import { drawScatterChart } from "./scatterChart";
import { drawWaferChart } from "./waferChart";
import { drawPlot } from "./plot";
import { appTheme } from "../../../theme";
import "./styles.css";

export default function Overview() {
    const [data, setData] = useState<WaferLotData[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<WaferLotData | null>(null);
    const lineChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const columnChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const scatterChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const plotChartRef = useRef<{ sciChartSurface: any; wasmContext: any; generateSubcharts: any } | null>(null);
    const waferChartRef = useRef<{ sciChartSurface: any; wasmContext: any; setData: any } | null>(null);

    const resetToInitialState = () => {
        // Simply reset the state - this will trigger re-rendering
        // and the charts will naturally return to their initial state
        setSelectedPoint(null);

        // Optionally regenerate data to ensure fresh state
        const freshData = generateWaferLotData(15, new Date(2023, 0, 1));
        setData(freshData);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Generate 30 days of data for a better visualization
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

    // Custom init functions that pass data to chart drawing functions
    const initLineChart = async (rootElement: string | HTMLDivElement) => {
        return drawExample(rootElement, data, handlePointSelected);
    };

    const initColumnChart = async (rootElement: string | HTMLDivElement) => {
        return drawColumnChart(rootElement, data);
    };

    const initScatterChart = async (rootElement: string | HTMLDivElement) => {
        return drawScatterChart(rootElement, data);
    };

    const initWaferChart = async (rootElement: string | HTMLDivElement) => {
        const pointData = {
            Date: "2023-01-09",
            Batch: 10,
            Quality: "Marginal",
            Input1: 1087,
            Input2: 294,
            Measure1: 98.78,
            Measure2: 53.03,
            Measure3: 9.84,
        } as WaferLotData;

        console.log(JSON.stringify(selectedPoint));

        return drawWaferChart(rootElement, pointData);

        // return null;
    };

    const initPlotChart = async (rootElement: string | HTMLDivElement) => {
        if (selectedPoint) {
            return drawPlot(rootElement, selectedPoint); // Pass selectedPoint instead of data
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
                    }
                } catch (error) {
                    console.warn("Could not update plot chart:", error);
                }
            }, 100);
        }
    }, [data, selectedPoint]);

    return data.length ? (
        <div className="dashboard-container">
            {selectedPoint ? (
                <button
                    className="reset-button"
                    onClick={resetToInitialState}
                    aria-label="Reset dashboard to initial state"
                    type="button"
                >
                    Return to initial state
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

                            {/* <SciChartReact
                                initChart={initColumnChart}
                                className="sci-chart"
                                onInit={handleColumnChartInit}
                            /> */}
                            {/* <SciChartReact
                                initChart={initPlotChart}
                                className="sci-chart"
                                onInit={handlePlotChartInit}
                            /> */}
                        </div>
                    </div>

                    {/* Scatter Chart or Wafer Chart based on selection */}
                    <div className="scatter-wafer-container">
                        <div className="chart-wrapper">
                            {!selectedPoint ? (
                                <SciChartReact
                                    key="waferChart"
                                    initChart={initWaferChart}
                                    className="sci-chart"
                                    onInit={handleWaferChartInit}
                                />
                            ) : (
                                <SciChartReact
                                    key="scatterChart"
                                    initChart={initScatterChart}
                                    className="sci-chart"
                                    onInit={handleScatterChartInit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
