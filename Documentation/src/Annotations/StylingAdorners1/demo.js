import * as SciChart from "scichart";

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
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(2, 8) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(2, 8) }));

    // #region ExampleA
    // Add a box annotation to the chart and make it editable and selected
    // Style the adorners (selectiong grips) using properties
    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
        // add custom styling
        annotationsGripsStroke: "Blue",
        annotationsGripsFill: "Black",
        selectionBoxStroke: "Green",
        annotationsGripsRadius: 10,
        selectionBoxDelta: 30,
        selectionBoxThickness: 9
    });
    sciChartSurface.annotations.add(boxAnnotation);
    // #endregion
}

addAnnotationToChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    const { chartBuilder, EAnnotationType } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleB
    // Add a box annotation to the chart using the builder API and make it editable and selected
    // Style the adorners (selectiong grips) using properties
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        annotations: [
            {
                type: EAnnotationType.RenderContextBoxAnnotation,
                options: {
                    x1: 3,
                    x2: 7,
                    y1: 3,
                    y2: 7,
                    isEditable: true,
                    isSelected: true,
                    // add custom styling
                    annotationsGripsStroke: "Blue",
                    annotationsGripsFill: "Black",
                    selectionBoxStroke: "Green",
                    annotationsGripsRadius: 10,
                    selectionBoxDelta: 30,
                    selectionBoxThickness: 9
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
