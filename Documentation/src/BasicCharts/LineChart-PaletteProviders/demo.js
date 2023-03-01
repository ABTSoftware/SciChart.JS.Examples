const {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  DefaultPaletteProvider,
  EStrokePaletteMode,
  parseColorToUIntArgb
} = SciChart;

// #region PaletteProvider
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

// Demonstrates how to create a line chart with paletteprovider using SciChart.js
async function drawLineChartWithPalette(divElementId) {
  // #region Usage-in-code
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yValues = [2.5, 3.5, 3.7, 3.9, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    paletteProvider: new ThresholdLinePaletteProvider("Green", (yValue) => yValue > 4.0),
  });

  sciChartSurface.renderableSeries.add(lineSeries);
  // #endregion
};

// #region Usage-with-Builder-Api
// Demonstrates how to do the same thing, using the builder API
const { chartBuilder, EBaseType, ESeriesType, EPaletteProviderType } = SciChart;

// Register the custom ThresholdLinePaletteProvider with the chartBuilder
chartBuilder.registerType(EBaseType.PaletteProvider, "ThresholdLinePaletteProvider",
    (options) => new ThresholdLinePaletteProvider(options.stroke, options.rule));

async function drawLineChartWithPaletteBuilderApi (divElementId) {
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
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
};
// #endregion

drawLineChartWithPalette("scichart-root");
// drawLineChartWithPaletteBuilderApi("scichart-root");
