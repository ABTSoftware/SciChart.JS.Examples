import * as SciChart from "scichart";

// #region ExampleA
const { DefaultPaletteProvider, EStrokePaletteMode, EFillPaletteMode, parseColorToUIntArgb } = SciChart;
// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints above a threshold
class PolarBandPaletteProvider extends DefaultPaletteProvider {
    strokePaletteMode = EStrokePaletteMode.SOLID;
    fillPaletteMode = EFillPaletteMode.SOLID;

    orange = parseColorToUIntArgb("#DD8800");
    lightOrange = parseColorToUIntArgb("#DD880044");

    overrideFillArgb(xValue, yValue, index) {
        if ((xValue >= 3 && xValue < 6) || (xValue >= 9 && xValue < 12)) {
            return this.lightOrange;
        } else {
            return undefined;
        }
    }

    overrideStrokeArgb(xValue, yValue, index) {
        if ((xValue > 3 && xValue <= 6) || (xValue > 9 && xValue <= 12)) {
            return this.orange;
        } else {
            return undefined; // use the default stroke color
        }
    }
}
// #endregion

async function paletteProviderBandChart(divElementId) {
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
        Thickness
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(30)
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
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" }
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarBand1 = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1],
            y1Values: [2, 5, 6, 2, 5, 6, 2, 5, 6, 2, 5, 6, 2]
        }),
        stroke: "#FF0000",
        fill: "#FF000044",
        strokeThickness: 3,
        paletteProvider: new PolarBandPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(polarBand1);

    return { sciChartSurface, wasmContext };
}

paletteProviderBandChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { EPolarAxisMode, EAxisAlignment, EPolarLabelMode } = SciChart;
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
                type: ESeriesType.PolarBandSeries,
                xyyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    yValues: [1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1, 2.5, 3, 1],
                    y1Values: [2, 5, 6, 2, 5, 6, 2, 5, 6, 2, 5, 6, 2]
                },
                options: {
                    stroke: "#FF0000",
                    fill: "#FF000044",
                    strokeThickness: 3,
                    paletteProvider: new PolarBandPaletteProvider()
                }
            }
        ]
    });

    return { sciChartSurface, wasmContext };
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
