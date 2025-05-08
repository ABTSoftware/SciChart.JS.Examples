import * as SciChart from "scichart";

// #region ExampleA
const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for column series which colours datapoints above a threshold
class ColumnPaletteProvider extends DefaultPaletteProvider {
    constructor(threshold) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.threshold = threshold;
        this.stroke = parseColorToUIntArgb("#FF0000");
        this.fillColor = parseColorToUIntArgb("#FF000077");
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return yValue > this.threshold ? this.fillColor : undefined;
    }

    // This function is called for every data-point
    // Return undefined to use the default color for the fill, else, return
    // a custom color as ARGB color code e.g. 0xFFFF0000 is red
    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        return yValue > this.threshold ? this.fillColor : undefined;
    }
}
// #endregion

async function drawColumnChartWithPalette(divElementId) {
    // Demonstrates how to create a Column chart with SciChart.js
    const { SciChartSurface, NumericAxis, FastColumnRenderableSeries, XyDataSeries, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleB
    // Create some data
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = [
        0.1, 0.2, 0.4, 0.8, 1.1, 1.5, 2.4, 4.6, 8.1, 11.7, 14.4, 16.0, 13.7, 10.1, 6.4, 3.5, 2.5, 1.4, 0.4, 0.1
    ];

    // Create and add a column series
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.5)",
        stroke: "rgba(176, 196, 222, 1)",
        strokeThickness: 2,
        dataPointWidth: 0.7,
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        paletteProvider: new ColumnPaletteProvider(10)
    });

    sciChartSurface.renderableSeries.add(columnSeries);
    // #endregion
}

drawColumnChartWithPalette("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleC

    // Demonstrates how to create a chart with a custom PaletteProvider, using the builder API
    const { chartBuilder, EBaseType, ESeriesType, EPaletteProviderType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Register the custom ColumnPaletteProvider with the chartBuilder
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "ColumnPaletteProvider",
        options => new ColumnPaletteProvider(options.threshold)
    );

    // Create some data
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = [
        0.1, 0.2, 0.4, 0.8, 1.1, 1.5, 2.4, 4.6, 8.1, 11.7, 14.4, 16.0, 13.7, 10.1, 6.4, 3.5, 2.5, 1.4, 0.4, 0.1
    ];

    // Now use the Builder-API to build the chart
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ColumnSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    fill: "rgba(176, 196, 222, 0.5)",
                    stroke: "rgba(176, 196, 222, 1)",
                    strokeThickness: 2,
                    dataPointWidth: 0.7,
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ColumnPaletteProvider",
                        options: {
                            threshold: 10
                        }
                    }
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ColumnPaletteProvider(10)
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
