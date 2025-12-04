import { useCallback, useMemo, useRef, useState } from "react";
import { SciChartReact, SciChartGroup, TResolvedReturnType, SciChartNestedOverview } from "scichart-react";
import { SciChartSurface, TSciChartPerformanceData } from "scichart";
import { getDataSeriesMetricsChartInitFunction } from "../charts/Memory/DataSeriesInfoChartConfig";
import { getDeletablesInfoChartInitFunction } from "../charts/Memory/DeletablesInfoChartConfig";
import { getPerformanceInfoChartInitFunction } from "../charts/Performance/PerformanceInfoChartConfig";
import "./PerformanceGraph.css";
import { CustomReactLegend } from "./CustomReactLegend";
import { overviewOptions } from "../charts/Performance/PerformanceGraphUtils";

export type TDebugInfo = { performanceInfoData: TSciChartPerformanceData[]; dataSeriesInfoData?: any };

export function PerformanceStatsMonitor(props: { debugInfo: TDebugInfo }) {
    console.log("debugInfo", props.debugInfo);
    if (!(props?.debugInfo?.performanceInfoData?.[0]?.marks?.length > 0)) {
        return "Looks like there's no data. Probably Performance Debug mode was not enabled.";
    }
    const performanceInfoChartInitFunction = useMemo(
        () => props.debugInfo && getPerformanceInfoChartInitFunction(props.debugInfo?.performanceInfoData),
        [props.debugInfo]
    );
    const deletablesInfoChartInitFunction = useMemo(() => getDeletablesInfoChartInitFunction(), [props.debugInfo]);
    const dataSeriesInfoChartIntiFunction = useMemo(
        () => props.debugInfo && getDataSeriesMetricsChartInitFunction(props.debugInfo?.dataSeriesInfoData),
        [props.debugInfo]
    );

    // if (!props.debugInfo) {
    //     return <div style={{ maxWidth: 900, height: 600 }}>Waiting for debug data...</div>;
    // }

    const mainSurfaceRef = useRef<SciChartSurface>();
    const [processedPerformanceData, setProcessedPerformanceData] =
        useState<TResolvedReturnType<typeof performanceInfoChartInitFunction>["processedData"]>(null);

    return (
        <SciChartGroup>
            <div style={{ display: "flex", width: "100%" }}>
                <SciChartReact
                    fallback={<> </>}
                    initChart={performanceInfoChartInitFunction}
                    style={{ display: "flex", flexWrap: "wrap", flex: "auto", height: "90vh", width: "70vh" }}
                    innerContainerProps={{ style: { overflow: "hidden", minWidth: 400 } }}
                    onInit={(initResult: TResolvedReturnType<typeof performanceInfoChartInitFunction>) => {
                        mainSurfaceRef.current = initResult.sciChartSurface;
                        setProcessedPerformanceData(initResult.processedData);
                    }}
                >
                    {/* <SciChartNestedOverview
                        options={overviewOptions}
                        style={{
                            height: "10%",
                            width: "100%"
                        }}
                    /> */}
                    {/* <SciChartNestedManualLegend
                    options={manualLegendOptions}
                    style={{
                        flex: 'none',
                        height: '100%',
                        justifySelf: 'flex-end',
                        alignSelf: 'start',
                    }}
                /> */}
                </SciChartReact>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "400px", // static width wrapper
                        height: "100%"
                    }}
                >
                    {processedPerformanceData && (
                        <CustomReactLegend surface={mainSurfaceRef.current} data={processedPerformanceData} />
                    )}

                    {/* <div
                        id="manualLegendContainer1"
                        style={{
                            height: "unset",
                            flex: "1",
                            width: "100%", // fill the parent
                            justifySelf: "flex-end",
                            alignSelf: "start"
                        }}
                    ></div>

                    <div
                        id="manualLegendContainer2"
                        style={{
                            flex: "1",
                            width: "100%", // fill the parent
                            justifySelf: "flex-end",
                            alignSelf: "start"
                        }}
                    ></div>
                    <div
                        id="manualLegendContainer3"
                        style={{
                            flex: "1",
                            width: "100%", // fill the parent
                            justifySelf: "flex-end",
                            alignSelf: "start"
                        }}
                    ></div> */}
                </div>
                {/* <SciChartExternalManualLegend options={manualLegendOptions} /> */}
            </div>

            {/* <SciChartReact
                style={{ maxWidth: 900, height: 600, flexBasis: '30%' }}
                initChart={deletablesInfoChartInitFunction}
            />
            <SciChartReact
                style={{ maxWidth: 900, height: 900, flexBasis: '30%' }}
                initChart={dataSeriesInfoChartIntiFunction}
            /> */}
        </SciChartGroup>
    );
}
