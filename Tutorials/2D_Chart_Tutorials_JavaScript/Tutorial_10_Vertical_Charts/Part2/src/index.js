import {
  SciChartSurface,
  NumericAxis,
  NumberRange,
  XyDataSeries,
  FastLineRenderableSeries,
  EAxisAlignment,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  RolloverModifier,
} from "scichart";

async function initSciChart() {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    "scichart-root"
  );

  // Generate a data set for sine wave
  const xValues = [];
  const yValues = [];
  for (let i = 0; i <= 100; i++) {
    const x = 0.1 * i;
    xValues.push(x);
    yValues.push(Math.sin(x));
  }

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
      stroke: "orange",
    })
  );

  // #region ExampleA

  // Make the chart vertical by setting X Axis Alignment to Left or Right
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisAlignment: EAxisAlignment.Left,
      axisTitle: "X Axis",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  // Make the chart vertical by setting Y Axis Alignment to Top or Bottom
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisAlignment: EAxisAlignment.Top,
      axisTitle: "Y Axis",
      growBy: new NumberRange(0.1, 0.1),
      // Flip the axis orientation with this property
      flippedCoordinates: true,
    })
  );

  // Add some interactivity modifiers. Everything is transposed in a vertical chart
  // so zoom/pan and rollover works vertically

  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(new RolloverModifier());

  // #endregion
}

initSciChart();
