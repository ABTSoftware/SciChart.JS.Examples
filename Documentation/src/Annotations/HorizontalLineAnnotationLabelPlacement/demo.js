import * as SciChart from "scichart";

const { HorizontalLineAnnotation, NumericAxis, SciChartSurface, ELabelPlacement, SciChartJsNavyTheme } = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleA
    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        // Vertically line stretched across the viewport, showing label value = X (9)
        new HorizontalLineAnnotation({
            labelPlacement: ELabelPlacement.TopRight,
            showLabel: true,
            stroke: "#FF6600",
            strokeThickness: 2,
            y1: 9,
            axisLabelFill: "#FF6600",
            axisLabelStroke: "#333",
            axisFontSize: 20
        }),
        // Vertically line with a custom label value
        new HorizontalLineAnnotation({
            labelPlacement: ELabelPlacement.TopLeft,
            showLabel: true,
            stroke: "#3388FF",
            strokeThickness: 2,
            strokeDashArray: [5, 5],
            y1: 4,
            axisLabelFill: "#3388FF",
            labelValue: "Custom Label",
            axisLabelStroke: "White",
            axisFontSize: 20
        })
    );
    // #endregion
}

addAnnotationToChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    const { chartBuilder, EAnnotationType } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.RenderContextHorizontalLineAnnotation,
                options: {
                    labelPlacement: ELabelPlacement.TopRight,
                    showLabel: true,
                    stroke: "#FF6600",
                    strokeThickness: 2,
                    y1: 9,
                    axisLabelFill: "#FF6600",
                    axisLabelStroke: "#333",
                    axisFontSize: 20
                }
            },
            {
                type: EAnnotationType.RenderContextHorizontalLineAnnotation,
                options: {
                    labelPlacement: ELabelPlacement.TopLeft,
                    showLabel: true,
                    stroke: "#3388FF",
                    strokeThickness: 2,
                    strokeDashArray: [5, 5],
                    y1: 4,
                    axisLabelFill: "#3388FF",
                    labelValue: "Custom Label",
                    axisLabelStroke: "White",
                    axisFontSize: 20
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
