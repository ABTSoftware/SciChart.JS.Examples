import {
    EAxisAlignment,
    EAutoRange,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EAnnotationLayer,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { appTheme } from "../../../theme";

export type TTimeSpan = {
    title: string;
    durationMs: number;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            visibleRange: new NumberRange(0, 1000000),
            autoRange: EAutoRange.Never,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-5000, 5000),
            autoRange: EAutoRange.Never,
            axisTitle: "Y Axis",
        })
    );

    const watermarkAnnotation = (text: string, offset: number = 0) => {
        return new TextAnnotation({
            text,
            fontSize: 42,
            fontWeight: "Bold",
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0.5,
            yCoordShift: offset,
            opacity: 0.33,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart,
        });
    };
    // add a title annotation
    sciChartSurface.annotations.add(watermarkAnnotation("SciChart.js Performance Demo"));
    sciChartSurface.annotations.add(watermarkAnnotation("1 Million Data-Points", 52));

    const dataSeries = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 2,
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Buttons for chart
    const loadPoints = (updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => {
        // Clear state
        dataSeries.clear();
        const newTimeSpans: TTimeSpan[] = [];

        // Start clouting Points generation time
        const generateTimestamp = Date.now();

        const POINTS = 1_000_000;
        const xValues = new Float64Array(POINTS);
        const yValues = new Float64Array(POINTS);
        let prevYValue = 0;
        for (let i = 0; i < POINTS; i++) {
            const curYValue = Math.random() * 10 - 5;

            xValues[i] = i;
            yValues[i] = prevYValue + curYValue;

            prevYValue += curYValue;
        }

        // Add the first time span: Generating 1M data points
        newTimeSpans.push({
            title: "Generate 1M Data Points",
            durationMs: Date.now() - generateTimestamp,
        });

        // Start counting batch append time
        const appendTimestamp = Date.now();
        dataSeries.appendRange(xValues, yValues);

        // Add the second time span: Generation of data point
        newTimeSpans.push({
            title: "Append 1M Data Points",
            durationMs: Date.now() - appendTimestamp,
        });

        // Subscribe to sciChartSurface.rendered event,
        // and calculate time duration between the append and
        // the first frame after it
        const firstFrameTimestamp = Date.now();
        let frameIndex: number = 0;
        let nextFramesTimestamp: number;
        const handler = () => {
            if (frameIndex === 0) {
                // Add the third time span: Render the first frame
                newTimeSpans.push({
                    title: "Render the frame",
                    durationMs: Date.now() - firstFrameTimestamp,
                });
                nextFramesTimestamp = Date.now();
            } else {
                // Unsubscribe from sciChartSurface.rendered
                updateTimeSpans(newTimeSpans);
                sciChartSurface.rendered.unsubscribe(handler);

                // Zoom extents at the end of performance measurement
                sciChartSurface.zoomExtents(250);
            }
            setTimeout(sciChartSurface.invalidateElement, 0);
            // Increment frame index
            frameIndex++;
        };
        sciChartSurface.rendered.subscribe(handler);
    };

    return { sciChartSurface, controls: { loadPoints } };
};
