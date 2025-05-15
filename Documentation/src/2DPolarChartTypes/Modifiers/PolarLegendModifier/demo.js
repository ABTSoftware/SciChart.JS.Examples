import * as SciChart from "scichart";

async function PolarLegendModifier(divElementId) {
    const {
        SciChartPolarSurface,
        EPolarAxisMode,
        PolarNumericAxis,
        XyDataSeries,
        SciChartJSDarkTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarColumnRenderableSeries,
        PolarLineRenderableSeries
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJSDarkTheme()
    });

    sciChartSurface.xAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular
        })
    );
    sciChartSurface.yAxes.add(
        new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial
        })
    );

    sciChartSurface.renderableSeries.add(
        new PolarColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1)),
                dataSeriesName: "Sine"
            }),
            fill: "#55aaff44",
            stroke: "#55aaff",
            dataPointWidth: 0.6,
            strokeThickness: 2
        }),
        new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.cos(i * 0.1)),
                dataSeriesName: "Cosine"
            }),
            stroke: "#ff8800",
            strokeThickness: 4
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarLegendModifier",
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

    // #region ExampleA
    const { PolarLegendModifier } = SciChart;
    // or for npm: import { PolarLegendModifier } from "scichart";

    // Add PolarLegendModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarLegendModifier({
            showCheckboxes: true,
            showSeriesMarkers: true
        })
    );
    // #endregion
}

PolarLegendModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PolarLegendModifier in SciChart.js using the Builder API
    const {
        chartBuilder,
        EAxisType,
        EChart2DModifierType,
        EPolarAxisMode,
        EAngularAxisLabelPlacement,
        ERadialAxisLabelPlacement,
        ESeriesType
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Angular } },
        yAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Radial } },
        renderableSeries: [
            {
                type: ESeriesType.PolarColumnRenderableSeries,
                options: {
                    dataSeries: {
                        xValues: Array.from({ length: 10 }, (_, i) => i),
                        yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1)),
                        dataSeriesName: "Sine"
                    },
                    fill: "#55aaff44",
                    stroke: "#55aaff",
                    dataPointWidth: 0.6,
                    strokeThickness: 2
                }
            },
            {
                type: ESeriesType.PolarLineRenderableSeries,
                options: {
                    dataSeries: {
                        xValues: Array.from({ length: 10 }, (_, i) => i),
                        yValues: Array.from({ length: 10 }, (_, i) => Math.cos(i * 0.1)),
                        dataSeriesName: "Cosine"
                    },
                    stroke: "#ff8800",
                    strokeThickness: 4
                }
            }
        ],
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
