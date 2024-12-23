import {
  SciChartSurface,
  NumericAxis,
  NumberRange,
  XyDataSeries,
  FastLineRenderableSeries,
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

  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "X Axis",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Y Axis",
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
      stroke: "orange",
    })
  );
}

initSciChart();
