import * as SciChart from "scichart";

async function PolarLineChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a basic polar line chart using SciChart.js
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
        GradientParams,
        Point
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(30),
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
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
        labelPrecision: 0,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(0, 8),
        autoTicks: false,
        labelPrecision: 0,
        majorDelta: 1,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMajorTickLines: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 20 }, (_, i) => i),
            yValues: Array.from({ length: 20 }, (_, i) => 1 + i / 3)
        }),
        stroke: "pink",
        strokeThickness: 4,
        clipToTotalAngle: false // set to true if you want to clip anything outside the total angle
    });
    sciChartSurface.renderableSeries.add(polarLine);
    
    return { sciChartSurface, wasmContext };
}

PolarLineChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a polar line chart with SciChart.js using the Builder API
    const { 
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange
    } = SciChart;
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
                polarLabelMode: EPolarLabelMode.Parallel,
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
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
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