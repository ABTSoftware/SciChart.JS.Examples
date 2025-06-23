import {
  SciChartSurface,
  NumericAxis,
  EAxisAlignment,
  FastLineRenderableSeries,
  XyDataSeries,
  YAxisDragModifier,
  XAxisDragModifier,
  TextAnnotation,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
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
    axisTitle: "Primary XAxis",
    axisAlignment: EAxisAlignment.Bottom,
  });
  const xAxis2 = new NumericAxis(wasmContext, {
    axisTitle: "Secondary XAxis",
    axisAlignment: EAxisAlignment.Top,
  });
  const yAxis = new NumericAxis(wasmContext, {
    axisTitle: "Primary YAxis",
    axisAlignment: EAxisAlignment.Left,
  });
  const yAxis2 = new NumericAxis(wasmContext, {
    axisTitle: "Secondary YAxis",
    axisAlignment: EAxisAlignment.Right,
  });
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.xAxes.add(xAxis2);
  sciChartSurface.yAxes.add(yAxis);
  sciChartSurface.yAxes.add(yAxis2);

  // #endregion

  // #region ExampleB

  // Create first series and bind to the first X and Y axis
  const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
    // If not set, xAxisId, yAxisId will default to the first X and Y axes added to sciChartSurface
    // therefore this series will bind to the Primary XAxis and YAxis
    stroke: "#33F9FF",
    strokeThickness: 6,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [0, 1, 2, 3],
      yValues: [0, 60, 160, 300],
    }),
  });
  sciChartSurface.renderableSeries.add(lineSeries1);

  // Create second series and bind to the second Y axis
  const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
    // Specify xAxisId, yAxisId.
    // Therefore this series will bind to the Secondary XAxis and YAxis
    xAxisId: xAxis2.id,
    yAxisId: yAxis2.id,
    stroke: "#33ff33",
    strokeThickness: 2,
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
      x1: 2,
      y1: 400,
      // If not set, yAxisId, xAxisId will default to the first X and Y axes
      // This annotation will be bound to the Secondary XAxis and YAxis
      xAxisId: xAxis2.id,
      yAxisId: yAxis2.id,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Center,
    })
  );
  // #endregion

  // #region ExampleD
  sciChartSurface.chartModifiers.add(new XAxisDragModifier());
  sciChartSurface.chartModifiers.add(new YAxisDragModifier());
  // #endregion
}

initSciChart();
