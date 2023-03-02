// #region ExampleA
const {
  DefaultPaletteProvider,
  EStrokePaletteMode,
  parseColorToUIntArgb
} = SciChart;

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

async function drawLineChartWithPalette(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yValues = [2.5, 3.5, 3.7, 3.9, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  // The ThresholdLinePaletteProvider we created before is applied to a FastLineRenderableSeries
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    paletteProvider: new ThresholdLinePaletteProvider("Green", (yValue) => yValue > 4.0),
  });

  sciChartSurface.renderableSeries.add(lineSeries);
  // #endregion
};

drawLineChartWithPalette("scichart-root");




async function builderExample(divElementId) {
  // #region ExampleC

  // Demonstrates how to create a chart with a custom PaletteProvider, using the builder API
  const {
    chartBuilder,
    EBaseType,
    ESeriesType,
    EPaletteProviderType,
    EThemeProviderType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // Register the custom ThresholdLinePaletteProvider with the chartBuilder
  chartBuilder.registerType(EBaseType.PaletteProvider, "ThresholdLinePaletteProvider",
      (options) => new ThresholdLinePaletteProvider(options.stroke, options.rule));

  // Now use the Builder-API to build the chart
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Navy } },
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          yValues: [2.5, 3.5, 3.7, 3.99, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
        },
        options: {
          stroke: "#FF6600",
          strokeThickness: 5,
          // Now you can instantiate using parameters below
          paletteProvider: {
            type: EPaletteProviderType.Custom,
            customType: "ThresholdLinePaletteProvider",
            options: {
              stroke: "Green",
              rule: (yValue) => yValue >= 4.0,
            }
          }
          // Note: Assigning an instance is also valid, e.g.
          // paletteProvider: new ThresholdLinePaletteProvider("Green", yValue => yValue >= 4.0)
        }
      }
    ]
  });
  // #endregion
};




if (location.search.includes("builder=1"))
builderExample("scichart-root");
