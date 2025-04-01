import * as SciChart from "scichart";

// #region ExampleA
const { HorizontalLineAnnotation, NumericAxis, SciChartSurface, ELabelPlacement, SciChartJsNavyTheme } = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        // Horizontal line stretched across the viewport, showing label value = Y (9)
        new HorizontalLineAnnotation({
            labelPlacement: ELabelPlacement.Axis,
            showLabel: true,
            stroke: "SteelBlue",
            strokeThickness: 2,
            y1: 9,
            axisLabelFill: "SteelBlue",
            axisFontSize: 20
        }),
        // Horizontal line with a custom label value partially stretched to X=4
        new HorizontalLineAnnotation({
            showLabel: true,
            stroke: "Orange",
            strokeThickness: 2,
            y1: 6,
            x1: 4,
            axisLabelFill: "Orange",
            axisFontSize: 20
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
                type: EAnnotationType.RenderContextHorizontalLineAnnotation,
                options: {
                    labelPlacement: ELabelPlacement.Axis,
                    showLabel: true,
                    stroke: "SteelBlue",
                    strokeThickness: 2,
                    y1: 9,
                    axisLabelFill: "SteelBlue",
                    axisFontSize: 20
                }
            },
            {
                type: EAnnotationType.RenderContextHorizontalLineAnnotation,
                options: {
                    showLabel: true,
                    stroke: "Orange",
                    strokeThickness: 2,
                    y1: 6,
                    x1: 4,
                    axisLabelFill: "Orange",
                    axisFontSize: 20
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
