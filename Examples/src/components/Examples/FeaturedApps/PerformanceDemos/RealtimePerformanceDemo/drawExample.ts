import { appTheme } from "../../../theme";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";

import {
    EAutoRange,
    EDragMode,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    XAxisDragModifier,
    XyDataSeries,
    YAxisDragModifier,
    ZoomExtentsModifier,
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Define some constants
    const numberOfPointsPerTimerTick = 1000; // 1,000 points every timer tick
    const timerInterval = 10; // timer tick every 10 milliseconds
    const maxPoints = 1e6; // max points for a single series before the demo stops

    // Create a SciChartSurface
    // Note create() uses shared WebGL canvas, createSingle() uses one WebGL per chart
    // createSingle() = faster performance as doesn't require a copy-op, but limited by max-contexts in browser
    const { wasmContext, sciChartSurface } = await SciChartSurface.createSingle(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an XAxis and YAxis with autoRange=Always
    const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    sciChartSurface.yAxes.add(yAxis);

    // Create some DataSeries
    const dataSeries: XyDataSeries[] = [
        new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
        new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
        new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
    ];

    const seriesColors = [appTheme.VividSkyBlue, appTheme.VividOrange, appTheme.VividPink];

    // Create some FastLineRenderableSeries bound to each dataSeries and add to the chart
    dataSeries.map((ds, index) => {
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: ds,
                strokeThickness: 2,
                stroke: seriesColors[index],
            })
        );
    });

    // Add some interactivity modifiers. These are only operational when the demo is paused
    // as interactivity conflicts with AutoRange.Always
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new XAxisDragModifier({ dragMode: EDragMode.Panning }),
        new YAxisDragModifier({ dragMode: EDragMode.Panning }),
        new ZoomExtentsModifier()
    );

    // This class generates some data for our example
    // It generates a random walk, which is a line which increases or decreases by a random value
    // each data-point
    const randomWalkGenerators = [1, 2, 3].map((_) => {
        return new RandomWalkGenerator(0);
    });

    let timerId: NodeJS.Timeout;

    // Function called when the user clicks stopUpdate button
    const stopUpdate = () => {
        clearTimeout(timerId);
        timerId = undefined;
        randomWalkGenerators.forEach((rw) => rw.reset());
        // Disable autoranging on X when the demo is paused. This allows zooming and panning
        xAxis.autoRange = EAutoRange.Once;
    };

    // Function called when the user clicks startUpdate button
    const startUpdate = () => {
        // // tslint:disable-next-line:no-debugger
        // debugger;
        if (timerId) {
            stopUpdate();
        }
        const updateFunc = () => {
            if (dataSeries[0].count() >= maxPoints) {
                stopUpdate();
                return;
            }

            randomWalkGenerators.forEach((randomWalk, index) => {
                // Get the next N random walk x,y values
                const { xValues, yValues } = randomWalk.getRandomWalkSeries(numberOfPointsPerTimerTick);

                // Append these to the dataSeries. This will cause the chart to redraw
                dataSeries[index].appendRange(xValues, yValues);
            });

            timerId = setTimeout(updateFunc, timerInterval);
        };

        // Enable autoranging on X when running the demo
        xAxis.autoRange = EAutoRange.Always;

        dataSeries.forEach((ds) => ds.clear());

        timerId = setTimeout(updateFunc, timerInterval);
    };

    type TRenderStats = { numberPoints: number; fps: number };
    type TOnRenderStatsChangeCallback = (stats: TRenderStats) => void;

    let statsCallback: TOnRenderStatsChangeCallback = () => {};
    const setStatsChangedCallback = (callback: TOnRenderStatsChangeCallback) => {
        statsCallback = callback;
    };

    let lastRendered = Date.now();
    sciChartSurface.rendered.subscribe(() => {
        const currentTime = Date.now();
        const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
        lastRendered = currentTime;
        const fps = 1 / timeDiffSeconds;
        const renderStats = {
            numberPoints:
                sciChartSurface.renderableSeries.size() * sciChartSurface.renderableSeries.get(0).dataSeries.count(),
            fps,
        };

        statsCallback(renderStats);
    });

    return { wasmContext, sciChartSurface, controls: { startUpdate, stopUpdate, setStatsChangedCallback } };
};
