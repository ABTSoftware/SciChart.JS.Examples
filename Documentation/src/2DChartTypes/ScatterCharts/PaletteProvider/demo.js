import * as SciChart from "scichart";

// #region ExampleA
const { DefaultPaletteProvider, EStrokePaletteMode, parseColorToUIntArgb } = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for scatter points which colours datapoints above a threshold
class ScatterPaletteProvider extends DefaultPaletteProvider {
    constructor(stroke, fill, rule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        // Use the helper function parseColorToUIntArgb to convert a hex string
        // e.g. #FF00FF77 into ARGB numeric format 0xFF00FF77 expected by scichart
        this.overrideStroke = parseColorToUIntArgb(stroke);
        this.overrideFill = parseColorToUIntArgb(fill);
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the pointmarker,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overridePointMarkerArgb(xValue, yValue, index, opacity, metadata) {
        // Draw points outside the range a different color
        if (this.rule(yValue)) {
            return { stroke: this.overrideStroke, fill: this.overrideFill };
        }
        // Undefined means use default colors
        return undefined;
    }
}
// #endregion

async function drawScatterChartWithPalette(divElementId) {
    // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        XyScatterRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        HorizontalLineAnnotation,
        ELabelPlacement
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    // #region ExampleB
    // The ScatterPaletteProvider we created before is applied to a XyScatterRenderableSeries
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 1,
            fill: "steelblue",
            stroke: "LightSteelBlue"
        }),
        // PaletteProvider feature allows coloring per-point based on a rule
        paletteProvider: new ScatterPaletteProvider("Red", "Purple", yValue => yValue > 0.0)
    });

    sciChartSurface.renderableSeries.add(scatterSeries);

    // Add this label & annotation to the chart
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({
            y1: 0,
            stroke: "#EC0F6C",
            axisLabelFill: "White",
            labelPlacement: ELabelPlacement.BottomRight,
            labelValue: "Values above this line are red",
            showLabel: true
        })
    );
    // #endregion
}

drawScatterChartWithPalette("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a chart with a custom PaletteProvider, using the builder API
    const {
        chartBuilder,
        EBaseType,
        ESeriesType,
        EPaletteProviderType,
        EThemeProviderType,
        EPointMarkerType,
        EAnnotationType,
        ELabelPlacement
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    // #region ExampleC
    // Register the custom ScatterPaletteProvider with the chartBuilder
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "ScatterPaletteProvider",
        options => new ScatterPaletteProvider(options.stroke, options.fill, options.rule)
    );

    // Use the Builder-API to build the chart and apply a paletteprovider
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    stroke: "White",
                    strokeThickness: 5,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            strokeThickness: 1,
                            fill: "steelblue",
                            stroke: "LightSteelBlue"
                        }
                    },
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ScatterPaletteProvider",
                        options: {
                            stroke: "Red",
                            fill: "Purple",
                            rule: yValue => yValue >= 0.0
                        }
                    }
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ScatterPaletteProvider("Green", "Red", yValue => yValue >= 4.0)
                }
            }
        ],
        annotations: [
            {
                type: EAnnotationType.RenderContextHorizontalLineAnnotation,
                options: {
                    y1: 0,
                    stroke: "#EC0F6C",
                    axisLabelFill: "White",
                    labelPlacement: ELabelPlacement.BottomRight,
                    labelValue: "Values above this line are red",
                    showLabel: true
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
