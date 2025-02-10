import {
  SciChartSurface,
  NumericAxis,
  SplineMountainRenderableSeries,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  RolloverModifier,
  XyDataSeries,
  EllipsePointMarker,
  SciChartJsNavyTheme,
  EAutoRange,
  NumberRange,
  WaveAnimation,
} from "scichart";

export const initChart = async (divElement, chartId, chartGroupId) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElement,
    {
      title: `Chart ${chartId}`,
      titleStyle: { fontSize: 16 },
      theme: new SciChartJsNavyTheme(),
    }
  );

  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "X Axis",
      axisTitleStyle: { fontSize: 12 },
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Y Axis",
      axisTitleStyle: { fontSize: 12 },
      autoRange: EAutoRange.Always,
      growBy: new NumberRange(0, 0.1),
    })
  );

  // #region AddModifiers
  // Add modifiers for zoom, pan and tooltip behaviour
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier(),
    new RolloverModifier({
      modifierGroup: chartGroupId,
      rolloverLineStroke: "LightSteelBlue",
      snapToDataPoint: true,
    })
  );
  // #endregion

  // Add a setData function. This will accept xValues and yValues and update the chart
  // creating a new series each time.
  const setData = (xValues, yValues) => {
    // Clear existing series, deleting memory by passing callDeleteOnChildren: true
    sciChartSurface.renderableSeries.clear(true);

    // Create new series
    const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues,
      }),
      pointMarker: new EllipsePointMarker(wasmContext, {
        fill: "SteelBlue",
        stroke: "White",
      }),
      animation: new WaveAnimation({ duration: 1000, fadeEffect: true }),
    });

    // Setup series rollovermodifier properties
    mountainSeries.rolloverModifierProps.tooltipTextColor = "#fff";
    mountainSeries.rolloverModifierProps.tooltipColor = "SteelBlue";
    mountainSeries.tooltipLabelX = "X";
    mountainSeries.tooltipLabelY = "Y";

    sciChartSurface.renderableSeries.add(mountainSeries);
    sciChartSurface.zoomExtents();
  };

  // return values from initChart() go into initResult in <SciChartReact onInit={initResult => {}} />
  return { sciChartSurface, setData };
};
