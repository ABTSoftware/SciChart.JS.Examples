import {
  SciChartJsNavyTheme,
  SciChartSurface,
  NumericAxis,
  SplineMountainRenderableSeries,
  RubberBandXyZoomModifier,
  ZoomPanModifier,
  RolloverModifier,
  XyDataSeries,
  EllipsePointMarker,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
} from "scichart";

// Initialize a SciChartSurface
export const initChart = async (rootElement) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Add axis
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "X Axis" })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "Y Axis" })
  );

  // Add a series with some data
  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yValues = [1, 4, 7, 3, 7, 6, 7, 4, 2, 5];

  const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      dataSeriesName: "Mountain Series",
      xValues,
      yValues,
    }),
    fill: "SteelBlue",
    stroke: "White",
    strokeThickness: 4,
    opacity: 0.4,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 7,
      height: 7,
      fill: "White",
      strokeThickness: 0,
    }),
  });

  // Setup series rollovermodifier properties
  mountainSeries.rolloverModifierProps.tooltipTextColor = "#fff";
  mountainSeries.rolloverModifierProps.tooltipColor = "SteelBlue";
  mountainSeries.tooltipLabelX = "X";
  mountainSeries.tooltipLabelY = "Y";
  sciChartSurface.renderableSeries.add(mountainSeries);

  // Add some modifiers to the chart
  const rolloverModifier = new RolloverModifier({
    rolloverLineStroke: "LightSteelBlue",
    snapToDataPoint: true,
  });
  const rubberBandZoomModifier = new RubberBandXyZoomModifier({
    stroke: "#FFFFFF77",
    fill: "#FFFFFF33",
    strokeThickness: 1,
  });
  const zoomPanModifier = new ZoomPanModifier();
  const zoomExtentsModifier = new ZoomExtentsModifier();
  const mouseWheelZoomModifier = new MouseWheelZoomModifier();

  // Set the initial state of zoom, pan and tooltip modifiers
  rolloverModifier.isEnabled = false;
  zoomPanModifier.isEnabled = false;
  rubberBandZoomModifier.isEnabled = true;

  sciChartSurface.chartModifiers.add(
    rolloverModifier,
    rubberBandZoomModifier,
    zoomPanModifier,
    zoomExtentsModifier,
    mouseWheelZoomModifier
  );

  // Return the SciChartSurface and modifiers. This will be passed to initResult in the onInit callback
  // by SciChartReact
  return {
    sciChartSurface,
    rolloverModifier,
    zoomPanModifier,
    rubberBandZoomModifier,
  };
};
