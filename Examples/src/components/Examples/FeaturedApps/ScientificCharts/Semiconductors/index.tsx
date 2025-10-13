import { useEffect, useState, useRef } from "react";
import { generateWaferLotData, WaferLotData, WaferDayData, IBatchMetadata } from "./waferData";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawLineChart } from "./lineChart";
import { drawColumnChart } from "./columnChart";
import { drawScatterChart } from "./scatterChart";
import { drawPlot } from "./plot";
import { drawPareoChart } from "./pareoChart";

import "./styles.css";

export default function Overview() {
    const [data, setData] = useState<WaferDayData[]>([]);
    const [selectedDay, setSelectedDay] = useState<WaferDayData | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<IBatchMetadata | null>(null);
    const lineChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const columnChartRef = useRef<{ sciChartSurface: any; updateData: (batchData: WaferLotData[]) => void } | null>(
        null
    );
    const pareoChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const scatterChartRef = useRef<{ sciChartSurface: any; wasmContext: any } | null>(null);
    const plotChartRef = useRef<{
        sciChartSurface: any;
        generateSubcharts: (selectedPoint: IBatchMetadata) => void;
    } | null>(null);

    const resetToInitialState = () => {
        // Simply reset the state - this will trigger re-rendering
        // and the charts will naturally return to their initial state
        setSelectedDay(null);

        // Optionally regenerate data to ensure fresh state
        // const freshData = generateWaferLotData(15, new Date(2023, 0, 1));
        // setData(freshData);
    };

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

    const handlePareoChartInit = (chartInstance: any) => {
        pareoChartRef.current = chartInstance;
    };

    const handleScatterChartInit = (chartInstance: any) => {
        scatterChartRef.current = chartInstance;
    };

    const handlePlotChartInit = (chartInstance: TResolvedReturnType<typeof drawPlot>) => {
        plotChartRef.current = chartInstance;
        //plotChartRef.current.generateSubcharts()
    };

    // Handler for when a point is selected in the line chart
    const handlePointSelected = (point: WaferDayData, index: number) => {
        //setSelectedDay(point);
        columnChartRef.current?.updateData(point.Batches);
    };

    // Handler for when a point is selected in the line chart
    const handleBatchSelected = (point: IBatchMetadata) => {
        setSelectedBatch(point);
        plotChartRef.current.generateSubcharts(point);
    };

    // Custom init functions that pass data to chart drawing functions
    const initLineChart = async (rootElement: string | HTMLDivElement) => {
        return drawLineChart(rootElement, data, handlePointSelected);
    };

    const initColumnChart = async (rootElement: string | HTMLDivElement) => {
        return drawColumnChart(rootElement, data[0].Batches, handleBatchSelected);
    };

    const initPareoChart = async (rootElement: string | HTMLDivElement) => {
        return drawPareoChart(rootElement, data[0].Batches);
    };

    const initScatterChart = async (rootElement: string | HTMLDivElement) => {
        return drawScatterChart(rootElement, data[0].Batches);
    };

    const initPlotChart = async (rootElement: string | HTMLDivElement) => {
        if (selectedDay) {
            const { Date, Batch, Input2: Input } = selectedDay.Batches[0];
            return drawPlot(rootElement, { Date, Batch, Input, isSelected: true }); // Pass selectedPoint instead of data
        }
        return null;
    };

    // // Re-render charts when data changes
    // useEffect(() => {
    //     if (data.length > 0 && selectedBatch) {
    //         // Use setTimeout to ensure charts are fully initialized
    //         setTimeout(() => {
    //             try {
    //                 if (plotChartRef.current?.generateSubcharts && !plotChartRef.current.sciChartSurface?.isDisposed) {
    //                     plotChartRef.current.generateSubcharts(selectedBatch);
    //                 }
    //             } catch (error) {
    //                 console.warn("Could not update plot chart:", error);
    //             }
    //         }, 100);
    //     }
    // }, [data, selectedBatch]);

    // useEffect(() => {
    //     //setDataIndex
    //     setTimeout(() => {
    //         if (data.length && selectedPoint) {
    //             waferChartRef.current.setDataIndex(selectedPoint, selectedWafer);
    //         }
    //     }, 100);
    // }, [selectedWafer, selectedPoint]);

    return data.length ? (
        <div className="dashboard-container">
            {selectedDay ? (
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
                    <div className="column-chart-container">
                        <div className="chart-wrapper">
                            <SciChartReact
                                key="columnChart"
                                initChart={initColumnChart}
                                className="sci-chart"
                                onInit={handleColumnChartInit}
                            />
                        </div>
                    </div>

                    {/* Scatter Chart or Wafer Chart based on selection */}
                    <div className="scatter-wafer-container">
                        <div className="chart-wrapper">
                            <SciChartReact
                                key="plotChart"
                                initChart={initPlotChart}
                                className="sci-chart"
                                onInit={handlePlotChartInit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
