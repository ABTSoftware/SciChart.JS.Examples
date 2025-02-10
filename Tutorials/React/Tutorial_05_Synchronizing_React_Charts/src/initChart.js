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
} from "scichart";

export const initChart = async (divElement, chartId) => {
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
    })
  );

  // Add modifiers
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier(),
    new RolloverModifier()
  );

  const setData = (xValues, yValues) => {
    // Clear existing series
    sciChartSurface.renderableSeries.clear();

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
    });

    sciChartSurface.renderableSeries.add(mountainSeries);
  };

  return { sciChartSurface, setData };
};
