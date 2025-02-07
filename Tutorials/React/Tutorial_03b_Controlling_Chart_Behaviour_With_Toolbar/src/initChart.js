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

export const initChart = async (rootElement) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

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
  mountainSeries.rolloverModifierProps.tooltipTextColor = "#fff";
  mountainSeries.rolloverModifierProps.tooltipColor = "SteelBlue";
  mountainSeries.tooltipLabelX = "X";
  mountainSeries.tooltipLabelY = "Y";
  sciChartSurface.renderableSeries.add(mountainSeries);

  const rolloverModifier = new RolloverModifier({
    rolloverLineStroke: "LightSteelBlue",
  });
  const rubberBandZoomModifier = new RubberBandXyZoomModifier();
  const zoomPanModifier = new ZoomPanModifier();
  const zoomExtentsModifier = new ZoomExtentsModifier();
  const mouseWheelZoomModifier = new MouseWheelZoomModifier();
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

  return {
    sciChartSurface,
    rolloverModifier,
    zoomPanModifier,
    rubberBandZoomModifier,
  };
};
