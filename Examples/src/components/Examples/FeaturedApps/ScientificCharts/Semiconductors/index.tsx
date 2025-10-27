import { useEffect, useState, useRef } from "react";
import { generateWaferLotData, WaferLotData, WaferDayData } from "./waferData";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawLineChart } from "./lineChart";
import { drawColumnChart } from "./columnChart";
import { drawWaferGrid } from "./waferGrid";
import { drawParetoChart } from "./paretoChart";

import "./styles.css";
import { DataPointSelectionModifier, SciChartSurface, DataPointInfo } from "scichart";

export default function Overview() {
    const [data, setData] = useState<WaferDayData[]>([]);
    const [selectedDay, setSelectedDay] = useState<WaferDayData | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<WaferLotData | null>(null);
    const [showColumnChart, setShowColumnChart] = useState<boolean>(false);
    const lineChartRef = useRef<{ sciChartSurface: SciChartSurface; wasmContext: any } | null>(null);
    const columnChartRef = useRef<{
        sciChartSurface: SciChartSurface;
        updateData: (batchData: WaferLotData[], fireSelectionChanged: boolean) => void;
        selectionModifier: DataPointSelectionModifier;
    } | null>(null);
    const paretoChartRef = useRef<{
        sciChartSurface: SciChartSurface;
        updateData: (batchData: WaferLotData[], fireSelectionChanged: boolean) => void;
        selectionModifier: DataPointSelectionModifier;
    } | null>(null);
    const waferChartRef = useRef<{
        sciChartSurface: SciChartSurface;
        generateSubcharts: (selectedPoint: WaferLotData) => void;
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Generate data
            let data = generateWaferLotData(15, 15, new Date(2023, 0, 1));
            setData(data);
            setSelectedDay(data[0]);
        };

        fetchData();
    }, []);

    const handleLineChartInit = (chartInstance: any) => {
        lineChartRef.current = chartInstance;
    };

    const handleColumnChartInit = (chartInstance: TResolvedReturnType<typeof drawColumnChart>) => {
        columnChartRef.current = chartInstance;
    };

    const handleParetoChartInit = (chartInstance: any) => {
        paretoChartRef.current = chartInstance;
    };

    const handleWaferChartInit = (chartInstance: TResolvedReturnType<typeof drawWaferGrid>) => {
        waferChartRef.current = chartInstance;
    };

    // Handler for when a point is selected in the line chart
    const handlePointSelected = (point: WaferDayData, index: number) => {
        point.Batches[0].isSelected = true;
        // Update both charts since they are both always rendered
        columnChartRef.current?.updateData(point.Batches, showColumnChart);
        paretoChartRef.current?.updateData(point.Batches, !showColumnChart);
    };

    // Handler for when a point is selected in the column or pareto chart chart
    const handleBatchSelected = (point: WaferLotData, isColumnChart: boolean) => {
        setSelectedBatch(point);
        if (isColumnChart) {
            //@ts-ignore
            paretoChartRef.current?.selectionModifier.clearSelectedDataPoints();
            // the pareto chart gets the selection from metadata, which is shared
        } else {
            //@ts-ignore
            columnChartRef.current?.selectionModifier.clearSelectedDataPoints();
            // The stacked column chart gets the selection from the selectionModifier, which is not shared, so we manually sync the selection
            const series = columnChartRef.current?.sciChartSurface.renderableSeries.get(0);
            const index = point.Batch - 1;
            //@ts-ignore
            columnChartRef.current?.selectionModifier.addSelectedDataPoint(
                series,
                index,
                new DataPointInfo(series, point, index)
            );
        }
        waferChartRef.current?.generateSubcharts(point);
    };

    // Custom init functions that pass data to chart drawing functions
    const initLineChart = async (rootElement: string | HTMLDivElement) => {
        return drawLineChart(rootElement, data, handlePointSelected);
    };

    const initColumnChart = async (rootElement: string | HTMLDivElement) => {
        return drawColumnChart(rootElement, data[0].Batches, handleBatchSelected);
    };

    const initParetoChart = async (rootElement: string | HTMLDivElement) => {
        return drawParetoChart(rootElement, data[0].Batches, handleBatchSelected);
    };

    const initWaferChart = async (rootElement: string | HTMLDivElement) => {
        if (selectedDay) {
            selectedDay.Batches[0].isSelected = true;
            return drawWaferGrid(rootElement, selectedDay.Batches[0]); // Pass selectedPoint which will be used to generate data
        }
        return null;
    };

    return data.length ? (
        <div className="dashboard-container">
            <div className="dashboard-layout">
                <div className="line-chart-container">
                    <SciChartReact initChart={initLineChart} className="sci-chart" onInit={handleLineChartInit} />
                </div>

                {/* Row for Column and Scatter Charts side by side */}
                <div className="charts-row">
                    <div className="column-chart-container">
                        <div className="chart-header">
                            <div className="chart-toggle-group">
                                <button
                                    className={`chart-toggle-button ${!showColumnChart ? "active" : ""}`}
                                    onClick={() => setShowColumnChart(false)}
                                >
                                    Pareto Chart
                                </button>
                                <button
                                    className={`chart-toggle-button ${showColumnChart ? "active" : ""}`}
                                    onClick={() => setShowColumnChart(true)}
                                >
                                    Column Chart
                                </button>
                            </div>
                        </div>
                        <div className="chart-wrapper">
                            <SciChartReact
                                key="columnChart"
                                initChart={initColumnChart}
                                className="sci-chart"
                                onInit={handleColumnChartInit}
                                style={{ display: showColumnChart ? "block" : "none" }}
                            />
                            <SciChartReact
                                key="paretoChart"
                                initChart={initParetoChart}
                                className="sci-chart"
                                onInit={handleParetoChartInit}
                                style={{ display: showColumnChart ? "none" : "block" }}
                            />
                        </div>
                    </div>

                    {/* Scatter Chart or Wafer Chart based on selection */}
                    <div className="scatter-wafer-container">
                        <SciChartReact
                            key="plotChart"
                            initChart={initWaferChart}
                            className="sci-chart"
                            onInit={handleWaferChartInit}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
