import {
  SciChartSurface,
  NumericAxis,
  EAxisAlignment,
  FastLineRenderableSeries,
  XyDataSeries,
  YAxisDragModifier,
  XAxisDragModifier,
  TextAnnotation,
} from "scichart";

async function initSciChart() {
  // #region ExampleA

  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext, {
    // If not set, axis.id will default to AxisCore.DEFAULT_AXIS_ID
    axisTitle: "Primary XAxis",
    axisAlignment: EAxisAlignment.Bottom,
  });
  const xAxis2 = new NumericAxis(wasmContext, {
    axisTitle: "Secondary XAxis",
    id: "XAxis_2",
    axisAlignment: EAxisAlignment.Top,
  });
  const yAxis = new NumericAxis(wasmContext, {
    // If not set, axis.id will default to AxisCore.DEFAULT_AXIS_ID
    axisTitle: "Primary YAxis",
    axisAlignment: EAxisAlignment.Left,
  });
  const yAxis2 = new NumericAxis(wasmContext, {
    axisTitle: "Secondary YAxis",
    id: "YAxis_2",
    axisAlignment: EAxisAlignment.Right,
  });
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.xAxes.add(xAxis2);
  sciChartSurface.yAxes.add(yAxis);
  sciChartSurface.yAxes.add(yAxis2);

  // #endregion

  // #region ExampleB

  // Create first series and bind to the first Y axis
  const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
    stroke: "#33F9FF",
    // Specify xAxisId, yAxisId.
    // Therefore this series will bind to the Secondary XAxis and YAxis
    xAxisId: "XAxis_2",
    yAxisId: "YAxis_2",
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [0, 1, 2, 3],
      yValues: [0, 60, 160, 300],
    }),
  });
  sciChartSurface.renderableSeries.add(lineSeries1);

  // Create second series and bind to the second Y axis
  const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
    // If not set, yAxisId, xAxisId will default to AxisCore.DEFAULT_AXIS_ID
    // therefore this series will bind to the Primary XAxis and YAxis
    stroke: "#33ff33",
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [0, 1, 2, 3, 4],
      yValues: [0, 101, 240, 500, 600],
    }),
  });
  sciChartSurface.renderableSeries.add(lineSeries2);

  // #endregion

  // #region ExampleC

  sciChartSurface.annotations.add(
    new TextAnnotation({
      text: "Annotations on Axis!",
      x1: 1,
      y1: 200,
      // If not set, yAxisId, xAxisId will default to AxisCore.DEFAULT_AXIS_ID
      // This annotation will be bound to the Secondary XAxis and YAxis
      xAxisId: "XAxis_2",
      yAxisId: "YAxis_2",
    })
  );

  // #endregion

  // #region ExampleD

  // import { YAxisDragModifier ... } from "scichart";

  sciChartSurface.chartModifiers.add(new YAxisDragModifier());
  sciChartSurface.chartModifiers.add(new XAxisDragModifier());

  // #endregion
}

initSciChart();
