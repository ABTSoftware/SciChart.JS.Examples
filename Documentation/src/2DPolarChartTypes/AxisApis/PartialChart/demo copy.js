import * as SciChart from "scichart";

async function polarPartialChart(divElementId) {
    const {
        SciChartPolarSurface,
        PolarNumericAxis,
        PolarLineRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        XyDataSeries,
        Thickness,
        PolarZoomExtentsModifier,
        PolarMouseWheelZoomModifier
    } = SciChart;

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId);

    const startAngleDegrees = 0;
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        totalAngleDegrees: 180,
        startAngleDegrees,
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 10),
        majorGridLineStyle: { strokeThickness: 1, color: "CCCCCC" },
        minorGridLineStyle: { strokeThickness: 1, color: "77777777" },
        labelStyle: { padding: new Thickness(10, 0, 0, 0) },
        zoomExtentsToInitialRange: true
    });
    angularXAxis.polarLabelMode = EPolarLabelMode.Parallel;
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        startAngleDegrees,
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 7),
        majorGridLineStyle: { strokeThickness: 3, color: "CCCCCC" },
        zoomExtentsToInitialRange: true
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const yValues = xValues.map(x => 5 + Math.sin(x));
    const polarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: "green",
        strokeThickness: 5
    });
    sciChartSurface.renderableSeries.add(polarLine);

    sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier());
    return { sciChartSurface, wasmContext };
}

polarPartialChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a polar line chart with SciChart.js using the Builder API
    const { EPolarAxisMode, EAxisAlignment, EPolarLabelMode, NumberRange } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: SciChart.ESciChartSurfaceType.Polar2D,
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
                polarAxisMode: EPolarAxisMode.Angular,
                axisAlignment: EAxisAlignment.Top,
                visibleRange: new NumberRange(0, 12),
                useNativeText: true,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMinorTickLines: false,
                drawMinorGridLines: false,
                autoTicks: false,
                majorDelta: 1,
                polarLabelMode: EPolarLabelMode.Parallel
            }
        ],
        yAxes: [
            {
                axisAlignment: EAxisAlignment.Right,
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, 8),
                useNativeText: true,
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMajorTickLines: false,
                labelPrecision: 0,
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
            }
        ],
        series: [
            {
                type: ESeriesType.PolarLineRenderableSeries,
                xyyData: {
                    xValues: Array.from({ length: 20 }, (_, i) => i),
                    yValues: Array.from({ length: 20 }, (_, i) => 1 + i / 3)
                },
                options: {
                    stroke: "pink",
                    strokeThickness: 4,
                    clipToTotalAngle: false
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
