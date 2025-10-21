"use client";
import { useEffect, useState, useRef } from "react";
import { divElementId, divOverviewId, divElementId1, divOverviewId1, initializeMeasureChart } from "./measureCharts";

import { appTheme } from "../../../theme";

import { initializeWafer, waferId } from "./waferChart";

import { initializeScatterPlot, scatterPlotId } from "./scatterPlot";

import useDataStore from "./store";

import { generateWaferData } from "./waferData";

export default function WaferAnalysis() {
    const [MRsFilter, setMRsFilter] = useState<[number, number]>([null, null]);
    const [HRsFilter, setHRsFilter] = useState<[number, number]>([null, null]);
    const [RowsFilter, setRowsFilter] = useState<[number, number]>([null, null]);
    const [ColsFilter, setColsFilter] = useState<[number, number]>([null, null]);
    const updateWaferDataRef = useRef<((data: any[]) => void) | null>(null);
    const waferCleanupRef = useRef<(() => void) | null>(null);
    const updateScatterPlotDataRef = useRef<((data: any[]) => void) | null>(null);
    const scatterPlotCleanupRef = useRef<(() => void) | null>(null);
    const updateMeasureChartDataRef = useRef<((xValues: number[], yValues: number[]) => void) | null>(null);
    const measureChartCleanupRef = useRef<(() => void) | null>(null);
    const updateMeasureChart1DataRef = useRef<((xValues: number[], yValues: number[]) => void) | null>(null);
    const measureChart1CleanupRef = useRef<(() => void) | null>(null);

    const { setData, data, dies, Row, Col, MR, MRs, HR, HRs, clearFilters } = useDataStore();

    if (MRsFilter[0] !== null && MRsFilter[1] !== null) {
        MR!.filter(MRsFilter);
    }

    if (HRsFilter[0] !== null && HRsFilter[1] !== null) {
        HR!.filter(HRsFilter);
    }

    if (RowsFilter && RowsFilter[0] !== null && RowsFilter[1] !== null) {
        Row!.filter(RowsFilter);
    } else {
        Row?.filterAll();
    }

    if (ColsFilter && ColsFilter[0] !== null && ColsFilter[1] !== null) {
        Col!.filter(ColsFilter);
    } else {
        Col?.filterAll();
    }

    useEffect(() => {
        let data = generateWaferData(100, 0.2, 50, 5);
        setData(data);
    }, []);

    // Initialize charts once when component mounts
    useEffect(() => {
        const initializeCharts = async () => {
            if (data.length > 0 && dies) {
                // Initialize wafer chart
                const { updateWaferData, cleanup: waferCleanup } = await initializeWafer(setRowsFilter, setColsFilter);
                updateWaferDataRef.current = updateWaferData;
                waferCleanupRef.current = waferCleanup;

                // Initialize scatter plot chart
                const { updateScatterPlotData, cleanup: scatterCleanup } = await initializeScatterPlot();
                updateScatterPlotDataRef.current = updateScatterPlotData;
                scatterPlotCleanupRef.current = scatterCleanup;

                // Initial data load
                const filteredData = dies.allFiltered();
                updateWaferData(filteredData);
                updateScatterPlotData(filteredData);

                // Initial data load
                const MRsX = MRs.all().map((d) => d.key);
                const MRsY = MRs.all().map((d) => d.value!) as number[];
                const HRsX = HRs.all().map((d) => d.key);
                const HRsY = HRs.all().map((d) => d.value!) as number[];

                // Initialize measure chart
                const { updateMeasureChartData, cleanup: measureCleanup } = await initializeMeasureChart(
                    divElementId,
                    divOverviewId,
                    MRsX,
                    MRsY,
                    setMRsFilter
                );
                updateMeasureChartDataRef.current = updateMeasureChartData;
                measureChartCleanupRef.current = measureCleanup;

                // Initialize measure chart 1
                const { updateMeasureChartData: update1, cleanup: measureCleanup1 } = await initializeMeasureChart(
                    divElementId1,
                    divOverviewId1,
                    HRsX,
                    HRsY,
                    setHRsFilter
                );
                updateMeasureChart1DataRef.current = update1;
                measureChart1CleanupRef.current = measureCleanup1;
            }
        };

        initializeCharts();
        return () => {
            if (waferCleanupRef.current) {
                waferCleanupRef.current();
            }
            if (scatterPlotCleanupRef.current) {
                scatterPlotCleanupRef.current();
            }
            if (measureChartCleanupRef.current) {
                measureChartCleanupRef.current();
            }
            if (measureChart1CleanupRef.current) {
                measureChart1CleanupRef.current();
            }
        };
    }, [data.length > 0, dies]); // Only initialize once when data is available

    // Update chart data when filtered data changes
    useEffect(() => {
        if (data.length > 0 && dies) {
            if (updateScatterPlotDataRef.current) {
                updateScatterPlotDataRef.current(dies.allFiltered());
            }

            if (updateWaferDataRef.current) {
                //@ts-ignore
                updateWaferDataRef.current(dies.allFiltered([Row, Col]));
            }
        }
    }, [data.length, dies, MRsFilter, HRsFilter]);

    useEffect(() => {
        if (data.length > 0 && dies) {
            const filteredData = dies.allFiltered();

            if (updateScatterPlotDataRef.current) {
                updateScatterPlotDataRef.current(filteredData);
            }

            if (MRs && HRs) {
                const MRsX = MRs.all().map((d) => d.key);
                const MRsY = MRs.all().map((d) => Math.abs(d.value as number));
                const HRsX = HRs.all().map((d) => d.key);
                const HRsY = HRs.all().map((d) => Math.abs(d.value as number));

                if (updateMeasureChartDataRef.current) {
                    updateMeasureChartDataRef.current(MRsX, MRsY);
                }

                if (updateMeasureChart1DataRef.current) {
                    updateMeasureChart1DataRef.current(HRsX, HRsY);
                }
            }
        }
    }, [data.length, dies, RowsFilter, ColsFilter]);

    return data.length ? (
        <div className="" style={{ display: "flex", flexDirection: "row", backgroundColor: appTheme.DarkIndigo }}>
            <div className="">
                <div id={waferId} style={{ height: 400, width: 420 }} />
            </div>

            <div className="" style={{ width: 510 }}>
                <div id={scatterPlotId} style={{ height: 200, width: "100%" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        MR values - between {MRsFilter[0]} and {MRsFilter[1]}
                    </h5>
                    <div id={divElementId} style={{ flexBasis: 80, flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId} style={{ flexBasis: 30, flexGrow: 1, flexShrink: 1 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        HR values - between {HRsFilter[0]} and {HRsFilter[1]}
                    </h5>
                    <div id={divElementId1} style={{ flexBasis: 80, flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId1} style={{ flexBasis: 30, flexGrow: 1, flexShrink: 1 }} />
                </div>
            </div>
        </div>
    ) : null;
}
