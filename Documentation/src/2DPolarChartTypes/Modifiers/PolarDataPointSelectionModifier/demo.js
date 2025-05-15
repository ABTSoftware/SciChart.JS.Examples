import * as SciChart from "scichart";

async function PolarArcZoom(divElementId) {
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
        PolarXyScatterRenderableSeries,
        PolarZoomExtentsModifier
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
        new PolarXyScatterRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1))
            })
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarDataPointSelectionModifier",
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
        }),
        new TextAnnotation({
            text: "Select a region to highlight points within it",
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
    const { PolarDataPointSelectionModifier } = SciChart;
    // or for npm: import { PolarDataPointSelectionModifier } from "scichart";

    // Add PolarDataPointSelectionModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarDataPointSelectionModifier({
            enableHover: true,
            enableSelection: true,

            onSelectionChanged: args => {
                console.log("1 seriesSelectionModifier constructor onSelectionChanged");
            },
            onHoverChanged: args => {
                console.log("1 seriesSelectionModifier constructor onHoverChanged");
            }
        }),
        new PolarZoomExtentsModifier() // optional - double click to reset
    );
    // #endregion
}

PolarArcZoom("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType, easing, EPolarAxisMode } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Angular } },
        yAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Radial } },
        modifiers: [
            {
                type: EChart2DModifierType.PolarArcZoom,
                options: {
                    isAnimated: true,
                    fill: "#00ffff33",
                    strokeThickness: 5,
                    stroke: "red",
                    isAnimated: true,
                    animationDuration: 2000,
                    easingFunction: easing.outCubic
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
