import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  FastMountainRenderableSeries,
  FastColumnRenderableSeries,
  XyScatterRenderableSeries,
  NumberRange,
  SciChartJsNavyTheme,
  EllipsePointMarker,
  XyDataSeries,
  EAutoRange,
  SciChartDefaults,
} from "scichart";
import { ChartSpec, ChartType } from "./ChartSpec";
import { DataManager } from "./DataManager";

const createRenderableSeries = (
  wasmContext: any,
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
        fill: "steelblue",
      });
    case ChartType.Scatter:
      return new XyScatterRenderableSeries(wasmContext, {
        ...baseOptions,
        pointMarker: new EllipsePointMarker(wasmContext, {
          width: 11,
          height: 11,
          fill: "#fff",
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
      autoRange: EAutoRange.Always,
      useNativeText: optimized,
      useSharedCache: optimized,
      drawMinorTickLines: !optimized,
      drawMinorGridLines: !optimized,
      drawMajorTickLines: !optimized,
    })
  );

  // Create Y Axis
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      growBy: new NumberRange(0.1, 0.1),
      useNativeText: optimized,
      useSharedCache: optimized,
      drawMinorTickLines: !optimized,
      drawMinorGridLines: !optimized,
      drawMajorTickLines: !optimized,
    })
  );

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
    }
  );

  return { sciChartSurface, unsubscribeDataUpdates };
};
