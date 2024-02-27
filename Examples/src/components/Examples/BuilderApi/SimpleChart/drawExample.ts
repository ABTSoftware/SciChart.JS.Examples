import {
    SciChartSurface,
    ESeriesType,
    EAxisType,
    EAnimationType,
    NumberRange,
    EAnnotationType,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
} from "scichart";
import { chartBuilder } from "scichart";
import { appTheme } from "scichart-example-dependencies";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a chart using the Builder-API, an api that allows defining a chart
    // with javascript-objects or JSON
    return await chartBuilder.build2DChart(rootElement, {
        // Set theme
        surface: { theme: appTheme.SciChartJsTheme },
        // Add xAxis
        xAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) } },
        // Add yAxis
        yAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) } },
        // Add series. More than one can be set in an array
        series: [
            {
                // each series has type, options in the builder-API
                type: ESeriesType.SplineLineSeries,
                options: {
                    strokeThickness: 5,
                    interpolationPoints: 20,
                    stroke: appTheme.VividTeal,
                    animation: { type: EAnimationType.Sweep, options: { duration: 500 } },
                },
                xyData: {
                    xValues: [1, 3, 4, 7, 9],
                    yValues: [10, 6, 7, 2, 16],
                },
            },
        ],
        // Add annotations
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Builder API Demo",
                    x1: 0.5,
                    y1: 0.5,
                    opacity: 0.33,
                    yCoordShift: -26,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    fontSize: 42,
                    fontWeight: "Bold",
                },
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Create SciChart charts with JSON Objects",
                    x1: 0.5,
                    y1: 0.5,
                    yCoordShift: 26,
                    opacity: 0.33,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    fontSize: 36,
                    fontWeight: "Bold",
                },
            },
        ],
    });
};
