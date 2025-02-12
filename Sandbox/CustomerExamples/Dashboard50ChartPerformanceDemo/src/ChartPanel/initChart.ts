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
  spec: ChartSpec,
  optimized: boolean = true
) => {
  // Apply optimization settings
  if (optimized) {
    SciChartDefaults.useNativeText = true;
    SciChartDefaults.useSharedCache = true;
  }

  // Create the SciChartSurface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      title: spec.chartTitle,
      titleStyle: { fontSize: 18 },
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Create X Axis
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      useNativeText: optimized,
      useSharedCache: optimized,
      drawMinorTickLines: !optimized,
      drawMinorGridLines: !optimized,
      drawMajorTickLines: !optimized,
      maxAutoTicks: optimized ? 5 : undefined,
      labelPrecision: 0,
    })
  );

  // Create Y Axis
  const yAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0.1, 0.1),
    useNativeText: optimized,
    useSharedCache: optimized,
    drawMinorTickLines: !optimized,
    drawMinorGridLines: !optimized,
    drawMajorTickLines: !optimized,
    autoRange: EAutoRange.Always,
    axisAlignment: EAxisAlignment.Left,
  });
  sciChartSurface.yAxes.add(yAxis);

  if (optimized) {
    yAxis.visibleRange = new NumberRange(0, 1);
    yAxis.tickProvider.getMajorTicks = (
      minorDelta,
      majoredDelta,
      visibleRange
    ) => [0, 0.5, 1];
  }

  // Create data series
  const dataSeries = new XyDataSeries(wasmContext, {
    fifoCapacity: spec.pointCount,
  });

  // Create series based on chart type and add to chart
  sciChartSurface.renderableSeries.add(
    createRenderableSeries(wasmContext, dataSeries, spec.chartType)
  );

  // Subscribe to data updates
  const unsubscribeDataUpdates = DataManager.getInstance().subscribeDataUpdate(
    (timestamp, xValues, yValues) => {
      dataSeries.appendRange(xValues, yValues);

      sciChartSurface.xAxes.get(0).visibleRange = new NumberRange(
        xValues[xValues.length - 1] - spec.pointCount,
        xValues[xValues.length - 1]
      );
    }
  );

  // Return the SciChartSurface, and onDeleteChart callback to unsubscribe to data updates on teardown
  return { sciChartSurface, onDeleteChart: unsubscribeDataUpdates };
};
