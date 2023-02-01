import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries } from "scichart";

const generateData = (limit: number, step: number) => {
  const xValues = [];
  const yValues = [];

  for (let i = 0; i <= limit; i += step) {
    xValues.push(i);
    yValues.push(Math.random() * 20);
  }

  return { xValues, yValues };
};

const initSciChart = async () => {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    "chart"
  );

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const { xValues, yValues } = generateData(50, 1);

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    })
  );

};

initSciChart();