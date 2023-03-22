const {
  DefaultPaletteProvider,
  EStrokePaletteMode,
  parseColorToUIntArgb
} = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints a different colour based on a metadata field
class GapsPaletteProvider extends DefaultPaletteProvider {

  constructor(stroke, isNullRule) {
    super();
    this.strokePaletteMode = EStrokePaletteMode.SOLID;
    this.isNullRule = isNullRule;
    this.stroke = parseColorToUIntArgb(stroke);
  }

  // This function is called for every data-point.
  // Return undefined to use the default color for the line,
  // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
  overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
    const isPointNull = this.isNullRule(metadata);
    // Note: This is a BAD idea for performance but put here to show how the paletteprovider works
    console.log(`index ${index}, isNull ${isPointNull}`);
    return isPointNull ? this.stroke : undefined;
  }
}
// #endregion

async function drawLineChartWithPalette(divElementId) {
  // Demonstrates how to create a line chart with PaletteProvider using SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [];
  const yValues = [];
  const metadataValues = [];
  for(let i = 0; i < 30; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));

    // Metadata lets you push objects into datapoints
    metadataValues.push({ isNull: i % 5 === 0 });
  }

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
    metadata: metadataValues
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#F48420",
    strokeThickness: 5,
    dataSeries: xyDataSeries,
    // Using the PaletteProvider to colour points which are null to transparent
    paletteProvider: new GapsPaletteProvider("#F4842022", (metadata) => metadata.isNull === true),
    // Data-labels included to debug which datapoints are 'null'
    dataLabels: {
      style: {
        fontFamily: "Arial",
        fontSize: 16
      },
      color: "#EEE"
    }
  });

  lineSeries.dataLabelProvider.getText = (dataLabelState) => {
    return `${dataLabelState.xVal()}`;
  };

  sciChartSurface.renderableSeries.add(lineSeries);
};

drawLineChartWithPalette("scichart-root");

