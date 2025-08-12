import * as SciChart from "scichart";

// #region ExampleA
const { AxisMarkerAnnotation, NumericAxis, SciChartSurface, ELabelPlacement, SciChartJsNavyTheme } = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a selection of annotations to the chart
    sciChartSurface.annotations.add(
        // An AxisMarkerAnnotation at Y=5.2 showing the y-value
        new AxisMarkerAnnotation({
            y1: 5.2,
            fontSize: 20,
            fontStyle: "Bold",
            backgroundColor: "SteelBlue",
            color: "White",
            fontFamily: "Default",
            fontWeight: "700"
        }),
        // An AxisMarkerAnnotation at Y=7 with a custom label
        new AxisMarkerAnnotation({
            y1: 7,
            fontSize: 16,
            fontStyle: "Bold",
            backgroundColor: "#FF6600",
            color: "Black",
            fontFamily: "Default",
            formattedValue: "Custom Label"
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
                type: EAnnotationType.RenderContextAxisMarkerAnnotation,
                options: {
                    y1: 5.2,
                    fontSize: 12,
                    fontStyle: "Bold",
                    backgroundColor: "SteelBlue",
                    color: "White",
                    fontFamily: "Default"
                }
            },
            {
                type: EAnnotationType.RenderContextAxisMarkerAnnotation,
                options: {
                    y1: 7,
                    fontSize: 16,
                    fontStyle: "Bold",
                    backgroundColor: "#FF6600",
                    color: "Black",
                    fontFamily: "Default",
                    formattedValue: "Custom Label"
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
