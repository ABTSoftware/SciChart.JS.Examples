import {
    chartBuilder,
    EAxisType,
    ELabelProviderType,
    EAxisAlignment,
    NumberRange,
    ESeriesType,
    GradientParams,
    EPointMarkerType,
    EAnnotationType,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EChart2DModifierType,
    Point,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
export const drawExample = async (rootElement) => {
    // Create a chart using the Builder-API, an api that allows defining a chart
    // with javascript-objects or JSON
    return await chartBuilder.build2DChart(rootElement, {
        // Set theme
        surface: { theme: appTheme.SciChartJsTheme },
        // Add XAxis
        xAxes: [
            {
                type: EAxisType.CategoryAxis,
                options: {
                    axisTitle: "X Axis Title",
                    labelProvider: {
                        type: ELabelProviderType.Text,
                        options: {
                            labels: { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" },
                        },
                    },
                },
            },
        ],
        // Add multiple Y-Axis
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "y1",
                    axisTitle: "Left Axis",
                    axisAlignment: EAxisAlignment.Left,
                    visibleRange: new NumberRange(0, 20),
                    zoomExtentsToInitialRange: true,
                },
            },
            {
                type: EAxisType.NumericAxis,
                options: {
                    id: "y2",
                    axisTitle: "Right Axis",
                    axisAlignment: EAxisAlignment.Right,
                    visibleRange: new NumberRange(0, 800),
                    labelPrecision: 0,
                    zoomExtentsToInitialRange: true,
                },
            },
        ],
        // Add series. More than one can be set in an array
        series: [
            {
                // each series has type, options in the builder-API
                type: ESeriesType.SplineMountainSeries,
                options: {
                    yAxisId: "y1",
                    stroke: appTheme.VividSkyBlue,
                    strokeThickness: 5,
                    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: appTheme.VividTeal, offset: 0.2 },
                        { color: "Transparent", offset: 1 },
                    ]),
                },
                xyData: { xValues: [1, 2, 3, 4, 5], yValues: [8, 6, 7, 2, 16] },
            },
            {
                type: ESeriesType.BubbleSeries,
                options: {
                    yAxisId: "y2",
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 100,
                            height: 100,
                            strokeThickness: 10,
                            fill: appTheme.PaleSkyBlue,
                            stroke: appTheme.VividSkyBlue,
                        },
                    },
                },
                xyzData: {
                    xValues: [1, 2, 3, 4, 5],
                    yValues: [320, 240, 280, 80, 640],
                    zValues: [20, 40, 20, 30, 35],
                },
            },
        ],
        // Add annotations
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: { text: "Labels", yAxisId: "y1", x1: 0, y1: 10, yCoordinateMode: ECoordinateMode.DataValue },
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "can be placed",
                    yAxisId: "y1",
                    x1: 1,
                    y1: 8,
                    yCoordinateMode: ECoordinateMode.DataValue,
                },
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "on the chart",
                    yAxisId: "y1",
                    x1: 2,
                    y1: 9,
                    yCoordinateMode: ECoordinateMode.DataValue,
                },
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Builder API Demo",
                    x1: 0.5,
                    y1: 0.5,
                    opacity: 0.33,
                    yCoordShift: -52,
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
                    yCoordShift: 0,
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
        // Add interaction (zooming, panning, tooltips)
        modifiers: [
            {
                type: EChart2DModifierType.Rollover,
                options: {
                    yAxisId: "y1",
                    rolloverLineStroke: appTheme.VividTeal,
                },
            },
            { type: EChart2DModifierType.MouseWheelZoom },
            { type: EChart2DModifierType.ZoomExtents },
        ],
    });
};
