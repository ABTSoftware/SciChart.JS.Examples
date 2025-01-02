import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
} from "scichart";

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Declare a DataSeries
  const xyDataSeries = new XyDataSeries(wasmContext);
  xyDataSeries.append(1, 2);
  xyDataSeries.append(3, 4);

  // Add a line series to the SciChartSurface
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      strokeThickness: 3,
      stroke: "rgba(255, 0, 0, 1)",
      dataSeries: xyDataSeries,
    })
  );

  // zoom to fit (optional, will occur automatically once on startup)
  sciChartSurface.zoomExtents();
}

initSciChart();
