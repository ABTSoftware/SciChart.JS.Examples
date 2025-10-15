"use client";
import { useEffect, useState, useRef } from "react";
import { divElementId, divOverviewId, divElementId1, divOverviewId1, drawExample, drawExample1 } from "./measureCharts";

import { appTheme } from "../../../theme";

import { initializeWafer, waferId } from "./waferChart";

import { initializeScatterPlot, scatterPlotId } from "./scatterPlot";

import useDataStore from "./store";

import { generateWaferData } from "./waferData";

export default function WaferAnalysis() {
    const [MRsFilter, setMRsFilter] = useState<[number, number]>([null, null]);
    const [HRsFilter, setHRsFilter] = useState<[number, number]>([null, null]);
    const updateWaferDataRef = useRef<((data: any[]) => void) | null>(null);
    const waferCleanupRef = useRef<(() => void) | null>(null);
    const updateScatterPlotDataRef = useRef<((data: any[]) => void) | null>(null);
    const scatterPlotCleanupRef = useRef<(() => void) | null>(null);

    const { setData, data, dies, MR, MRs, HR, HRs } = useDataStore();

    if (MRsFilter[0] !== null && MRsFilter[1] !== null) {
        MR!.filter(MRsFilter);
    }

    if (HRsFilter[0] !== null && HRsFilter[1] !== null) {
        HR!.filter(HRsFilter);
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
                const { updateWaferData, cleanup: waferCleanup } = await initializeWafer();
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
        };
    }, [data.length > 0, dies]); // Only initialize once when data is available

    useEffect(() => {
        if (dies) {
            const MRs = dies.all().map((d) => {
                return d.MR;
            });

            const HRs = dies.all().map((d) => {
                return d.HR;
            });
        }
    }, [dies]);

    // Update chart data when filtered data changes
    useEffect(() => {
        if (data.length > 0 && dies) {
            const filteredData = dies.allFiltered();

            if (updateWaferDataRef.current) {
                updateWaferDataRef.current(filteredData);
            }

            if (updateScatterPlotDataRef.current) {
                updateScatterPlotDataRef.current(filteredData);
            }
        }
    }, [data.length, dies, MRsFilter, HRsFilter]);

    useEffect(() => {
        if (MRs && HRs) {
            const MRsX = MRs.all().map((d) => d.key);
            const MRsY = MRs.all().map((d) => d.value!) as number[];

            const HRsX = HRs.all().map((d) => d.key);
            const HRsY = HRs.all().map((d) => d.value!) as number[];

            const chartsPromise = Promise.all([
                drawExample(MRsX, MRsY, setMRsFilter),
                drawExample1(HRsX, HRsY, setHRsFilter),
            ]);

            return () => {
                chartsPromise.then((charts) => charts.forEach((chart) => chart?.sciChartSurface?.delete()));
            };
        }

        // Return empty cleanup function if condition is not met
        return () => {};
    }, [MRs, HRs]);

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
