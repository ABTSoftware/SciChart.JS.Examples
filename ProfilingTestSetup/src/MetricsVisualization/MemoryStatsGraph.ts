import {
    chartBuilder,
    EAutoRange,
    EAxisType,
    EChart2DModifierType,
    ENumericFormat,
    ESeriesType,
    TSeriesDefinition
} from "scichart";
import { MemoryStatsData, MemoryUsageLogEntry } from "../types";
import { MemoryUnitsLabelProvider } from "scichart-addons/MemoryUnitsLabelProvider";

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
                HEAPF64: []
            }
        );

        const { timestamp, name, usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit, HEAPF64 } = data;

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
                    options: { autoRange: EAutoRange.Once, labelFormat: ENumericFormat.Date_HHMMSS }
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
