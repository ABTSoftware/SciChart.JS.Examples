import * as SciChart from "scichart";

async function PolarArcZoom(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        XyDataSeries,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarLineRenderableSeries,
        PolarZoomExtentsModifier,
        SciChartJSDarkTheme,
        EPolarAxisMode,
        NumberRange
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJSDarkTheme()
    });
    sciChartSurface.xAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
    }));
    sciChartSurface.yAxes.add(new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 1)
    }));

    sciChartSurface.renderableSeries.add(
        new PolarLineRenderableSeries(wasmContext, {
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
            text: "PolarArcZoomModifier",
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
            text: "Drag mouse from one point to another to zoom.",
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
    const { PolarArcZoomModifier, easing } = SciChart;
    // or for npm: import { PolarArcZoomModifier, easing } from "scichart";

    // Add PolarArcZoomModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarArcZoomModifier({
            isAnimated: true,
            fill: "#50C7E022",
            strokeThickness: 5,
            stroke: "white",
            isAnimated: true,
            animationDuration: 2000,
            easingFunction: easing.outCubic,
            // xyDirection: EXyDirection.XyDirection
        }),
        new PolarZoomExtentsModifier() // optional - double click to reset
    );
    // #endregion
}

PolarArcZoom("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PolarArcZoomModifier in SciChart.js using the Builder API
    const { 
        chartBuilder, 
        EThemeProviderType, 
        EAxisType, 
        EChart2DModifierType, 
        easing, 
        EPolarAxisMode, 
        ESeriesType 
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Angular } },
        yAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Radial } },
        series: [
            {
                type: ESeriesType.PolarLineSeries,
                options: {
                    stroke: "#50C7E0",
                    strokeThickness: 5,
                    dataSeries: {
                        xValues: Array.from({ length: 10 }, (_, i) => i),
                        yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.1))
                    }
                }
            }
        ],
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
