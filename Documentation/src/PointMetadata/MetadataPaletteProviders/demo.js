// #region ExampleA
const {
  DefaultPaletteProvider,
  EStrokePaletteMode,
  parseColorToUIntArgb
} = SciChart;

// or for npm import { DefaultPaletteProvider, EStrokePaletteMode } from "scichart"

// PaletteProvider to use data from metadata to color the line segments
class LinePaletteProvider extends DefaultPaletteProvider {
  constructor() {
    super();
    this.strokePaletteMode = EStrokePaletteMode.SOLID;
  }
  overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
    if (metadata && metadata.color) {
      // if metadata.color exists, parse this from HTML Hex code to a UInt ARGB value
      // Note: for performance reasons its better to preconvert hex to UInt rather than do it on the fly here
      return parseColorToUIntArgb(metadata.color);
    } else {
      // Returning undefined means use default series stroke color
      return undefined;
    }
  }
}
// #endregion

async function metadataPaletteProviders(divElementId) {
  // Demonstrates how to combine PointMetadata and PaletteProviders in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    EllipsePointMarker,
    NumberRange,
    RolloverModifier
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
  });

  const growBy = new NumberRange(0.1, 0.1);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

  // Create metadata with initial values. Metadata can be any JS object
  const dataSeries = new XyDataSeries(wasmContext, {
    xValues: [1, 2, 3, 4, 5, 6, 7, 8],
    yValues: [4.3, 5.3, 6, 6.3, 6.4, 6.1, 5.9, 5.5],
    metadata: [
      { color: "#ff6600" },
      { color: "#50C7E0" },
      { color: "#50C7E0" },
      { color: "#ff6600" },
      { color: "#50C7E0" },
      undefined, // nothing at this index
      { color: "#EC0F6C" },
      { color: "#ff6600" },
    ]
  });

  // Add a line series with the metadata and palette provider
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    strokeThickness: 2,
    dataSeries,
    // Apply the PaletteProvider
    paletteProvider: new LinePaletteProvider(),
    pointMarker: new EllipsePointMarker(wasmContext, { width: 5, height: 5, fill: "White", strokeThickness: 0 }),
  }));
  // #endregion

  // Add a RolloverModifier configured to output X,Y,Metadata.stringValue and customValue
  sciChartSurface.chartModifiers.add(new RolloverModifier( {
    snapToDataPoint: true,
    tooltipDataTemplate: (seriesInfo) => [
      `X: ${seriesInfo.formattedXValue}`,
      `Y: ${seriesInfo.formattedYValue}`,
      `index: ${seriesInfo.dataSeriesIndex}`,
      `Metadata.color: ${seriesInfo.pointMetadata?.color ?? 'null'}`
    ]
  }));


  const { TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
  const options = {
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    x1: 0.5,
    y1: 0.5,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    opacity: 0.33,
    textColor: "White",
  };
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Metadata & PaletteProviders Example",
    fontSize: 36,
    yCoordShift: -125,
    ... options,
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Using Metadata to colour line segments",
    fontSize: 20,
    yCoordShift: -75,
    ... options,
  }));
};

metadataPaletteProviders("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleC
  // Demonstrates how to combine PointMetadata and PaletteProviders in SciChart.js with the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EChart2DModifierType,
    EPointMarkerType,
    EBaseType,
    EPaletteProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // Register the custom LinePaletteProvider with the chartBuilder
  chartBuilder.registerType(EBaseType.PaletteProvider, "LinePaletteProvider",
    (options) => new LinePaletteProvider());

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.LineSeries,
        // Metadata is set in xyData property
        xyData: {
          xValues: [1, 2, 3, 4, 5, 6, 7, 8],
          yValues: [4.3, 5.3, 6, 6.3, 6.4, 6.1, 5.9, 5.5],
          metadata: [
            { color: "#ff6600" },
            { color: "#50C7E0" },
            { color: "#50C7E0" },
            { color: "#ff6600" },
            { color: "#50C7E0" },
            undefined, // nothing at this index
            { color: "#EC0F6C" },
            { color: "#ff6600" },
          ]
        },
        options: {
          stroke: "#C52E60",
          // Now you can instantiate using parameters below
          paletteProvider: {
            type: EPaletteProviderType.Custom,
            customType: "LinePaletteProvider",
          },
          // Note: Assigning an instance is also valid, e.g.
          // paletteProvider: new ThresholdLinePaletteProvider("Green", yValue => yValue >= 4.0)
          pointMarker: {
            type: EPointMarkerType.Ellipse,
            options: {
              width: 5, height: 5, fill: "White"
            }
          },
        }
      }
    ],
    // Configure a Rollovermodifier to display metadata
    modifiers: [{
      type: EChart2DModifierType.Rollover,
      options: {
        snapToDataPoint: true,
        tooltipDataTemplate: (seriesInfo) => [
          `X: ${seriesInfo.formattedXValue}`,
          `Y: ${seriesInfo.formattedYValue}`,
          `index: ${seriesInfo.dataSeriesIndex}`,
          `Metadata.color: ${seriesInfo.pointMetadata?.color ?? 'null'}`
        ]
      }
    }]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
builderExample("scichart-root");
