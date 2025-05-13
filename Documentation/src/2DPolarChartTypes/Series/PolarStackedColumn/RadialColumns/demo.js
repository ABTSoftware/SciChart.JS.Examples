import * as SciChart from "scichart";

async function PolarColumnChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a basic polar column chart using SciChart.js
    const { 
        SciChartPolarSurface, 
        PolarNumericAxis, 
        EPolarAxisMode,
        EAxisAlignment,
        NumberRange,
        XyDataSeries, 
        Thickness,
        PolarStackedColumnRenderableSeries,
        PolarStackedColumnCollection,
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(30),
    });

    // Create Polar, Radial axes
    const xAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        zoomExtentsToInitialRange: true,
        flippedCoordinates: false,

        autoTicks: false,
        majorDelta: 1,

        useNativeText: true,
        flippedCoordinates: true, // Norway will be outermost, Finland innermost
        innerRadius: 0.1, // donut hole
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
        drawMajorTickLines: false,
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        flippedCoordinates: true,
        labelPrecision: 0,
        useNativeText: true,
        totalAngle: Math.PI * 3 / 2 // 270 degrees
    });
    sciChartSurface.yAxes.add(yAxis);

    const collection = new PolarStackedColumnCollection(wasmContext, {
        // animation: new WaveAnimation({ duration: 800 }) // optionally add animation
    });

    const xValues = [2, 3, 4, 5, 6, 7, 8];
    const polarColumn1 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: [3, 2, 3, 5, 4, 6, 3]
        }),
        fill: "#44CC8866",
        stroke: "#44CC88",
    });
    const polarColumn2 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: [5, 7, 8, 3, 2, 1, 2]
        }),
        fill: "#CC00CC66",
        stroke: "#CC00CC"
    });
    const polarColumn3 = new PolarStackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues: [3, 5, 1, 3, 5, 1, 8]
        }),
        fill: "#33BBEE66",
        stroke: "#33BBEE",
    });
    collection.add(polarColumn1, polarColumn2, polarColumn3);

    sciChartSurface.renderableSeries.add(collection);
    
    return { sciChartSurface, wasmContext };
}

PolarColumnChart("scichart-root");

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
                visibleRange: new NumberRange(0, 9),
                useNativeText: true,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMinorTickLines: false,
                drawMinorGridLines: false,
                autoTicks: false,
                majorDelta: 1,
                startAngle: Math.PI / 2,
                flippedCoordinates: true,
                polarLabelMode: EPolarLabelMode.Parallel,
            }
        ],
        yAxes: [
            {
                axisAlignment: EAxisAlignment.Right,
                polarAxisMode: EPolarAxisMode.Radial,
                visibleRange: new NumberRange(0, 6),
                useNativeText: true,
                autoTicks: false,
                majorDelta: 1,
                drawMajorGridLines: true,
                drawMajorTickLines: false,
                drawMajorTickLines: false,
                labelPrecision: 0,
                innerRadius: 0.1,
                startAngle: Math.PI / 2,
                drawLabels: false,
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
            }
        ],
        series: [
            {
                type: ESeriesType.PolarColumnRenderableSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5],
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