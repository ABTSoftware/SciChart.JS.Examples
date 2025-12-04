import {
    chartBuilder,
    EAutoRange,
    EAxisAlignment,
    EAxisType,
    EChart2DModifierType,
    EPointMarkerType,
    ESeriesType,
    NumberRange,
    TSeriesDefinition,
    ENumericFormat,
    ELegendOrientation
} from "scichart";
import { TCollectedMetrics } from "../types";
import {
    parsePerformanceData,
    SurfacePerformanceMetrics
} from "../../reports/PerformanceDataParser";

/**
 * Data point for scalability analysis
 */
export interface ScalabilityDataPoint {
    testName: string;
    seriesCount: number;
    dataPoints: number;
    metrics: {
        avgRenderDuration: number;
        avgFPS: number;
        avgMemoryUsed: number;
        maxMemoryUsed: number;
        avgDataUpdateDuration: number;
        totalRenders: number;
    };
}

/**
 * Extracts scalability data from test results
 */
export function extractScalabilityData(
    testResults: Map<string, TCollectedMetrics>
): ScalabilityDataPoint[] {
    const dataPoints: ScalabilityDataPoint[] = [];

    testResults.forEach((metrics, testName) => {
        // Parse test name to extract parameters (e.g., "1x1000" -> 1 series, 1000 points)
        const match = testName.match(/(\d+)x(\d+)/);
        if (!match) return;

        const seriesCount = parseInt(match[1]);
        const dataPoints_count = parseInt(match[2]);

        // Parse performance data
        const perfMetrics = parsePerformanceData(metrics.performanceData);
        const allMetrics = Object.values(perfMetrics);

        if (allMetrics.length === 0) return;

        // Calculate aggregated metrics
        const avgRenderDuration =
            allMetrics.reduce((sum, m) => sum + m.averageRenderDuration, 0) / allMetrics.length;
        const avgFPS = allMetrics.reduce((sum, m) => sum + m.averageFPS, 0) / allMetrics.length;
        const avgDataUpdateDuration =
            allMetrics.reduce((sum, m) => sum + m.averageDataUpdateDuration, 0) / allMetrics.length;
        const totalRenders = allMetrics.reduce((sum, m) => sum + m.totalRenders, 0);

        // Calculate memory metrics
        const memoryData = metrics.memoryData;
        const memoryUsages = memoryData.map(m => m.usedJSHeapSize);
        const avgMemoryUsed = memoryUsages.reduce((sum, m) => sum + m, 0) / memoryUsages.length;
        const maxMemoryUsed = Math.max(...memoryUsages);

        dataPoints.push({
            testName,
            seriesCount,
            dataPoints: dataPoints_count,
            metrics: {
                avgRenderDuration,
                avgFPS,
                avgMemoryUsed,
                maxMemoryUsed,
                avgDataUpdateDuration,
                totalRenders
            }
        });
    });

    return dataPoints.sort((a, b) => {
        if (a.dataPoints !== b.dataPoints) return a.dataPoints - b.dataPoints;
        return a.seriesCount - b.seriesCount;
    });
}

/**
 * Creates a scalability chart showing performance metrics across different configurations
 *
 * Approach: Multiple line series on a single chart
 * - X-axis: Number of data points (1000, 10000)
 * - Y-axis (left): Render duration (ms) and Memory (MB)
 * - Y-axis (right): FPS
 * - Different line colors for different series counts
 * - Separate series for render time, memory, and FPS
 */
export const drawPerformanceScalabilityGraph =
    (scalabilityData: ScalabilityDataPoint[]) => async (rootElement: HTMLDivElement | string) => {
        // Group data by series count
        const seriesCountGroups = new Map<number, ScalabilityDataPoint[]>();
        scalabilityData.forEach(point => {
            if (!seriesCountGroups.has(point.seriesCount)) {
                seriesCountGroups.set(point.seriesCount, []);
            }
            seriesCountGroups.get(point.seriesCount)!.push(point);
        });

        const series: TSeriesDefinition[] = [];
        // More distinct colors with better contrast
        const colors = [
            "#E74C3C",
            "#3498DB",
            "#2ECC71",
            "#F39C12",
            "#9B59B6",
            "#1ABC9C",
            "#E67E22",
            "#34495E"
        ];
        let colorIndex = 0;

        // Create series for each series count
        seriesCountGroups.forEach((points, seriesCount) => {
            const color = colors[colorIndex % colors.length];
            const darkerColor = adjustColorBrightness(color, -40);
            const lighterColor = adjustColorBrightness(color, 40);

            // Sort by data points
            points.sort((a, b) => a.dataPoints - b.dataPoints);

            const dataPointCounts = points.map(p => p.dataPoints);
            const renderDurations = points.map(p => p.metrics.avgRenderDuration);
            const fpsValues = points.map(p => p.metrics.avgFPS);
            const memoryValues = points.map(p => p.metrics.avgMemoryUsed / (1024 * 1024)); // Convert to MB

            // Render duration series
            series.push({
                type: ESeriesType.LineSeries,
                options: {
                    stroke: color,
                    strokeThickness: 3,
                    seriesName: `Render Time (${seriesCount} series)`,
                    yAxisId: "durationYAxis",
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 8,
                            height: 8,
                            fill: color,
                            stroke: color,
                            strokeThickness: 2
                        }
                    }
                },
                xyData: {
                    xValues: dataPointCounts,
                    yValues: renderDurations
                }
            });

            // Memory series
            series.push({
                type: ESeriesType.LineSeries,
                options: {
                    stroke: darkerColor,
                    strokeThickness: 2,
                    strokeDashArray: [5, 5],
                    seriesName: `Memory (${seriesCount} series)`,
                    yAxisId: "memoryYAxis",
                    pointMarker: {
                        type: EPointMarkerType.Square,
                        options: {
                            width: 7,
                            height: 7,
                            fill: darkerColor,
                            stroke: darkerColor,
                            strokeThickness: 2
                        }
                    }
                },
                xyData: {
                    xValues: dataPointCounts,
                    yValues: memoryValues
                }
            });

            // FPS series
            series.push({
                type: ESeriesType.LineSeries,
                options: {
                    stroke: lighterColor,
                    strokeThickness: 2,
                    seriesName: `FPS (${seriesCount} series)`,
                    yAxisId: "fpsYAxis",
                    pointMarker: {
                        type: EPointMarkerType.Triangle,
                        options: {
                            width: 8,
                            height: 8,
                            fill: lighterColor,
                            stroke: lighterColor,
                            strokeThickness: 2
                        }
                    }
                },
                xyData: {
                    xValues: dataPointCounts,
                    yValues: fpsValues
                }
            });

            colorIndex++;
        });

        const chart = await chartBuilder.build2DChart(rootElement, {
            surface: {
                createSuspended: true,
                loader: false,
                disableAspect: false,
                title: "Performance Scalability Analysis"
            },
            xAxes: {
                type: EAxisType.NumericAxis,
                options: {
                    axisTitle: "Number of Data Points",
                    autoRange: EAutoRange.Always,
                    labelFormat: ENumericFormat.Decimal,
                    drawMajorGridLines: true,
                    drawMinorGridLines: false
                }
            },
            yAxes: [
                {
                    type: EAxisType.NumericAxis,
                    options: {
                        id: "durationYAxis",
                        axisTitle: "Render Duration (ms)",
                        axisAlignment: EAxisAlignment.Left,
                        autoRange: EAutoRange.Once,
                        labelStyle: { color: "#FF6B6B" },
                        axisTitleStyle: { color: "#FF6B6B" }
                    }
                },
                {
                    type: EAxisType.NumericAxis,
                    options: {
                        id: "memoryYAxis",
                        axisTitle: "Memory Usage (MB)",
                        axisAlignment: EAxisAlignment.Left,
                        autoRange: EAutoRange.Once,
                        labelStyle: { color: "#4ECDC4" },
                        axisTitleStyle: { color: "#4ECDC4" }
                    }
                },
                {
                    type: EAxisType.NumericAxis,
                    options: {
                        id: "fpsYAxis",
                        axisTitle: "FPS",
                        axisAlignment: EAxisAlignment.Right,
                        autoRange: EAutoRange.Once,
                        flippedCoordinates: true,
                        visibleRange: new NumberRange(0, 120),
                        labelStyle: { color: "#A29BFE" },
                        axisTitleStyle: { color: "#A29BFE" }
                    }
                }
            ],
            modifiers: [
                { type: EChart2DModifierType.ZoomExtents },
                { type: EChart2DModifierType.ZoomPan },
                { type: EChart2DModifierType.MouseWheelZoom },
                { type: EChart2DModifierType.SeriesSelection },
                {
                    type: EChart2DModifierType.Legend,
                    options: { orientation: ELegendOrientation.Horizontal, showCheckboxes: true }
                }
            ],
            series
        });

        // const durationAxis = chart.sciChartSurface.yAxes.getById("durationYAxis");
        // const fpsYAxis = chart.sciChartSurface.yAxes.getById("fpsYAxis");

        // durationAxis.visibleRangeChanged.subscribe(() => {
        //     fpsYAxis.visibleRange = new NumberRange(1000 / durationAxis.visibleRange.min, 1000 / durationAxis.visibleRange.max)
        // })

        await chart.sciChartSurface.nextStateRender({
            invalidateOnResume: true,
            resumeBefore: true,
            suspendAfter: false
        });

        return { sciChartSurface: chart.sciChartSurface, wasmContext: chart.wasmContext };
    };

/**
 * Helper function to adjust color brightness
 */
function adjustColorBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}
