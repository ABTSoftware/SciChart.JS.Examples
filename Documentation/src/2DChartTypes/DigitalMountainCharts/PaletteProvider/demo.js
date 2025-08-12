import * as SciChart from "scichart";

// #region ExampleA
const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints above a threshold
class MountainPaletteProvider extends DefaultPaletteProvider {
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
        return xValue > this.threshold ? this.fillColor : undefined;
    }

    // This function is called for every data-point
    // Return undefined to use the default color for the fill, else, return
    // a custom color as ARGB color code e.g. 0xFFFF0000 is red
    overrideFillArgb(xValue, yValue, index, opacity, metadata) {
        return xValue > this.threshold ? this.fillColor : undefined;
    }
}
// #endregion

async function drawMountainChartWithPalette(divElementId) {
    // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastMountainRenderableSeries,
        GradientParams,
        XyDataSeries,
        Point,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create some data
    let yLast = 100.0;
    const xValues = [];
    const yValues = [];
    for (let i = 0; i <= 100; i++) {
        const y = yLast + (Math.random() - 0.48);
        yLast = y;
        xValues.push(i);
        yValues.push(y);
    }

    // #region ExampleB
    const threshold = 75;
    // Create a mountain series & add to the chart
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: "#4682b4",
        strokeThickness: 3,
        zeroLineY: 0.0,
        // when a solid color is required, use fill
        fill: "rgba(176, 196, 222, 0.7)",
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,0.77)", offset: 0 },
            { color: "rgba(70,130,180,0.0)", offset: 1 }
        ]),
        isDigitalLine: true,
        // Apply the paletteprovider
        paletteProvider: new MountainPaletteProvider(threshold)
    });

    sciChartSurface.renderableSeries.add(mountainSeries);
    // #endregion
}

drawMountainChartWithPalette("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleC

    // Demonstrates how to create a chart with a custom PaletteProvider, using the builder API
    const { chartBuilder, EBaseType, ESeriesType, EPaletteProviderType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Register the custom ThresholdLinePaletteProvider with the chartBuilder
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "MountainPaletteProvider",
        options => new MountainPaletteProvider(options.threshold)
    );

    // Create some data
    let yLast = 100.0;
    const xValues = [];
    const yValues = [];
    for (let i = 0; i <= 100; i++) {
        const y = yLast + (Math.random() - 0.48);
        yLast = y;
        xValues.push(i);
        yValues.push(y);
    }

    // Now use the Builder-API to build the chart
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.MountainSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    stroke: "#4682b4",
                    strokeThickness: 3,
                    zeroLineY: 0.0,
                    fill: "rgba(176, 196, 222, 0.7)", // when a solid color is required, use fill
                    fillLinearGradient: {
                        gradientStops: [
                            { color: "rgba(70,130,180,0.77)", offset: 0.0 },
                            { color: "rgba(70,130,180,0.0)", offset: 1 }
                        ],
                        startPoint: { x: 0, y: 0 },
                        endPoint: { x: 0, y: 1 }
                    },
                    isDigitalLine: true,
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "MountainPaletteProvider",
                        options: {
                            threshold: 75
                        }
                    }
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ThresholdLinePaletteProvider("Green", yValue => yValue >= 4.0)
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
