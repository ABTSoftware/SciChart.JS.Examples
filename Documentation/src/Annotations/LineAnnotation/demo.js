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
    SciChartJsNavyTheme,
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        new TextAnnotation({
            fontSize: 16,
            text: "In SciChart.js, you can add arbitrary lines",
            x1: 0.3,
            y1: 6.3,
        }),

        new LineAnnotation({
            stroke: "#3399FF",
            strokeThickness: 3,
            x1: 1,
            x2: 6,
            y1: 1,
            y2: 8,
        }),
        new LineAnnotation({
            stroke: "#FF6600",
            strokeThickness: 3,
            strokeDashArray: [5, 5],
            x1: 1.5,
            x2: 8,
            y1: 1,
            y2: 7,
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
                    fontSize: 12,
                    text: "You can draw lines",
                    x1: 0.3,
                    y1: 6.3,
                },
            },
            {
                type: EAnnotationType.RenderContextLineAnnotation,
                options: {
                    stroke: "#3399FF",
                    strokeThickness: 3,
                    x1: 1,
                    x2: 2,
                    y1: 4,
                    y2: 6,
                },
            },
            {
                type: EAnnotationType.RenderContextLineAnnotation,
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 3,
                    strokeDashArray: [5, 5],
                    x1: 1.2,
                    x2: 2.5,
                    y1: 3.8,
                    y2: 6,
                },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
