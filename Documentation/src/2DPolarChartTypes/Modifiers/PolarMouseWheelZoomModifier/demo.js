import * as SciChart from "scichart";

async function PolarMouseWheelZoom(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        XyyDataSeries,
        SciChartJsNavyTheme,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        PolarBandRenderableSeries,
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
        new PolarBandRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues: Array.from({ length: 10 }, (_, i) => i),
                yValues: Array.from({ length: 10 }, (_, i) => Math.sin(i * 0.2)),
                y1Values: Array.from({ length: 10 }, (_, i) => Math.cos(i * 0.2))
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
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Scroll mouse wheel to pan or zoom (depending on \"defaultActionType\")",
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
            defaultActionType: EActionType.Pan
        }),
        new PolarZoomExtentsModifier() // optional - double click to reset
    );
    // #endregion
}

PolarMouseWheelZoom("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PolarMouseWheelZoomModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType, easing, EPolarAxisMode } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DPolarChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Angular } },
        yAxes: { type: EAxisType.NumericAxis, options: { polarAxisMode: EPolarAxisMode.Radial } },
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
