import {
  EAutoRange,
  EAxisAlignment,
  EllipsePointMarker,
  FastColumnRenderableSeries,
  FastLineRenderableSeries,
  FastMountainRenderableSeries,
  NumberRange,
  NumericAxis,
  SciChartDefaults,
  SciChartJsNavyTheme,
  SciChartSurface,
  TSciChart,
  XyDataSeries,
  XyScatterRenderableSeries,
} from "scichart";
import { ChartSpec, ChartType } from "./ChartSpec";
import { DataManager } from "../DataManager/DataManager";

// Creates a RenderableSeries based on ChartType
const createRenderableSeries = (
  wasmContext: TSciChart,
  dataSeries: XyDataSeries,
  chartType: ChartType
) => {
  const baseOptions = {
    stroke: "steelblue",
    strokeThickness: 3,
    dataSeries,
  };

  switch (chartType) {
    case ChartType.Line:
      return new FastLineRenderableSeries(wasmContext, baseOptions);
    case ChartType.Mountain:
      return new FastMountainRenderableSeries(wasmContext, {
        ...baseOptions,
        fill: "rgba(70,130,180,0.2)",
      });
    case ChartType.Column:
      return new FastColumnRenderableSeries(wasmContext, {
        ...baseOptions,
        dataPointWidth: 1,
        fill: "#ae418d",
        stroke: "#ae418d",
        strokeThickness: 1,
      });
    case ChartType.Scatter:
      return new XyScatterRenderableSeries(wasmContext, {
        ...baseOptions,
        pointMarker: new EllipsePointMarker(wasmContext, {
          width: 7,
          height: 7,
          fill: "#ff6600",
          strokeThickness: 0,
        }),
      });
    default:
      return new FastLineRenderableSeries(wasmContext, baseOptions);
  }
};

export const initChart = async (
  rootElement: string | HTMLDivElement,
  spec: ChartSpec
) => {
  // Apply optimization settings
  if (spec.useNativeText) {
    SciChartDefaults.useNativeText = true;
    SciChartDefaults.useSharedCache = true;
  }

  // Create the SciChartSurface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
      // NEW to SciChart.js 3.5.727!
      // Freezes drawing (but not data updates) on charts which are outside the viewport
      freezeWhenOutOfView: spec.hideOutOfView,
    }
  );

  // Depending on optimization flags, create optimal xAxis settings
  const axisOptions = {
    // When useNativeText, also use label Caching
    useNativeText: spec.useNativeText,
    useSharedCache: spec.cacheLabels,

    // Hide elements which add to the draw time, but are barely visible due to chart size
    drawMinorTickLines: !spec.reduceAxisElements,
    drawMinorGridLines: !spec.reduceAxisElements,
    drawMajorTickLines: !spec.reduceAxisElements,
    drawMajorGridLines: !spec.reduceAxisElements,
    drawMajorBands: !spec.reduceAxisElements,
    maxAutoTicks: spec.reduceAxisElements ? 5 : undefined, // Reduce number of labels on screen

    // Hide labels if specified
    drawLabels: spec.drawLabels,
  };

  // Create X Axis
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      ...axisOptions,
      labelPrecision: 0,
    })
  );

  // Create Y Axis
  const yAxis = new NumericAxis(wasmContext, {
    ...axisOptions,
    // Depending on optimized flag, create optimal xAxis settings
    growBy: new NumberRange(0.1, 0.1),
    axisAlignment: EAxisAlignment.Left,
  });
  sciChartSurface.yAxes.add(yAxis);

  yAxis.visibleRange = new NumberRange(0, 1);

  if (spec.reduceAxisElements) {
    // Force YAxis ticks to be equal to 0, 0.5, 1.0 always, aesthetically pleasing plus fewer labels
    yAxis.tickProvider.getMajorTicks = (
      minorDelta,
      majoredDelta,
      visibleRange
    ) => [0, 0.5, 1];
  }

  // Create data series
  const dataSeries = new XyDataSeries(wasmContext, {
    fifoCapacity: spec.pointCount,
    // dataSeries distribution flags are normally calculated by SciChart
    // If you know the data-distribution, specifying these flags saves some time on append()
    containsNaN: false,
    dataIsSortedInX: true,
    dataEvenlySpacedInX: true,
  });

  // Create series based on chart type and add to chart
  sciChartSurface.renderableSeries.add(
    createRenderableSeries(wasmContext, dataSeries, spec.chartType)
  );

  // Subscribe to data updates, returning the unsubscribeDataUpdates function which is called on chart delete
  const unsubscribeDataUpdates = DataManager.getInstance(
    spec.dataUpdateRate
  ).subscribeDataUpdate((timestamp, xValues, yValues) => {
    // Append data to the chart
    if (xValues.length === 1) {
      dataSeries.append(xValues[0], yValues[0]);
    } else {
      dataSeries.appendRange(xValues, yValues);
    }

    // Scroll the xAxis
    sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(
      xValues[xValues.length - 1] - spec.pointCount,
      xValues[xValues.length - 1]
    );
  });

  // Return the SciChartSurface, and onDeleteChart callback to unsubscribe to data updates on teardown
  return {
    sciChartSurface,
    onDeleteChart: () => {
      unsubscribeDataUpdates();
    },
  };
};
