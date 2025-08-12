import * as SciChart from "scichart";

// #region ExampleA
const {
    BoxAnnotation,
    CustomAnnotation,
    LineAnnotation,
    TextAnnotation,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    SciChartJsNavyTheme
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        // Add TextAnnotations in the top left of the chart
        new TextAnnotation({
            text: "Annotations are Easy!",
            fontSize: 24,
            x1: 0.3,
            y1: 9.7
        }),
        new TextAnnotation({
            text: "You can create text",
            fontSize: 18,
            x1: 1,
            y1: 9
        }),

        // Add TextAnnotations with anchor points
        new TextAnnotation({
            text: "Anchor Center (X1, Y1)",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            x1: 2,
            y1: 8
        }),
        new TextAnnotation({
            text: "Anchor Right",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            x1: 2,
            y1: 8
        }),
        new TextAnnotation({
            text: "or Anchor Left",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            x1: 2,
            y1: 8
        })
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
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Annotations are Easy!",
                    fontSize: 24,
                    x1: 0.3,
                    y1: 9.7
                }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "You can create text",
                    fontSize: 18,
                    x1: 1,
                    y1: 9
                }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Anchor Center (X1, Y1)",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                    x1: 2,
                    y1: 8
                }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Anchor Right",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                    verticalAnchorPoint: EVerticalAnchorPoint.Top,
                    x1: 2,
                    y1: 8
                }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "or Anchor Left",
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                    verticalAnchorPoint: EVerticalAnchorPoint.Top,
                    x1: 2,
                    y1: 8
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
