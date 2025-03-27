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
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(2, 8) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(2, 8) }));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        new TextAnnotation({ fontSize: 12, text: "Draw Boxes", x1: 3.3, y1: 6.3 }),

        new BoxAnnotation({
            fill: "#279B2755",
            stroke: "#279B27",
            strokeThickness: 1,
            x1: 3.5,
            x2: 5,
            y1: 4,
            y2: 5,
        }),
        new BoxAnnotation({
            fill: "#FF191955",
            stroke: "#FF1919",
            strokeThickness: 1,
            x1: 4,
            x2: 5.5,
            y1: 4.5,
            y2: 5.5,
        }),
        new BoxAnnotation({
            fill: "#1964FF55",
            stroke: "#1964FF",
            strokeThickness: 1,
            x1: 4.5,
            x2: 6,
            y1: 5,
            y2: 6,
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
                    text: "Draw Boxes",
                    x1: 3.3,
                    y1: 6.3,
                },
            },
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    fill: "#279B2755",
                    stroke: "#279B27",
                    strokeThickness: 1,
                    x1: 3.5,
                    x2: 5,
                    y1: 4,
                    y2: 5,
                },
            },
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    fill: "#FF191955",
                    stroke: "#FF1919",
                    strokeThickness: 1,
                    x1: 4,
                    x2: 5.5,
                    y1: 4.5,
                    y2: 5.5,
                },
            },
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    fill: "#1964FF55",
                    stroke: "#1964FF",
                    strokeThickness: 1,
                    x1: 4.5,
                    x2: 6,
                    y1: 5,
                    y2: 6,
                },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
