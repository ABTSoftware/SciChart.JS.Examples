
async function pinchZoom2D(divElementId) {

  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [];
  const yValues = [];
  const yValues2 = [];
  for(let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
    yValues2.push(0.5 * Math.cos(i*0.11) - Math.sin(i * 0.015));
  }

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues,
    })
  }));

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#50C7E0",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
    })
  }));

  // Add annotations to tell the user what to do
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Pinch-Zoom 2D Demo",
    x1: 0.5, y1: 0.5,
    yCoordShift: 0,
    xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
    opacity: 0.33,
    fontSize: 36,
    fontWeight: "Bold"
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Pinch touch screen to zoom. To add pan behaviour, use ZoomPanModifier",
    x1: 0.5, y1: 0.5,
    yCoordShift: 50,
    xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
    opacity: 0.45,
    fontSize: 17,
  }));

  // #region ExampleA
  const {
    PinchZoomModifier
  } = SciChart;

  // or for npm: import { PinchZoomModifier } from "scichart";

  // Add PinchZoom behaviour to the chart
  sciChartSurface.chartModifiers.add(new PinchZoomModifier({
    // Optional parameters specify the amount of zooming in X/Y. Default is 0.005
    horizontalGrowFactor: 0.005,
    verticalGrowFactor: 0.005,
    // Optional parameters to include/exclude X/Y axis from zooming by axis.id
    // If not specified, by default, all axis are included in zooming
    // either use:
    // excludedXAxisIds: ["XAxis1"],
    // excludedYAxisIds: ["YAxis1"],
    // or:
    // includedXAxisIds: ["XAxis2"],
    // includedYAxisIds: ["YAxis2"],
  }));

  // Add the modifier to the chart
  sciChartSurface.chartModifiers.add(new PinchZoomModifier());
  // #endregion
};

pinchZoom2D("scichart-root");


async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to configure an inner axis in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    EChart2DModifierType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: { type: EAxisType.NumericAxis },
    yAxes: { type: EAxisType.NumericAxis },
    modifiers: [{
      type: EChart2DModifierType.PinchZoom,
      options: {
        // Optional parameters specify the amount of zooming in X/Y  Default is 0.005
        horizontalGrowFactor: 0.005,
        verticalGrowFactor: 0.005
      }
    }]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");


