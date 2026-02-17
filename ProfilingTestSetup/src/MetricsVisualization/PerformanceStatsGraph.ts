import {
    chartBuilder,
    EAxisAlignment,
    EAxisType,
    EChart2DModifierType,
    ELineDrawMode,
    EPointMarkerType,
    ESeriesType,
    ESubSurfacePositionCoordinateMode,
    Guard,
    ISubChartDefinition,
    NumberRange,
    Rect,
    TSeriesDefinition
} from "scichart";
import { TBrowserAnimationFrameData, TCollectedPerformanceData } from "../types";
import { FramePaletteProvider } from "./FramePaletteProvider";
import { FpsLabelProvider } from "./FpsLabelProvider";

export const drawPerformanceStatsGraph =
    (
        performanceData: TCollectedPerformanceData[],
        browserAnimationFrameData: TBrowserAnimationFrameData
    ) =>
    async (rootElement: HTMLDivElement | string) => {
        const subCharts = performanceData.map((dataEntry, subSurfaceIndex, collection) => {
            const {
                id,
                dataGenerationStart,
                dataUpdateStart,
                dataUpdateEnd,
                preRenderStart,
                renderToWebGl,
                renderEnd,
                framePainted
            } = dataEntry;
            Guard.arraysSameLengthArr([
                { arg: preRenderStart, name: "preRenderStart" },
                { arg: renderToWebGl, name: "renderToWebGl" },
                { arg: renderEnd, name: "renderEnd" },
                { arg: framePainted, name: "framePainted" }
            ]);
            Guard.arraysSameLengthArr([
                { arg: dataGenerationStart, name: "dataGenerationStart" },
                { arg: dataUpdateStart, name: "dataUpdateStart" },
                { arg: dataUpdateEnd, name: "dataUpdateEnd" }
            ]);

            const dataGenerationDurationData = dataUpdateStart.map(
                (updateStart, i) => updateStart - dataGenerationStart[i]
            );
            const dataUpdateDurationData = dataUpdateEnd.map(
                (updateEnd, i) => updateEnd - dataUpdateStart[i]
            );

            const timeDifferences = mapGenerationStartToClosestFrameEndDiff(
                dataGenerationStart,
                framePainted
            );

            const timeBetweenPaints = framePainted.map((current, index, collection) => {
                if (index === 0) {
                    return NaN;
                }

                const prev = collection[index - 1];
                return current - prev;
            });

            const fpsData = timeBetweenPaints.map(duration => duration);

            const dataGenerationFromLastFrame = dataGenerationDurationData.map(
                (diff, i) => timeDifferences[i] + diff
            );

            const dataGenerationSegments = dataGenerationStart.flatMap((start, i) => [
                start,
                dataUpdateStart[i]
            ]);

            const dataGenerationSeries: TSeriesDefinition = {
                type: ESeriesType.BandSeries,
                options: {
                    drawNaNAs: ELineDrawMode.DiscontinuousLine,
                    stroke: "#FF6B6B",
                    fill: "#FF6B6B",
                    strokeY1: "#FF6B6B",
                    fillY1: "#FF6B6B",
                    opacity: 1, // these are short and barely visible usually
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: { height: 8, width: 8, fill: "#FF6B6B" }
                    }
                },
                xyyData: {
                    dataSeriesName: "dataGeneration",
                    xValues: dataGenerationSegments,
                    yValues: timeDifferences.flatMap(x => [x, x]),
                    y1Values: dataGenerationFromLastFrame.flatMap(x => [x, x])
                }
            };

            const dataUpdateSeries: TSeriesDefinition = {
                type: ESeriesType.BandSeries,
                options: {
                    stroke: "#4ECDC4",
                    fill: "#4ECDC4",
                    opacity: 0.5,
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: { height: 8, width: 8, fill: "#4ECDC4" }
                    }
                },
                xyyData: {
                    dataSeriesName: "dataUpdate",
                    xValues: dataUpdateStart.flatMap((start, i) => [start, dataUpdateEnd[i]]),
                    yValues: dataGenerationDurationData.flatMap((diff, i) => [
                        timeDifferences[i] + diff,
                        timeDifferences[i] + diff
                    ]),
                    y1Values: dataUpdateDurationData.flatMap((diff, i) => [
                        dataGenerationFromLastFrame[i] + diff,
                        dataGenerationFromLastFrame[i] + diff
                    ])
                }
            };

            const preRenderSinceLastFrame = preRenderStart.map((end, i) =>
                i ? end - framePainted[i - 1] : NaN
            );
            const renderWebGlSinceLastFrame = renderToWebGl.map((end, i) =>
                i ? end - framePainted[i - 1] : NaN
            );
            const renderSinceLastFrame = renderEnd.map((end, i) =>
                i ? end - framePainted[i - 1] : NaN
            );
            const paintSinceLastFrame = framePainted.map((end, i) =>
                i ? end - framePainted[i - 1] : NaN
            );

            const dataRenderToWebGlSeries: TSeriesDefinition = {
                type: ESeriesType.BandSeries,
                options: {
                    stroke: "#45B7D1",
                    fill: "#45B7D1",
                    opacity: 0.5,
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: { height: 8, width: 8, fill: "#45B7D1" }
                    }
                },
                xyyData: {
                    dataSeriesName: "render to webgl",
                    xValues: preRenderStart.flatMap((start, i) => [start, renderToWebGl[i]]),
                    yValues: preRenderSinceLastFrame.flatMap(x => [x, x]),
                    y1Values: renderWebGlSinceLastFrame.flatMap(x => [x, x])
                }
            };

            const dataRenderSeries: TSeriesDefinition = {
                type: ESeriesType.BandSeries,
                options: {
                    stroke: "#96CEB4",
                    fill: "#96CEB4",
                    opacity: 0.5,
                    strokeThickness: 2
                    // pointMarker: {
                    //     type: EPointMarkerType.Ellipse,
                    //     options: { height: 8, width: 8, fill: "#96CEB4" }
                    // }
                },
                xyyData: {
                    dataSeriesName: "render",
                    xValues: preRenderStart.flatMap((start, i) => [start, renderEnd[i]]),
                    yValues: preRenderSinceLastFrame.flatMap(x => [x, x]),
                    y1Values: renderSinceLastFrame.flatMap(x => [x, x])
                }
            };

            const dataCopySeries: TSeriesDefinition = {
                type: ESeriesType.BandSeries,
                options: {
                    stroke: "#deab01ff",
                    fill: "#deab01ff",
                    opacity: 1,
                    strokeThickness: 2
                    // pointMarker: {
                    //     type: EPointMarkerType.Ellipse,
                    //     options: { height: 8, width: 8, fill: "#FFEAA7" }
                    // }
                },
                xyyData: {
                    dataSeriesName: "copy to canvas",
                    xValues: renderToWebGl.flatMap((start, i) => [start, renderEnd[i]]),
                    yValues: renderWebGlSinceLastFrame.flatMap(x => [x, x]),
                    y1Values: renderSinceLastFrame.flatMap(x => [x, x])
                }
            };

            const dataPaintSeries: TSeriesDefinition = {
                type: ESeriesType.MountainSeries,
                options: {
                    stroke: "#DFE6E9",
                    fill: "#DFE6E9",
                    paletteProvider: new FramePaletteProvider(),
                    opacity: 0.5,
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: { height: 8, width: 8, fill: "#DFE6E9" }
                    }
                },
                xyData: {
                    dataSeriesName: "paint",
                    xValues: framePainted,
                    yValues: paintSinceLastFrame
                }
            };

            const { animationFrameStartTimestamps, animationFrameEndTimestamps } =
                browserAnimationFrameData;

            const animationFrameStartSinceLastFrame = animationFrameStartTimestamps.map(
                (start, i) => (i ? start - animationFrameStartTimestamps[i - 1] : NaN)
            );

            const dataAnimationFrameStartSeries: TSeriesDefinition = {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: "#7d69ffff",
                    opacity: 0.7,
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Triangle,
                        options: { height: 8, width: 8, fill: "#7d69ffff" }
                    }
                },
                xyData: {
                    dataSeriesName: "animationFrameStart",
                    xValues: animationFrameStartTimestamps,
                    yValues: animationFrameStartSinceLastFrame
                }
            };

            const animationFrameEndSinceLastFrame = animationFrameEndTimestamps.map((end, i) =>
                i ? end - animationFrameEndTimestamps[i - 1] : NaN
            );

            const dataAnimationFrameEndSeries: TSeriesDefinition = {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: "#FF1493",
                    opacity: 0.7,
                    strokeThickness: 2,
                    pointMarker: {
                        type: EPointMarkerType.Triangle,
                        options: { height: 8, width: 8, fill: "#FF1493" }
                    }
                },
                xyData: {
                    dataSeriesName: "animationFrameEnd",
                    xValues: animationFrameEndTimestamps,
                    yValues: animationFrameEndSinceLastFrame
                }
            };

            const fpsSeries: TSeriesDefinition = {
                type: ESeriesType.LineSeries,
                options: {
                    stroke: "#A29BFE",
                    opacity: 0.5,
                    strokeThickness: 2,
                    yAxisId: "fpsYAxis",
                    pointMarker: {
                        type: EPointMarkerType.Square,
                        options: { height: 8, width: 8, fill: "#A29BFE" }
                    }
                },
                xyData: {
                    dataSeriesName: "fps",
                    xValues: preRenderStart,
                    yValues: fpsData
                }
            };

            const series: TSeriesDefinition[] = [
                dataPaintSeries,
                dataAnimationFrameStartSeries,
                dataAnimationFrameEndSeries,
                dataGenerationSeries,
                dataUpdateSeries,
                dataRenderToWebGlSeries,
                dataRenderSeries,
                dataCopySeries
                // fpsSeries
            ];

            const numberOfSubCharts = collection.length;
            const heightPerSubChart = 1 / numberOfSubCharts;

            const subSurface: ISubChartDefinition = {
                // surface: {
                //     coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
                //     position: new Rect(0, subSurfaceIndex * heightPerSubChart, 1, heightPerSubChart)
                // },
                yAxes: [
                    {
                        type: EAxisType.NumericAxis,
                        options: {
                            id: "durationYAxis",
                            axisTitle: "Duration (ms)",
                            axisAlignment: EAxisAlignment.Left,
                            growBy: new NumberRange(0, 0)
                        }
                    },
                    {
                        type: EAxisType.NumericAxis,
                        options: {
                            id: "fpsYAxis",
                            axisTitle: "FPS",
                            axisAlignment: EAxisAlignment.Right,
                            growBy: new NumberRange(0, 0),
                            flippedCoordinates: false,
                            // visibleRange: new NumberRange(0, 240),
                            labelStyle: {
                                color: "#A29BFE"
                            },
                            axisTitleStyle: {
                                color: "#A29BFE"
                            },
                            labelProvider: new FpsLabelProvider()
                        }
                    }
                ],
                modifiers: [
                    {
                        type: EChart2DModifierType.Legend,
                        options: { showCheckboxes: true, showLegend: true, showSeriesMarkers: true }
                    },
                    {
                        type: EChart2DModifierType.ZoomExtents,
                        options: { includedYAxisIds: ["durationYAxis"] }
                    },
                    {
                        type: EChart2DModifierType.MouseWheelZoom,
                        options: { includedYAxisIds: ["durationYAxis"] }
                    },
                    {
                        type: EChart2DModifierType.ZoomPan,
                        options: { includedYAxisIds: ["durationYAxis"] }
                    },
                    { type: EChart2DModifierType.SeriesSelection },
                    { type: EChart2DModifierType.Cursor, options: { showTooltip: false } }
                ],
                series
            };

            return subSurface;
        });

        const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(rootElement, {
            surface: { createSuspended: true, loader: false, disableAspect: false },
            // xAxes: { type: EAxisType.NumericAxis, options: { isVisible: false } },
            // yAxes: { type: EAxisType.NumericAxis, options: { isVisible: false } },
            ...subCharts[0]
        });

        // sciChartSurface.subCharts.forEach(subChart => {
        //     const durationAxis = subChart.yAxes.getById("durationYAxis");
        //     const fpsAxis = subChart.yAxes.getById("fpsYAxis");

        //     durationAxis.visibleRangeChanged.subscribe(() => {
        //         fpsAxis.visibleRange = new NumberRange(
        //             1000 / durationAxis.visibleRange.max,
        //             1000 / durationAxis.visibleRange.min
        //         );
        //     });
        // });

        const durationAxis = sciChartSurface.yAxes.getById("durationYAxis");
        const fpsAxis = sciChartSurface.yAxes.getById("fpsYAxis");

        durationAxis.visibleRangeChanged.subscribe(() => {
            fpsAxis.visibleRange = new NumberRange(
                durationAxis.visibleRange.min,
                durationAxis.visibleRange.max
            );
            // fpsAxis.visibleRange = new NumberRange(
            //     1000 / durationAxis.visibleRange.max,
            //     1000 / durationAxis.visibleRange.min
            // );
        });

        await sciChartSurface.nextStateRender({
            invalidateOnResume: true,
            resumeBefore: true,
            suspendAfter: false
        });
        await sciChartSurface.nextStateRender({
            invalidateOnResume: true,
            resumeBefore: true,
            suspendAfter: false
        });

        return { sciChartSurface };
    };

/**
 * Maps each generation start timestamp to the time difference between it and the closest
 * preceding frameEnd timestamp. If no frameEnd occurred before a generation start,
 * returns NaN for that entry.
 *
 * @param dataGenerationStart - Array of generation start timestamps
 * @param frameEnd - Array of frame end timestamps (may be shorter than dataGenerationStart)
 * @returns Array of time differences (in same units as input timestamps)
 */
function mapGenerationStartToClosestFrameEndDiff(
    dataGenerationStart: number[],
    frameEnd: number[]
): number[] {
    return dataGenerationStart.map(startTimestamp => {
        // Find the closest frameEnd that occurred before this generation start
        let closestFrameEnd: number | null = null;

        for (let i = frameEnd.length - 1; i >= 0; i--) {
            if (frameEnd[i] <= startTimestamp) {
                closestFrameEnd = frameEnd[i];
                break;
            }
        }

        // If no frameEnd occurred before this start, return NaN
        if (closestFrameEnd === null) {
            return NaN;
        }

        // Return the difference
        return startTimestamp - closestFrameEnd;
    });
}
