import {
    AUTO_COLOR,
    chartBuilder,
    EAutoRange,
    EAxisType,
    EChart2DModifierType,
    ECoordinateMode,
    EExecuteOn,
    EHorizontalAnchorPoint,
    EModifierMouseArgKey,
    ENumericFormat,
    ESeriesType,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    HtmlCustomAnnotation,
    NumericLabelProvider,
    StackedMountainCollection,
    StackedMountainRenderableSeries,
    TrianglePointMarker,
    TSeriesDefinition,
    XyDataSeries
} from "scichart";
import { MemoryStatsData, MemoryUsageLogEntry } from "../types";
import { MemoryUnitsLabelProvider } from "scichart-addons/MemoryUnitsLabelProvider";
import { bytesToMB } from "../helpers";

export const drawMemoryStatsGraph =
    (memoryStats: Array<MemoryUsageLogEntry>) => async (rootElement: HTMLDivElement | string) => {
        const data = memoryStats.reduce(
            (acc, logEntry) => {
                const dataTraces = Object.keys(acc) as Array<keyof MemoryStatsData>;
                dataTraces.forEach(key => {
                    const currentValue = logEntry[key] ?? NaN;
                    const traceData = acc[key] as Array<typeof currentValue>;
                    traceData.push(currentValue);
                });

                return acc;
            },
            {
                name: [],
                timestamp: [],
                usedJSHeapSize: [],
                totalJSHeapSize: [],
                jsHeapSizeLimit: [],
                HEAPF64: [],
                wasmHeapStats: []
            } as MemoryStatsData
        );

        const {
            timestamp,
            name,
            usedJSHeapSize,
            totalJSHeapSize,
            jsHeapSizeLimit,
            HEAPF64,
            wasmHeapStats
        } = data;

        // int arena;    // total space allocated from system
        // int ordblks;  // number of free chunks
        // int smblks;   // number of fastbin blocks
        // int hblks;    // number of mmap regions
        // int hblkhd;   // space in mmap regions
        // int usmblks;  // max total allocated space
        // int fsmblks;  // space in fastbin free blocks
        // int uordblks; // total allocated space
        // int fordblks; // total free space
        // int keepcost; // top-most releasable space

        const series: TSeriesDefinition[] = [
            {
                type: ESeriesType.LineSeries,
                options: {
                    seriesName: "totalJSHeapSize",
                    stroke: "#2A9D8F",
                    strokeDashArray: [2, 2]
                },
                xyData: { xDataId: "timestamp", yDataId: "totalJSHeapSize" }
            },
            {
                type: ESeriesType.MountainSeries,
                options: {
                    seriesName: "usedJSHeapSize",
                    stroke: "#e1c71cff",
                    opacity: 0.5
                },
                xyData: { xDataId: "timestamp", yDataId: "usedJSHeapSize" }
            },
            {
                type: ESeriesType.MountainSeries,
                options: {
                    seriesName: "HEAPF64",
                    stroke: "#E63946",
                    fill: "#E63946",
                    opacity: 0.5
                },
                xyData: { xDataId: "timestamp", yDataId: "HEAPF64" }
            }
        ];

        const chart = await chartBuilder.buildChart(rootElement, {
            surface: { createSuspended: true, loader: false },
            xAxes: [
                {
                    type: EAxisType.NumericAxis,
                    options: {
                        autoRange: EAutoRange.Once,
                        labelProvider: new CustomLabelProvider()
                    }
                }
            ],
            yAxes: {
                type: EAxisType.NumericAxis,
                options: {
                    autoRange: EAutoRange.Once,
                    labelProvider: new MemoryUnitsLabelProvider()
                }
            },
            modifiers: [
                {
                    type: EChart2DModifierType.Legend,
                    options: {
                        showCheckboxes: true,
                        showLegend: true,
                        showSeriesMarkers: true
                    }
                },
                {
                    type: EChart2DModifierType.ZoomExtents
                },
                {
                    type: EChart2DModifierType.ZoomPan
                },
                {
                    type: EChart2DModifierType.MouseWheelZoom
                },
                {
                    type: EChart2DModifierType.RubberBandXYZoom,
                    options: {
                        executeCondition: {
                            button: EExecuteOn.MouseLeftButton,
                            key: EModifierMouseArgKey.Ctrl
                        }
                    }
                },
                {
                    type: EChart2DModifierType.Rollover,
                    options: {
                        tooltipDataTemplate: (seriesInfo, tooltipTitle) => {
                            const metadata = seriesInfo.pointMetadata as { event?: string; isSelected?: boolean };
                            const eventText = metadata?.event ? metadata.event: '';
                            return [
                                tooltipTitle,
                                seriesInfo.formattedYValue,
                                `${seriesInfo.yValue}`,
                                eventText
                            ];
                        }
                    }
                }
            ],
            sharedData: {
                timestamp,
                HEAPF64,
                jsHeapSizeLimit,
                usedJSHeapSize,
                totalJSHeapSize
            },
            series
        });

        const { sciChartSurface, wasmContext } = chart;

        const stackedMemorySeries = new StackedMountainCollection(chart.wasmContext, {});

        const allocatedWasmHeapMemoryDataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: "Allocated WASM Heap Memory",

            xValues: timestamp,
            yValues: wasmHeapStats.map(({ uordblks }) => uordblks ?? NaN)
        });

        const allocatedWasmHeapMemorySeries = new StackedMountainRenderableSeries(
            chart.wasmContext,
            {
                dataSeries: allocatedWasmHeapMemoryDataSeries,
                stroke: "#D32F2F",
                fill: "#D32F2F",
                opacity: 0.7

                // pointMarker: new TrianglePointMarker(wasmContext, {
                //     width: 10,
                //     height: 10,
                //     stroke: "green",
                //     fill: "green"
                // })
            }
        );
        const releasableWasmHeapMemoryDataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: "Releasable WASM Heap Memory",
            xValues: timestamp,
            yValues: wasmHeapStats.map(({ keepcost }) => keepcost ?? NaN)
        });

        const releasableHeapMemorySeries = new StackedMountainRenderableSeries(chart.wasmContext, {
            dataSeries: releasableWasmHeapMemoryDataSeries,
            stroke: "#FFA726",
            fill: "#FFA726",
            opacity: 0.7

            // pointMarker: new TrianglePointMarker(wasmContext, {
            //     width: 10,
            //     height: 10,
            //     stroke: "green",
            //     fill: "green"
            // })
        });

        const freeWasmHeapMemoryDataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: "Free WASM Heap Memory",

            xValues: timestamp,
            yValues: wasmHeapStats.map(({ fordblks }) => fordblks ?? NaN)
        });

        const freeWasmHeapMemorySeries = new StackedMountainRenderableSeries(chart.wasmContext, {
            dataSeries: freeWasmHeapMemoryDataSeries,
            stroke: AUTO_COLOR,
            fill: AUTO_COLOR

            // pointMarker: new TrianglePointMarker(wasmContext, {
            //     width: 10,
            //     height: 10,
            //     stroke: "green",
            //     fill: "green"
            // })
        });

        stackedMemorySeries.add(
            allocatedWasmHeapMemorySeries,
            // releasableHeapMemorySeries,
            freeWasmHeapMemorySeries
        );

        sciChartSurface.renderableSeries.add(stackedMemorySeries);

        const totalWasmMemoryDataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: "Total WASM Arena Memory",
            xValues: timestamp,
            yValues: wasmHeapStats.map(({ arena }) => arena ?? NaN),
            metadata: name.map(event => ({ isSelected: false, event }))
        });

        const totalWasmMemorySeries = new FastLineRenderableSeries(chart.wasmContext, {
            stroke: "#7B1FA2",
            // fill: "#9C27B0",
            opacity: 0.4,

            dataSeries: totalWasmMemoryDataSeries,
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 10,
                height: 10,
                stroke: "#7B1FA2",
                fill: "#7B1FA2"
            })
        });
        sciChartSurface.renderableSeries.add(totalWasmMemorySeries);

        // Get references to JS heap series (first 3 series added by chartBuilder)
        const jsHeapSeries = [
            sciChartSurface.renderableSeries.get(0), // totalJSHeapSize
            sciChartSurface.renderableSeries.get(1), // usedJSHeapSize
            sciChartSurface.renderableSeries.get(2) // HEAPF64
        ];

        // Track button state
        let isWasmOnlyView = false;

        // Create HTML annotation with button
        const buttonAnnotation = new HtmlCustomAnnotation({
            x1: 0.5,
            y1: 0.02,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            isEditable: false
        });

        // Create and style button element
        const button = document.createElement("button");
        button.textContent = "Show WASM Only";

        const setOptimalVisibleRange = () => {
            isWasmOnlyView = !isWasmOnlyView;

            // Toggle visibility of JS heap series
            jsHeapSeries.forEach(series => {
                series.isVisible = !isWasmOnlyView;
            });

            // Perform zoom extents to fit visible series
            sciChartSurface.zoomExtents();

            // Update button text
            button.textContent = isWasmOnlyView ? "Show All Series" : "Show WASM Only";
        };
        button.style.pointerEvents = "all";
        button.style.padding = "8px 16px";
        button.style.backgroundColor = "#0e639c";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        button.style.fontSize = "13px";
        button.style.fontWeight = "500";
        button.style.transition = "all 0.2s";
        button.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.2)";

        // Add event listeners
        button.addEventListener("click", setOptimalVisibleRange);
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "#1177bb";
            button.style.transform = "translateY(-1px)";
            button.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "#0e639c";
            button.style.transform = "translateY(0)";
            button.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.2)";
        });

        // Append button to annotation's HTML element
        buttonAnnotation.htmlElement.appendChild(button);

        sciChartSurface.annotations.add(buttonAnnotation);

        setOptimalVisibleRange();

        await chart.sciChartSurface.nextStateRender({
            invalidateOnResume: true,
            resumeBefore: true,
            suspendAfter: false
        });

        await chart.sciChartSurface.nextStateRender({
            invalidateOnResume: true,
            resumeBefore: true,
            suspendAfter: false
        });

        return chart;
    };

/** Should be same as {@link NumericLabelProvider} but for when data is in milliseconds */
export class CustomLabelProvider extends NumericLabelProvider {
    // protected customFormatLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);
    // protected customFormatCursorLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);

    public override get formatLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
    public override get formatCursorLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
}

const formatUnixDateToHumanStringHHMMSSms = (timestamp: DOMHighResTimeStamp): string => {
    // timestamp is elapsed time in milliseconds from performance.now()
    if (isNaN(timestamp)) {
        return "";
    }

    const totalSeconds = Math.floor(timestamp / 1000);
    const milliseconds = Math.floor(timestamp % 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursString = hours <= 9 ? `0${hours}` : hours.toString(10);
    const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString(10);
    const secondsString = seconds <= 9 ? `0${seconds}` : seconds.toString(10);
    const millisecondsString =
        milliseconds <= 9
            ? `00${milliseconds}`
            : milliseconds <= 99
              ? `0${milliseconds}`
              : milliseconds.toString(10);

    return `${hoursString}:${minutesString}:${secondsString}:${millisecondsString}`;
};
