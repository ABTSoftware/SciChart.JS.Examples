window.renderChart = (chartRootDiv, xValues, yValues) => {
  initSciChart(chartRootDiv, xValues, yValues);
};

async function initSciChart(chartRootDiv, xValues, yValues) {
  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
  } = SciChart;
  // Create the SciChartSurface in chartRootDiv
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    chartRootDiv
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Add a series
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, {
        xValues,
        yValues,
      }),
    })
  );
}
