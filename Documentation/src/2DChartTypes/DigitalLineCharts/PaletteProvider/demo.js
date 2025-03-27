// #region ExampleA
const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints above a threshold
class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
    constructor(stroke, rule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return this.rule(yValue) ? this.stroke : undefined;
    }
}
// #endregion

async function drawDigitalLineChartWithPalette(divElementId) {
    // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
    const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
    });

    // #region ExampleB
    // The ThresholdLinePaletteProvider we created before is applied to a FastLineRenderableSeries
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "White",
        strokeThickness: 5,
        dataSeries: xyDataSeries,
        isDigitalLine: true,
        paletteProvider: new ThresholdLinePaletteProvider("Red", (yValue) => yValue > 0.0),
    });

    sciChartSurface.renderableSeries.add(lineSeries);
    // #endregion
}

drawDigitalLineChartWithPalette("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a chart with a custom PaletteProvider, using the builder API
    const { chartBuilder, EBaseType, ESeriesType, EPaletteProviderType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    // Register the custom ThresholdLinePaletteProvider with the chartBuilder
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "ThresholdLinePaletteProvider",
        (options) => new ThresholdLinePaletteProvider(options.stroke, options.rule)
    );

    // #region ExampleC
    // Use the Builder-API to build the chart and apply a paletteprovider
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues,
                    yValues,
                },
                options: {
                    stroke: "White",
                    strokeThickness: 5,
                    isDigitalLine: true,
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ThresholdLinePaletteProvider",
                        options: {
                            stroke: "Red",
                            rule: (yValue) => yValue >= 0.0,
                        },
                    },
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ThresholdLinePaletteProvider("Green", yValue => yValue >= 4.0)
                },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
