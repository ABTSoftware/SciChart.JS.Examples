async function metadataTemplates(divElementId) {
  // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js
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

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
  });

  const growBy = new NumberRange(0.1, 0.1);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

  // #region ExampleA
  // Set a single object, this will be cloned as a template for all metadata on the dataseries
  const dataSeries = new XyDataSeries(wasmContext, {
    xValues: [1, 2, 3, 4, 5],
    yValues: [4.3, 5.3, 6, 6.3, 6.4],
    metadata: { stringValue: "All the same value", customValue: 7 },
  });

  // Update just a metadata value
  // Update just a metadata value.  This will not trigger a chart redraw
  dataSeries.getMetadataAt(0).stringValue = "Updated #0";
  // To force a redraw, use update and pass a new metadata object
  dataSeries.update(1, 5.3, { stringValue: "Updated #1 with redraw", customValue: 99 });
  // Or, to trigger a redraw, call invalidateElement() on the parent SciChartSurface
  sciChartSurface.invalidateElement();
  // #endregion

  // Add a line series with the metadata
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries,
    pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "White" }),
  }));
  // Add a RolloverModifier configured to output X,Y,Metadata.stringValue and customValue
  sciChartSurface.chartModifiers.add(new RolloverModifier( {
    snapToDataPoint: true,
    tooltipDataTemplate: (seriesInfo) => [
      `X: ${seriesInfo.formattedXValue}`,
      `Y: ${seriesInfo.formattedYValue}`,
      `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? 'null'}`,
      `Metadata.customValue: ${seriesInfo.pointMetadata?.customValue ?? 'null'}`
    ]
  }));
  // #endregion

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
    text: "Metadata Templates Example",
    fontSize: 36,
    yCoordShift: -125,
    ... options,
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Hover over the chart to see metadata",
    fontSize: 20,
    yCoordShift: -75,
    ... options,
  }));
};

metadataTemplates("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to add PointMetadata to a DataSeries and consume it in SciChart.js with the BuilderAPI
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EChart2DModifierType,
    EPointMarkerType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.LineSeries,
        // Metadata is set in xyData property
        xyData: {
          xValues: [1, 2, 3, 4, 5],
          yValues: [4.3, 5.3, 6, 6.3, 6.4],
          metadata: { stringValue: "All the same value", customValue: 7 },
        },
        // ...
        // #endregion
        options: {
          stroke: "#C52E60",
          pointMarker: {
            type: EPointMarkerType.Ellipse,
            options: {
              width: 11, height: 11, fill: "White"
            }
          }
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
          `Metadata.stringValue: ${seriesInfo.pointMetadata?.stringValue ?? 'null'}`,
          `Metadata.customValue: ${seriesInfo.pointMetadata?.customValue ?? 'null'}`
        ]
      }
    }]
  });

};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
