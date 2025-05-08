import * as SciChart from "scichart";

async function simpleBandChart(divElementId) {
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
        SciChartJsNavyTheme
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChart.SciChartJsNavyTheme(),
        drawSeriesBehindAxis: true
    });

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 8),
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
        drawMinorGridLines: false,
        useNativeText: true,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
        useNativeText: true,
        drawMinorGridLines: false,
        labelPrecision: 0,
        autoTicks: false,
        majorDelta: 1,
        innerRadius: 0.2,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarBand = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 3, 4, 5, 6],
            yValues: [1, 2, 3, 4, 5, 6],
            y1Values: [6, 5, 1, 5, 4, 2]
        }),
        stroke: "rgba(200,200,30,1)",
        strokeY1: "rgba(200,120,160,1)",
        fill: "rgba(200,200,30,0.3)",
        fillY1: "rgba(200,120,160,0.3)",
        strokeThickness: 4,
        interpolateLine: true
    });
    sciChartSurface.renderableSeries.add(polarBand);

    return { sciChartSurface, wasmContext };
}

simpleBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { 
        chartBuilder, 
        ESeriesType, 
        EThemeProviderType, 
        ESciChartSurfaceType,
        EPolarAxisMode,
        NumberRange,
    } = SciChart;
    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.buildChart(divElementId, {
        type: SciChart.ESciChartSurfaceType.Polar2D,
        surface: { theme: { type: EThemeProviderType.Navy } },
        xAxes: [
            {
                polarAxisMode: EPolarAxisMode.Angular,
                visibleRange: new NumberRange(0, 8),
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
                drawMinorGridLines: false,
                useNativeText: true,
            }
        ],
        yAxes: [
            {
                polarAxisMode: EPolarAxisMode.Radial,
                majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
                useNativeText: true,
                drawMinorGridLines: false,
                innerRadius: 0.2,
                labelPrecision: 0,
                autoTicks: false,
                majorDelta: 1,
            }
        ],
        series: [
            {
                type: ESeriesType.PolarBandSeries,
                xyyData: {
                    xValues: [0, 1, 3, 4, 5, 6],
                    yValues: [1, 2, 3, 4, 5, 6],
                    y1Values: [6, 5, 1, 5, 4, 2]
                },
                options: {
                    stroke: "rgba(200,200,30,1)",
                    strokeY1: "rgba(200,120,160,1)",
                    fill: "rgba(200,200,30,0.3)",
                    fillY1: "rgba(200,120,160,0.3)",
                    strokeThickness: 4,
                    interpolateLine: true
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
