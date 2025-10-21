"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { SciChartReact, SciChartNestedOverview, TResolvedReturnType } from "scichart-react";
import { overviewOptions, createInitMeasureChart } from "./measureCharts";
import { createInitWaferChart } from "./waferChart";
import { createInitScatterPlot } from "./scatterPlot";
import { appTheme } from "../../../theme";
import useDataStore from "./store";
import { generateWaferData, generateWaferDataByValues } from "./waferData";

export default function WaferAnalysis() {
    const [MRsFilter, setMRsFilter] = useState<[number, number]>([null, null]);
    const [HRsFilter, setHRsFilter] = useState<[number, number]>([null, null]);
    const [RowsFilter, setRowsFilter] = useState<[number, number]>([null, null]);
    const [ColsFilter, setColsFilter] = useState<[number, number]>([null, null]);
    const [selectedVariable, setSelectedVariable] = useState<string>("DEFECT");

    // Chart instance refs to store the charts and their update functions
    const waferChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitWaferChart>> | null>(null);
    const scatterPlotRef = useRef<TResolvedReturnType<ReturnType<typeof createInitScatterPlot>> | null>(null);
    const mrChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitMeasureChart>> | null>(null);
    const hrChartRef = useRef<TResolvedReturnType<ReturnType<typeof createInitMeasureChart>> | null>(null);

    const { setData, data, dies, Row, Col, MR, MRs, HR, HRs, MR2, HDI } = useDataStore();

    // Apply filters to crossfilter dimensions
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

    // Initialize data
    useEffect(() => {
        //let data = generateWaferData(100, 0.2, 50, 5);
        let data = generateWaferDataByValues(100);
        setData(data);
    }, []);

    // Get current data arrays for charts - memoized to avoid unnecessary recalculations
    const { MRsX, MRsY, HRsX, HRsY } = useMemo(
        () => ({
            MRsX: MRs?.all().map((d) => d.key) || [],
            MRsY: MRs?.all().map((d) => Math.abs(d.value as number)) || [],
            HRsX: HRs?.all().map((d) => d.key) || [],
            HRsY: HRs?.all().map((d) => Math.abs(d.value as number)) || [],
        }),
        [MRs, HRs]
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

    const initMRChart = useMemo(() => createInitMeasureChart(MRsX, MRsY, setMRsFilter), [MRsX, MRsY, setMRsFilter]);

    const initHRChart = useMemo(() => createInitMeasureChart(HRsX, HRsY, setHRsFilter), [HRsX, HRsY, setHRsFilter]);

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

    // Memoize filtered data to avoid unnecessary recalculations
    const filteredData = useMemo(() => {
        if (data.length > 0 && dies) {
            return dies.allFiltered();
        }
        return [];
    }, [data.length, dies, MRsFilter, HRsFilter, RowsFilter, ColsFilter]);

    const waferFilteredData = useMemo(() => {
        if (data.length > 0 && dies && Row && Col) {
            // Do not apply row/col filters for the wafer data
            //@ts-ignore
            return dies.allFiltered([Row, Col]);
        }
        return [];
    }, [data.length, dies, MRsFilter, HRsFilter, Row, Col]);

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
        if (MRs && HRs && (mrChartRef.current || hrChartRef.current)) {
            const currentMRsX = MRs.all().map((d) => d.key);
            const currentMRsY = MRs.all().map((d) => Math.abs(d.value as number));
            const currentHRsX = HRs.all().map((d) => d.key);
            const currentHRsY = HRs.all().map((d) => Math.abs(d.value as number));

            if (mrChartRef.current) {
                mrChartRef.current.updateMeasureChartData(currentMRsX, currentMRsY);
            }

            if (hrChartRef.current) {
                hrChartRef.current.updateMeasureChartData(currentHRsX, currentHRsY);
            }
        }
    }, [MRs, HRs, RowsFilter, ColsFilter]);

    return data.length ? (
        <div className="" style={{ display: "flex", flexDirection: "row", backgroundColor: appTheme.DarkIndigo }}>
            <div className="">
                <SciChartReact
                    initChart={initWaferChart}
                    onInit={handleWaferChartInit}
                    style={{ height: 400, width: 420 }}
                />

                {/* Variable selection checkboxes */}
                <div
                    style={{
                        padding: 10,
                        backgroundColor: appTheme.DarkIndigo,
                        color: appTheme.MutedSkyBlue,
                        fontSize: "12px",
                    }}
                >
                    <h6 style={{ margin: "5px 0 8px 0", color: appTheme.MutedSkyBlue }}>Color by:</h6>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            alignItems: "flex-start",
                        }}
                    >
                        {["DEFECT", "MR", "HR", "MR2", "HDI"].map((variable) => (
                            <label
                                key={variable}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    cursor: "pointer",
                                    minWidth: "60px",
                                    flex: "1 1 auto",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
                                    <input
                                        type="radio"
                                        name="colorVariable"
                                        value={variable}
                                        checked={selectedVariable === variable}
                                        onChange={(e) => setSelectedVariable(e.target.value)}
                                        style={{ marginRight: "4px" }}
                                    />
                                    <span>{variable}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="" style={{ width: 510 }}>
                <SciChartReact
                    initChart={initScatterPlot}
                    onInit={handleScatterPlotInit}
                    style={{ height: 200, width: "100%" }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        MR values - between {MRsFilter[0]} and {MRsFilter[1]}
                    </h5>
                    <SciChartReact
                        initChart={initMRChart}
                        onInit={handleMRChartInit}
                        style={{ display: "flex", flexDirection: "column", height: 110 }}
                        innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
                    >
                        <SciChartNestedOverview
                            style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                            options={overviewOptions}
                        />
                    </SciChartReact>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        HR values - between {HRsFilter[0]} and {HRsFilter[1]}
                    </h5>
                    <SciChartReact
                        initChart={initHRChart}
                        onInit={handleHRChartInit}
                        style={{ display: "flex", flexDirection: "column", height: 110 }}
                        innerContainerProps={{ style: { flexBasis: "80%", flexGrow: 1, flexShrink: 1 } }}
                    >
                        <SciChartNestedOverview
                            style={{ flexBasis: "20%", flexGrow: 1, flexShrink: 1 }}
                            options={overviewOptions}
                        />
                    </SciChartReact>
                </div>
            </div>
        </div>
    ) : null;
}
