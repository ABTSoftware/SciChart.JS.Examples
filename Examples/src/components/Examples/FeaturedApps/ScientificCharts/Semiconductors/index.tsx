import { useEffect, useState, useRef } from "react";
import { generateWaferLotData, WaferLotData, WaferDayData } from "./waferData";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawLineChart } from "./lineChart";
import { drawColumnChart } from "./columnChart";
import { drawWaferGrid } from "./waferGrid";
import { drawParetoChart } from "./paretoChart";

import "./styles.css";
import { SciChartSurface } from "scichart";

export default function Overview() {
    const [data, setData] = useState<WaferDayData[]>([]);
    const [selectedDay, setSelectedDay] = useState<WaferDayData | null>(null);
    const [showColumnChart, setShowColumnChart] = useState<boolean>(false);
    const columnChartRef = useRef<{
        sciChartSurface: SciChartSurface;
        updateData: (batchData: WaferLotData[], fireSelectionChanged: boolean) => void;
        updateSelection: (point: WaferLotData) => void;
    } | null>(null);
    const paretoChartRef = useRef<{
        sciChartSurface: SciChartSurface;
        updateData: (batchData: WaferLotData[], fireSelectionChanged: boolean) => void;
        updateSelection: (point: WaferLotData) => void;
    } | null>(null);
    const waferChartRef = useRef<{
        sciChartSurface: SciChartSurface;
        generateSubcharts: (selectedPoint: WaferLotData) => void;
    } | null>(null);

    useEffect(() => {
        const data = generateWaferLotData(15, 15, new Date(2023, 0, 1));
        setData(data);
        setSelectedDay(data[0]);
    }, []);

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
    const handlePointSelected = (point: WaferDayData) => {
        point.Batches[0].isSelected = true;
        // Update both charts since they are both always rendered
        columnChartRef.current?.updateData(point.Batches, showColumnChart);
        paretoChartRef.current?.updateData(point.Batches, !showColumnChart);
    };

    // Handler for when a point is selected in the column or pareto chart chart
    const handleBatchSelected = (point: WaferLotData, isColumnChart: boolean) => {
        if (isColumnChart) {
            paretoChartRef.current?.updateSelection(point);
        } else {
            columnChartRef.current?.updateSelection(point);
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
        <div className="sc-chart-wrapper sc-semiconductors-dashboard-container">
            <div className="sc-semiconductors-dashboard-layout">
                <div className="sc-semiconductors-line-chart-container">
                    <SciChartReact
                        initChart={initLineChart}
                        className="sc-semiconductors-sci-chart"
                    />
                </div>

                {/* Row for Column and Scatter Charts side by side */}
                <div className="sc-semiconductors-charts-row">
                    <div className="sc-semiconductors-column-chart-container">
                        <div className="sc-semiconductors-chart-header">
                            <div className="sc-button-group" role="group" aria-label="Batch chart type">
                                <button
                                    type="button"
                                    className="sc-button"
                                    aria-pressed={!showColumnChart}
                                    onClick={() => setShowColumnChart(false)}
                                >
                                    Pareto Chart
                                </button>
                                <button
                                    type="button"
                                    className="sc-button"
                                    aria-pressed={showColumnChart}
                                    onClick={() => setShowColumnChart(true)}
                                >
                                    Column Chart
                                </button>
                            </div>
                        </div>
                        <div className="sc-semiconductors-chart-wrapper">
                            <SciChartReact
                                key="columnChart"
                                initChart={initColumnChart}
                                className="sc-semiconductors-sci-chart"
                                onInit={handleColumnChartInit}
                                hidden={!showColumnChart}
                            />
                            <SciChartReact
                                key="paretoChart"
                                initChart={initParetoChart}
                                className="sc-semiconductors-sci-chart"
                                onInit={handleParetoChartInit}
                                hidden={showColumnChart}
                            />
                        </div>
                    </div>

                    {/* Scatter Chart or Wafer Chart based on selection */}
                    <div className="sc-semiconductors-scatter-wafer-container">
                        <SciChartReact
                            key="plotChart"
                            initChart={initWaferChart}
                            className="sc-semiconductors-sci-chart cursor-pointer"
                            onInit={handleWaferChartInit}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
