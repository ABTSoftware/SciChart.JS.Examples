import * as SciChart from "scichart";

// #region ExampleA
const {
    BoxAnnotation,
    CustomAnnotation,
    LineArrowAnnotation,
    TextAnnotation,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    SciChartJsNavyTheme,
    EDraggingGripPoint
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        new TextAnnotation({
            fontSize: 16,
            text: "In SciChart.js, you can add arbitrary arrow lines",
            x1: 0.3,
            y1: 6.3
        }),

        new LineArrowAnnotation({
            id: "regular_editable",
            stroke: "#3399FF",
            strokeThickness: 3,
            x1: 1,
            x2: 6,
            y1: 1,
            y2: 8,
            isEditable: true,
            isSelected: true,
            arrowHeadPosition: SciChart.EArrowHeadPosition.End, // only show arrow head at the end
            dragPoints: [SciChart.EDraggingGripPoint.x2y2], // only allow dragging by the end point
            isArrowHeadScalable: true,
            arrowStyle: {
                headLength: 25,
                headWidth: 25,
                headDepth: 0.7,
                fill: "#113388",
                stroke: "#3399FF",
                strokeThickness: 3
            },
        }),
        new LineArrowAnnotation({
            id: "double_ended",
            stroke: "#FF6600",
            strokeThickness: 3,
            x1: 2,
            x2: 7,
            y1: 1,
            y2: 8,
            arrowHeadPosition: SciChart.EArrowHeadPosition.StartEnd, // show arrow heads on both ends
            arrowStyle: {
                headLength: 25,
                headWidth: 25,
                headDepth: 1,
                fill: "#883300",
                stroke: "#FF6600",
                strokeThickness: 3
            }
        }),
        new LineArrowAnnotation({
            id: "reverse_arrow",
            stroke: "#66FF00",
            strokeThickness: 3,
            x1: 3,
            x2: 8,
            y1: 1,
            y2: 8,
            arrowHeadPosition: SciChart.EArrowHeadPosition.Start,
            arrowStyle: {
                headLength: 25,
                headWidth: 25,
                headDepth: 0,
                stroke: "#66FF00",
                strokeThickness: 3
            }
        }),
        new LineArrowAnnotation({
            id: "double_ended_dashed_rhombus",
            stroke: "#FF0077",
            strokeThickness: 3,
            x1: 4,
            x2: 9,
            y1: 1,
            y2: 8,
            strokeDashArray: [5, 5],
            arrowHeadPosition: SciChart.EArrowHeadPosition.StartEnd, // show arrow heads on both ends
            arrowStyle: {
                headLength: 25,
                headWidth: 25,
                headDepth: 3,
                fill: "#880044",
                stroke: "#FF0077",
                strokeThickness: 3
            }
        }),
    );
}

addAnnotationToChart("scichart-root");
// #endregion

async function builderExample(divElementId) {
    // #region ExampleB
    const { chartBuilder, EAnnotationType } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "regular_editable",
                    stroke: "#3399FF",
                    strokeThickness: 3,
                    x1: 1,
                    x2: 6,
                    y1: 1,
                    y2: 8,
                    isEditable: true,
                    isSelected: true,
                    arrowHeadPosition: SciChart.EArrowHeadPosition.End, // only show arrow head at the end
                    dragPoints: [SciChart.EDraggingGripPoint.x2y2], // only allow dragging by the end point
                    isArrowHeadScalable: true,
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 0.7,
                        fill: "#113388",
                        stroke: "#3399FF",
                        strokeThickness: 3
                    }
                }
            },
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "double_ended",
                    stroke: "#FF6600",
                    strokeThickness: 3,
                    x1: 2,
                    x2: 7,
                    y1: 1,
                    y2: 8,
                    arrowHeadPosition: SciChart.EArrowHeadPosition.StartEnd, // show arrow heads on both ends
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 1,
                        fill: "#883300",
                        stroke: "#FF6600",
                        strokeThickness: 3
                    }
                }
            },
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "reverse_arrow",
                    stroke: "#66FF00",
                    strokeThickness: 3,
                    x1: 3,
                    x2: 8,
                    y1: 1,
                    y2: 8,
                    arrowHeadPosition: SciChart.EArrowHeadPosition.Start,
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 0,
                        stroke: "#66FF00",
                        strokeThickness: 3
                    }
                }
            },
            {
                type: EAnnotationType.LineArrowAnnotation,
                options: {
                    id: "double_ended_dashed_rhombus",
                    stroke: "#FF0077",
                    strokeThickness: 3,
                    x1: 4,
                    x2: 9,
                    y1: 1,
                    y2: 8,
                    strokeDashArray: [5, 5],
                    arrowHeadPosition: SciChart.EArrowHeadPosition.StartEnd, // show arrow heads on both ends
                    arrowStyle: {
                        headLength: 25,
                        headWidth: 25,
                        headDepth: 3,
                        fill: "#880044",
                        stroke: "#FF0077",
                        strokeThickness: 3
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
