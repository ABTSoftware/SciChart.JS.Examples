import * as SciChart from "scichart";

async function PolarMouseWheelZoom(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        XyyDataSeries,
        SciChartJSDarkTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarBandRenderableSeries,
        PolarZoomExtentsModifier,
        EPolarAxisMode
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
        new PolarBandRenderableSeries(wasmContext, {
            strokeThickness: 3,
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues: Array.from({ length: 12 }, (_, i) => i),
                yValues: Array.from({ length: 12 }, (_, i) => Math.sin(i * 0.2)),
                y1Values: Array.from({ length: 12 }, (_, i) => Math.cos(i * 0.2))
            })
        })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "PolarMouseWheelZoomModifier",
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
            text: 'Scroll mouse wheel to pan or zoom (depending on "defaultActionType")',
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
    const { PolarMouseWheelZoomModifier, EActionType } = SciChart;
    // or for npm: import { PolarMouseWheelZoomModifier, EActionType } from "scichart";

    // Add PolarMouseWheelZoomModifier behaviour to the chart
    sciChartSurface.chartModifiers.add(
        new PolarMouseWheelZoomModifier({
            growFactor: 0.002,
            zoomSize: false,
            defaultActionType: EActionType.Pan // default value - pans the polar chart
            // defaultActionType: EActionType.Zoom // for scaling the polar chart
        }),
        new PolarZoomExtentsModifier() // optional - double click to reset
    );
    // #endregion
}

PolarMouseWheelZoom("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PolarMouseWheelZoomModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType, EPolarAxisMode, ESeriesType } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Angular } },
        yAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Radial } },
        series: {
            type: ESeriesType.PolarBandSeries,
            options: {
                strokeThickness: 3,
                dataSeries: {
                    xValues: Array.from({ length: 12 }, (_, i) => i),
                    yValues: Array.from({ length: 12 }, (_, i) => Math.sin(i * 0.2)),
                    y1Values: Array.from({ length: 12 }, (_, i) => Math.cos(i * 0.2))
                }
            }
        },
        modifiers: [
            {
                type: EChart2DModifierType.PolarMouseWheelZoom,
                options: {
                    growFactor: 0.002,
                    zoomSize: false,
                    defaultActionType: EActionType.Pan
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
