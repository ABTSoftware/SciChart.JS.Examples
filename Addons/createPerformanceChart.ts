import {
    ECoordinateMode,
    FastMountainRenderableSeries,
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy
} from "scichart";
import { HorizontalLineAnnotation } from "scichart";
import { AxisMarkerAnnotation } from "scichart";
import {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    EAutoRange,
    NumberRange,
    EAxisAlignment,
    ENumericFormat
} from "scichart";

export interface PerformanceChartApi {
    sciChartSurface: SciChartSurface;
    addRenderTimePoint: (time: number) => void;
    addTimeSinceLastPaintPoint: (time: number) => void;
    addFpsPoint: (fps: number) => void;
    clear: () => void;
    delete: () => Promise<void>;
}

export const createPerformanceChart = async (sciChartSurface: SciChartSurface): Promise<PerformanceChartApi> => {
    const maxDataPoints = 1000;
    let frameIndex = 0;
    const wasmContext = sciChartSurface.webAssemblyContext2D;

    // Create X axis (frame index)
    const xAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        axisTitle: "Frame",
        autoRange: EAutoRange.Always,
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create Y axis for render time (left)
    const yAxisRenderTimeLeft = new NumericAxis(wasmContext, {
        id: "renderTimeAxisLeft",
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1),
        drawLabels: true,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        labelStyle: {
            color: "white",
            fontFamily: "Default",
            fontSize: 8
        },
        axisBorder: {
            color: "white",
            borderBottom: 1
        },
        majorTickLineStyle: {
            color: "white",
            strokeThickness: 1,
            tickSize: 3
        }
    });
    const yAxisRenderTimeRight = new NumericAxis(wasmContext, {
        id: "renderTimeAxisRight",
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.1, 0.1),
        axisThickness: 150,
        drawLabels: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });

    yAxisRenderTimeRight.visibleRangeChanged.subscribe(() => {
        yAxisRenderTimeLeft.visibleRange = yAxisRenderTimeRight.visibleRange;
    });

    sciChartSurface.yAxes.add(yAxisRenderTimeLeft, yAxisRenderTimeRight);

    const yAxisFpsLeft = new NumericAxis(wasmContext, {
        id: "yAxisFpsLeft",
        // axisTitle: "FPS",
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1),
        drawLabels: true,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
            fontFamily: "Default",
            fontSize: 8
        },
        axisBorder: {
            color: "white",
            borderBottom: 1
        },
        majorTickLineStyle: {
            color: "white",
            strokeThickness: 1,
            tickSize: 3
        }
    });
    const yAxisFpsRight = new NumericAxis(wasmContext, {
        // isVisible: false,

        id: "yAxisFpsRight",
        // axisTitle: "FPS",
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.1, 0.1),
        axisThickness: 130,
        drawLabels: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false
    });

    yAxisFpsRight.visibleRangeChanged.subscribe(() => {
        yAxisFpsLeft.visibleRange = yAxisFpsRight.visibleRange;
    });

    sciChartSurface.yAxes.add(yAxisFpsLeft, yAxisFpsRight);

    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy =
        new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

    // Create data series for render time
    const renderTimeDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Render Time",
        fifoCapacity: maxDataPoints
    });

    // Create data series for time since last paint
    const timeSinceLastPaintDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Time Since Last Paint",
        fifoCapacity: maxDataPoints
    });

    // Create data series for FPS
    const fpsDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "FPS",
        fifoCapacity: maxDataPoints
    });

    // Create stacked mountain series for render time and time since last paint
    const renderTimeMountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: renderTimeDataSeries,
        fill: "rgba(255, 107, 107, 0.5)",
        stroke: "#FF6B6B",
        strokeThickness: 2,
        yAxisId: yAxisRenderTimeRight.id
    });

    const timeSinceLastPaintMountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: timeSinceLastPaintDataSeries,
        fill: "rgba(255, 183, 77, 0.5)",
        stroke: "#FFB74D",
        strokeThickness: 2,
        yAxisId: yAxisRenderTimeRight.id
    });

    sciChartSurface.renderableSeries.add(timeSinceLastPaintMountainSeries, renderTimeMountainSeries);

    // Create FPS line series
    const fpsSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: fpsDataSeries,
        stroke: "#4ECDC4",
        strokeThickness: 2,
        yAxisId: yAxisFpsRight.id
    });
    sciChartSurface.renderableSeries.add(fpsSeries);

    const horizontalAnnotation = new HorizontalLineAnnotation({
        yAxisId: yAxisFpsRight.id,
        y1: 0,
        yCoordinateMode: ECoordinateMode.Relative,
        stroke: "white"
    });

    const renderTimeAxisLabelAnnotation = new AxisMarkerAnnotation({
        y1: 0,
        yAxisId: yAxisRenderTimeRight.id,
        backgroundColor: renderTimeMountainSeries.stroke
    });

    const timeSinceLastPaintAxisLabelAnnotation = new AxisMarkerAnnotation({
        y1: 0,
        yAxisId: yAxisRenderTimeRight.id,
        backgroundColor: timeSinceLastPaintMountainSeries.stroke
    });

    const fpsAxisLabelAnnotation = new AxisMarkerAnnotation({
        y1: 0,
        yAxisId: yAxisFpsRight.id,
        backgroundColor: fpsSeries.stroke
    });

    sciChartSurface.annotations.add(
        horizontalAnnotation,
        renderTimeAxisLabelAnnotation,
        timeSinceLastPaintAxisLabelAnnotation,
        fpsAxisLabelAnnotation
    );

    // API functions
    const addRenderTimePoint = (time: number) => {
        renderTimeDataSeries.append(frameIndex, time);
        frameIndex++;
        renderTimeAxisLabelAnnotation.y1 = time;
        renderTimeAxisLabelAnnotation.formattedValue = `Render ${time.toFixed(2)}ms`;
    };

    const addTimeSinceLastPaintPoint = (time: number) => {
        timeSinceLastPaintDataSeries.append(frameIndex - 1, time);
        timeSinceLastPaintAxisLabelAnnotation.y1 = time;
        timeSinceLastPaintAxisLabelAnnotation.formattedValue = `Paint Interval ${time.toFixed(2)}ms`;
    };

    const addFpsPoint = (fps: number) => {
        fpsDataSeries.append(frameIndex - 1, fps);
        if (fps) {
            fpsAxisLabelAnnotation.y1 = fps;
            fpsAxisLabelAnnotation.formattedValue = `FPS ${fps.toFixed(2)}`;
        }
    };

    const clear = () => {
        renderTimeDataSeries.clear();
        timeSinceLastPaintDataSeries.clear();
        fpsDataSeries.clear();
        frameIndex = 0;
    };

    const deleteFn = async () => {
        sciChartSurface.delete();
    };

    return {
        sciChartSurface,
        addRenderTimePoint,
        addTimeSinceLastPaintPoint,
        addFpsPoint,
        clear,
        delete: deleteFn
    };
};
