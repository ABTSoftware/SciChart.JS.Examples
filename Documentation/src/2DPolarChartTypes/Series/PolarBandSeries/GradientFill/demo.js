import * as SciChart from "scichart";

async function gradientFillBandChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a polar band chart using SciChart.js
    const { 
        SciChartPolarSurface, 
        PolarNumericAxis, 
        PolarBandRenderableSeries,
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        XyyDataSeries, 
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
        visibleRange: new NumberRange(0, 6),
        useNativeText: true,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        autoTicks: false,
        majorDelta: 1,
        polarLabelMode: EPolarLabelMode.Parallel
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
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
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarBand1 = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5],
            yValues: [1, 2, 3, 4, 5, 6],
            y1Values: [6, 5, 1, 6, 4, 3],
        }),
        stroke: "red",
        strokeY1: "blue",
        strokeThickness: 3,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "transparent", offset: 0 },
            { color: "red", offset: 1 }
        ]),
        // This one is for gradient where Y1 values are greater than Y2 values
        fillLinearGradientY1: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "blue", offset: 0 },
            { color: "transparent", offset: 1 }
        ]),
        interpolateLine: true,
        scaleGradientToYRange: true,  
    });
    sciChartSurface.renderableSeries.add(polarBand1);
    
    return { sciChartSurface, wasmContext };
}

gradientFillBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { 
        EPolarAxisMode,
        EAxisAlignment,
        EPolarLabelMode,
        NumberRange,
        GradientParams,
        Point
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: SciChart.ESciChartSurfaceType.Polar2D,
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
                polarAxisMode: EPolarAxisMode.Angular,
                axisAlignment: EAxisAlignment.Top,
                visibleRange: new NumberRange(0, 6),
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
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
            }
        ],
        series: [
            {
                type: ESeriesType.PolarBandSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5],
                    yValues: [1, 2, 3, 4, 5, 6],
                    y1Values: [6, 5, 1, 6, 4, 3],
                },
                options: {
                    stroke: "red",
                    strokeY1: "blue",
                    strokeThickness: 3,
                    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "transparent", offset: 0 },
                        { color: "red", offset: 1 }
                    ]),
                    // This one is for gradient where Y1 values are greater than Y2 values
                    fillLinearGradientY1: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "blue", offset: 0 },
                        { color: "transparent", offset: 1 }
                    ]),
                    interpolateLine: true,
                    scaleGradientToYRange: true,  
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
