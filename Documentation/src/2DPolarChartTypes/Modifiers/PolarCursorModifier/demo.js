import * as SciChart from "scichart";

async function PolarCursorModifier(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        XyDataSeries,
        SciChartJsNavyTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarColumnRenderableSeries,
        easing,
        PolarZoomExtentsModifier,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: SciChart.EPolarAxisMode.Angular
    }));
    sciChartSurface.yAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: SciChart.EPolarAxisMode.Radial
    }));

    sciChartSurface.renderableSeries.add(
        new PolarColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1))
            }),
            fill: "#111155",
            stroke: "#55aaff",
            dataPointWidth: 0.6,
            strokeThickness: 1,
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarCursorModifier",
            x1: 0,
            y1: 0,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            yCoordShift: -20,
            opacity: 0.33,
            fontSize: 36,
            fontWeight: "Bold"
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover mouse over the chart to see it in action.",
            x1: 0,
            y1: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            yCoordShift: 30,
            opacity: 0.45,
            fontSize: 17
        })
    );

    // #region ExampleA
    const { PolarCursorModifier, EAngularAxisLabelPlacement, ERadialAxisLabelPlacement } = SciChart;
    // or for npm: import { PolarCursorModifier, EAngularAxisLabelPlacement, ERadialAxisLabelPlacement } from "scichart";

    // Add PolarCursorModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarCursorModifier({
            lineColor: "#55aaff",
            lineThickness: 3,
            axisLabelFill: "#55aaff",
            angularAxisLabelPlacement: EAngularAxisLabelPlacement.Center,
            radialAxisLabelPlacement: ERadialAxisLabelPlacement.Top,
            showRadialLine: true, 
            showCircularLine: true
        }),
        new PolarZoomExtentsModifier() // optional - double click to reset
    );
    // #endregion
}

PolarCursorModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PolarCursorModifier in SciChart.js using the Builder API
    const {  chartBuilder, EAxisType, EChart2DModifierType, EPolarAxisMode, EAngularAxisLabelPlacement, ERadialAxisLabelPlacement } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Angular } },
        yAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Radial } },
        modifiers: [
            {
                type: EChart2DModifierType.PolarCursor,
                options: {
                    lineColor: "#55aaff",
                    lineThickness: 3,
                    axisLabelFill: "#55aaff",
                    angularAxisLabelPlacement: EAngularAxisLabelPlacement.Center,
                    radialAxisLabelPlacement: ERadialAxisLabelPlacement.Top,
                    showRadialLine: true,
                    showCircularLine: true
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
