import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  StackedColumnRenderableSeries,
  StackedColumnCollection,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
} from "scichart";

export const drawExample = async (divId) => {
  // Create a SciChartSurface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Data for the example
  const xValues = [1992, 1993, 1994, 1995];
  const yValues1 = [10, 13, 7, 16];
  const yValues2 = [12, 17, 21, 15];

  // Create some RenderableSeries - for each part of the stacked column
  const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues1,
      dataSeriesName: "EU",
      containsNaN: false,
      isSorted: true,
    }),
    fill: "#2277CC",
    stackedGroupId: "StackedGroupId",
  });

  const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
      dataSeriesName: "Asia",
      containsNaN: false,
      isSorted: true,
    }),
    fill: "#EC5F6C",
    stackedGroupId: "StackedGroupId2",
  });

  // To add the series to the chart, put them in a StackedColumnCollection
  const stackedColumnCollection = new StackedColumnCollection(wasmContext);

  // Add the series to the StackedColumnCollection
  stackedColumnCollection.add(rendSeries1, rendSeries2);

  // Add the Stacked Column collection to the chart
  sciChartSurface.renderableSeries.add(stackedColumnCollection);

  // Add zooming and panning behaviour
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

  return { sciChartSurface, wasmContext };
};
