// #region ExampleA
const {
  DefaultPaletteProvider,
  EStrokePaletteMode,
  parseColorToUIntArgb
} = SciChart;

// or, for npm, import { DefaultPaletteProvider, ... } from "scichart"

// Custom PaletteProvider for line series which colours datapoints above a threshold
class BubblePaletteProvider extends DefaultPaletteProvider {

  constructor(fill, rule) {
    super();
    this.strokePaletteMode = EStrokePaletteMode.SOLID;
    this.rule = rule;
    // Use the helper function parseColorToUIntArgb to convert a hex string
    // e.g. #FF00FF77 into ARGB numeric format 0xFF00FF77 expected by scichart
    this.overrideFill = parseColorToUIntArgb(fill);
  }

  // This function is called for every data-point.
  // Return undefined to use the default color for the pointmarker,
  // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
  overridePointMarkerArgb(xValue, yValue, index, opacity, metadata) {
    // Draw points outside the range a different color
    if (this.rule(yValue)) {
      return { stroke: this.overrideFill, fill: this.overrideFill }
    }
    // Undefined means use default colors
    return undefined;
  }
}
// #endregion

async function drawBubbleChartWithPalette(divElementId) {
  // Demonstrates how to create a bubble chart with SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    XyzDataSeries,
    FastBubbleRenderableSeries,
    EllipsePointMarker,
    SciChartJsNavyTheme,
    ELabelPlacement,
    HorizontalLineAnnotation
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [];
  const yValues = [];
  const sizes = [];
  for(let i = 0; i < 30; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.2) - Math.cos(i * 0.04));
    sizes.push(Math.sin(i) * 60 + 3);
  }

  const xyzDataSeries = new XyzDataSeries(wasmContext, {
    xValues,
    yValues,
    zValues: sizes
  });

  // #region ExampleB
  // The BubblePaletteProvider we created before is applied to a FastBubbleRenderableSeries
  const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
    dataSeries: xyzDataSeries,
    opacity: 1,
    pointMarker: new EllipsePointMarker(wasmContext, {
      // choose a suitably large size for pointmarker. This will  be scaled per-point
      width: 64,
      height: 64,
      strokeThickness: 0,
      fill: "#4682b477"
    }),
    // PaletteProvider feature allows coloring per-point based on a rule
    paletteProvider: new BubblePaletteProvider("Red", yValue => yValue > -0.8)
  });

  sciChartSurface.renderableSeries.add(bubbleSeries);
  // #endregion

  // Optional: add zooming, panning for the example
  const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier, new ZoomExtentsModifier());

  // Add this label & annotation to the chart
  sciChartSurface.annotations.add(new HorizontalLineAnnotation({ y1: -0.8, stroke: "#EC0F6C",
    axisLabelFill: "White",
    labelPlacement: ELabelPlacement.BottomRight, labelValue: "Values above this line are red",
    showLabel: true}));
};

drawBubbleChartWithPalette("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to create a bubble with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EPointMarkerType,
    EThemeProviderType,
    EBaseType,
    EPaletteProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = [];
  const yValues = [];
  const sizes = [];
  for(let i = 0; i < 30; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.2) - Math.cos(i * 0.04));
    sizes.push(Math.sin(i) * 60 + 3);
  }

  // #region ExampleC
  // Register the custom BubblePaletteProvider with the chartBuilder
  chartBuilder.registerType(EBaseType.PaletteProvider, "BubblePaletteProvider",
      (options) => new BubblePaletteProvider(options.fill, options.rule));

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.BubbleSeries,
        xyzData: {
          xValues,
          yValues,
          zValues: sizes
        },
        options: {
          pointMarker: {
            type: EPointMarkerType.Ellipse,
            options: {
              // choose a suitably large size for pointmarker. This will  be scaled per-point
              width: 64,
              height: 64,
              strokeThickness: 0,
              fill: "#4682b477"
            }
          },
          // Now you can instantiate using parameters below
          paletteProvider: {
            type: EPaletteProviderType.Custom,
            customType: "BubblePaletteProvider",
            options: {
              fill: "Red",
              rule: (yValue) => yValue >= -0.8,
            }
          }
          // Note: Assigning an instance is also valid, e.g.
          // paletteProvider: new BubblePaletteProvider("Green", "Red", yValue => yValue >= 4.0)
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
