"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { overviewOptions, createInitMeasureChart } from "./measureCharts";
import { createInitWaferChart } from "./waferChart";
import { createInitScatterPlot } from "./scatterPlot";
import { appTheme } from "../../../theme";
import useDataStore from "./store";
import { generateWaferDataByValues } from "./waferData";

import "./styles.css";

export default function WaferAnalysis() {
    const [MRsFilter, setMRsFilter] = useState<[number, number]>([null, null]);
    const [HRsFilter, setHRsFilter] = useState<[number, number]>([null, null]);
    const [MR2sFilter, setMR2sFilter] = useState<[number, number]>([null, null]);
    const [HDIsFilter, setHDIsFilter] = useState<[number, number]>([null, null]);
    const [RowsFilter, setRowsFilter] = useState<[number, number]>([null, null]);
    const [ColsFilter, setColsFilter] = useState<[number, number]>([null, null]);
    const [selectedVariable, setSelectedVariable] = useState<string>("DEFECT");

    // Chart instance refs to store the charts and their update functions
    const waferChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitWaferChart>> | null>(null);
    const scatterPlotRef = useRef<TResolvedReturnType<ReturnType<typeof createInitScatterPlot>> | null>(null);
    const mrChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitMeasureChart>> | null>(null);
    const hrChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitMeasureChart>> | null>(null);
    const mr2ChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitMeasureChart>> | null>(null);
    const hdiChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitMeasureChart>> | null>(null);

    const { setData, data, dies, Row, Col, MR, MRs, HR, HRs, MR2, MR2s, HDI, HDIs } = useDataStore();

    // Apply filters to crossfilter dimensions
    if (MRsFilter[0] !== null && MRsFilter[1] !== null) {
        MR!.filter(MRsFilter);
    }

    if (HRsFilter[0] !== null && HRsFilter[1] !== null) {
        HR!.filter(HRsFilter);
    }

    if (MR2sFilter[0] !== null && MR2sFilter[1] !== null) {
        MR2!.filter(MR2sFilter);
    }

    if (HDIsFilter[0] !== null && HDIsFilter[1] !== null) {
        HDI!.filter(HDIsFilter);
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

    // Initialize data
    useEffect(() => {
        // Extract numeric seed from query string
        const urlParams = new URLSearchParams(window.location.search);
        const seedParam = urlParams.get("seed");
        const seed = seedParam ? parseInt(seedParam, 10) : 1337;
        // other cool visual seeds: 50, 52, 54, 69, 1337

        let data = generateWaferDataByValues(150, seed);
        setData(data);
    }, []);

    // Get current data arrays for charts - memoized to avoid unnecessary recalculations
    const { MRsX, MRsY, HRsX, HRsY, MR2sX, MR2sY, HDIsX, HDIsY } = useMemo(
        () => ({
            MRsX: MRs?.all().map((d) => d.key) || [],
            MRsY: MRs?.all().map((d) => Math.abs(d.value as number)) || [],
            HRsX: HRs?.all().map((d) => d.key) || [],
            HRsY: HRs?.all().map((d) => Math.abs(d.value as number)) || [],
            MR2sX: MR2s?.all().map((d) => d.key) || [],
            MR2sY: MR2s?.all().map((d) => Math.abs(d.value as number)) || [],
            HDIsX: HDIs?.all().map((d) => d.key) || [],
            HDIsY: HDIs?.all().map((d) => Math.abs(d.value as number)) || [],
        }),
        [MRs, HRs, MR2s, HDIs]
    );

    // Calculate ranges for each variable - memoized to avoid unnecessary recalculations
    const variableRanges = useMemo(() => {
        const ranges: Record<string, [number, number]> = {};

        if (MR) {
            const mrTop = MR.top(1);
            const mrBottom = MR.bottom(1);
            ranges.MR = [mrBottom.length > 0 ? mrBottom[0].MR : 0, mrTop.length > 0 ? mrTop[0].MR : 1];
        }

        if (HR) {
            const hrTop = HR.top(1);
            const hrBottom = HR.bottom(1);
            ranges.HR = [hrBottom.length > 0 ? hrBottom[0].HR : 0, hrTop.length > 0 ? hrTop[0].HR : 1];
        }

        if (MR2) {
            const mr2Top = MR2.top(1);
            const mr2Bottom = MR2.bottom(1);
            ranges.MR2 = [mr2Bottom.length > 0 ? mr2Bottom[0].MR2 : 0, mr2Top.length > 0 ? mr2Top[0].MR2 : 1];
        }

        if (HDI) {
            const hdiTop = HDI.top(1);
            const hdiBottom = HDI.bottom(1);
            ranges.HDI = [hdiBottom.length > 0 ? hdiBottom[0].HDI : 0, hdiTop.length > 0 ? hdiTop[0].HDI : 1];
        }

        return ranges;
    }, [MR, HR, MR2, HDI]);

    // Create init functions with current data - memoized to prevent unnecessary re-creation
    const initWaferChart = useMemo(
        () => createInitWaferChart(setRowsFilter, setColsFilter, selectedVariable, variableRanges[selectedVariable]),
        [setRowsFilter, setColsFilter, selectedVariable, variableRanges]
    );

    const initScatterPlot = useMemo(() => createInitScatterPlot(), []);

    const initMRChart = useMemo(
        () => createInitMeasureChart(MRsX, MRsY, setMRsFilter, appTheme.MutedTeal),
        [MRsX, MRsY, setMRsFilter]
    );

    const initHRChart = useMemo(
        () => createInitMeasureChart(HRsX, HRsY, setHRsFilter, appTheme.PaleOrange),
        [HRsX, HRsY, setHRsFilter]
    );

    const initMR2Chart = useMemo(
        () => createInitMeasureChart(MR2sX, MR2sY, setMR2sFilter, appTheme.MutedPurple),
        [MR2sX, MR2sY, setMR2sFilter]
    );

    const initHDIChart = useMemo(
        () => createInitMeasureChart(HDIsX, HDIsY, setHDIsFilter, appTheme.MutedSkyBlue),
        [HDIsX, HDIsY, setHDIsFilter]
    );

    // Chart init handlers - useCallback to prevent unnecessary re-renders
    const handleWaferChartInit = useCallback(
        (chartInstance: TResolvedReturnType<ReturnType<typeof createInitWaferChart>>) => {
            waferChartRef.current = chartInstance;
        },
        []
    );

    const handleScatterPlotInit = useCallback(
        (chartInstance: TResolvedReturnType<ReturnType<typeof createInitScatterPlot>>) => {
            scatterPlotRef.current = chartInstance;
        },
        []
    );

    const handleMRChartInit = useCallback(
        (chartInstance: TResolvedReturnType<ReturnType<typeof createInitMeasureChart>>) => {
            mrChartRef.current = chartInstance;
        },
        []
    );

    const handleHRChartInit = useCallback(
        (chartInstance: TResolvedReturnType<ReturnType<typeof createInitMeasureChart>>) => {
            hrChartRef.current = chartInstance;
        },
        []
    );

    const handleMR2ChartInit = useCallback(
        (chartInstance: TResolvedReturnType<ReturnType<typeof createInitMeasureChart>>) => {
            mr2ChartRef.current = chartInstance;
        },
        []
    );

    const handleHDIChartInit = useCallback(
        (chartInstance: TResolvedReturnType<ReturnType<typeof createInitMeasureChart>>) => {
            hdiChartRef.current = chartInstance;
        },
        []
    );

    // Memoize filtered data to avoid unnecessary recalculations
    const filteredData = useMemo(() => {
        if (data.length > 0 && dies) {
            return dies.allFiltered();
        }
        return [];
    }, [data.length, dies, MRsFilter, HRsFilter, MR2sFilter, HDIsFilter, RowsFilter, ColsFilter]);

    const waferFilteredData = useMemo(() => {
        if (data.length > 0 && dies && Row && Col) {
            // Do not apply row/col filters for the wafer data
            //@ts-ignore
            return dies.allFiltered([Row, Col]);
        }
        return [];
    }, [data.length, dies, MRsFilter, HRsFilter, MR2sFilter, HDIsFilter, Row, Col]);

    // Update chart data when filtered data changes
    useEffect(() => {
        if (scatterPlotRef.current && filteredData.length > 0) {
            scatterPlotRef.current.updateScatterPlotData(filteredData);
        }

        if (waferChartRef.current && waferFilteredData.length > 0) {
            waferChartRef.current.updateWaferData(waferFilteredData);
        }
    }, [filteredData, waferFilteredData]);

    // Update palette provider when selected variable or ranges change
    useEffect(() => {
        if (waferChartRef.current && waferChartRef.current.updatePaletteProvider) {
            const range = variableRanges[selectedVariable];
            waferChartRef.current.updatePaletteProvider(selectedVariable, range);
        }
    }, [selectedVariable, variableRanges]);

    // Update measure chart data when data changes
    useEffect(() => {
        if (
            MRs &&
            HRs &&
            MR2s &&
            HDIs &&
            (mrChartRef.current || hrChartRef.current || mr2ChartRef.current || hdiChartRef.current)
        ) {
            const currentMRsX = MRs.all().map((d) => d.key);
            const currentMRsY = MRs.all().map((d) => Math.abs(d.value as number));
            const currentHRsX = HRs.all().map((d) => d.key);
            const currentHRsY = HRs.all().map((d) => Math.abs(d.value as number));
            const currentMR2sX = MR2s.all().map((d) => d.key);
            const currentMR2sY = MR2s.all().map((d) => Math.abs(d.value as number));
            const currentHDIsX = HDIs.all().map((d) => d.key);
            const currentHDIsY = HDIs.all().map((d) => Math.abs(d.value as number));

            if (mrChartRef.current) {
                mrChartRef.current.updateMeasureChartData(currentMRsX, currentMRsY);
            }

            if (hrChartRef.current) {
                hrChartRef.current.updateMeasureChartData(currentHRsX, currentHRsY);
            }

            if (mr2ChartRef.current) {
                mr2ChartRef.current.updateMeasureChartData(currentMR2sX, currentMR2sY);
            }

            if (hdiChartRef.current) {
                hdiChartRef.current.updateMeasureChartData(currentHDIsX, currentHDIsY);
            }
        }
    }, [MRs, HRs, MR2s, HDIs, RowsFilter, ColsFilter]);

    return data.length ? (
        <div className="wafer-analysis-container">
            <div className="left-panel">
                <div className="wafer-chart-container">
                    <SciChartReact initChart={initWaferChart} onInit={handleWaferChartInit} className="wafer-chart" />
                </div>

                {/* Variable selection dropdown */}
                <div className="variable-selection">
                    <div className="variable-selection-content">
                        <div>Color by:</div>
                        <select
                            value={selectedVariable}
                            onChange={(e) => setSelectedVariable(e.target.value)}
                            className="variable-select"
                        >
                            {["DEFECT", "MR", "HR", "MR2", "HDI"].map((variable) => (
                                <option key={variable} value={variable}>
                                    {variable}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div id="wafer-legend"></div>
            </div>

            <div className="right-panel">
                <div className="scatter-plot-container">
                    <SciChartReact initChart={initScatterPlot} onInit={handleScatterPlotInit} className="sci-chart" />
                </div>
                <div className="charts-grid">
                    <div className="charts-row">
                        <div className="chart-column">
                            <h5 className="chart-title">
                                MR values - {MRsFilter[0]} to {MRsFilter[1]}
                            </h5>
                            <SciChartReact
                                initChart={initMRChart}
                                onInit={handleMRChartInit}
                                className="chart-with-overview"
                                innerContainerProps={{ className: "chart-inner-container" }}
                            >
                                <SciChartNestedOverview className="chart-overview" options={overviewOptions} />
                            </SciChartReact>
                        </div>
                        <div className="chart-column">
                            <h5 className="chart-title">
                                MR2 values - {MR2sFilter[0]} to {MR2sFilter[1]}
                            </h5>
                            <SciChartReact
                                initChart={initMR2Chart}
                                onInit={handleMR2ChartInit}
                                className="chart-with-overview"
                                innerContainerProps={{ className: "chart-inner-container" }}
                            >
                                <SciChartNestedOverview className="chart-overview" options={overviewOptions} />
                            </SciChartReact>
                        </div>
                    </div>
                    <div className="charts-row">
                        <div className="chart-column">
                            <h5 className="chart-title">
                                HR values - {HRsFilter[0]} to {HRsFilter[1]}
                            </h5>
                            <SciChartReact
                                initChart={initHRChart}
                                onInit={handleHRChartInit}
                                className="chart-with-overview"
                                innerContainerProps={{ className: "chart-inner-container" }}
                            >
                                <SciChartNestedOverview className="chart-overview" options={overviewOptions} />
                            </SciChartReact>
                        </div>
                        <div className="chart-column">
                            <h5 className="chart-title">
                                HDI values - {HDIsFilter[0]} to {HDIsFilter[1]}
                            </h5>
                            <SciChartReact
                                initChart={initHDIChart}
                                onInit={handleHDIChartInit}
                                className="chart-with-overview"
                                innerContainerProps={{ className: "chart-inner-container" }}
                            >
                                <SciChartNestedOverview className="chart-overview" options={overviewOptions} />
                            </SciChartReact>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
