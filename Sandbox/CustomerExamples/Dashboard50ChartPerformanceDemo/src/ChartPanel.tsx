import React, { useEffect, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  FastMountainRenderableSeries,
  FastColumnRenderableSeries,
  XyScatterRenderableSeries,
  NumberRange,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
  SciChartJsNavyTheme,
  EllipsePointMarker,
  XyDataSeries,
  EAutoRange,
} from "scichart";
import { SciChartReact } from "scichart-react";
import { ChartSpec, ChartType } from "./ChartSpec";
import { DataManager } from "./DataManager";

interface ChartPanelProps {
  chartSpec: ChartSpec;
  style?: React.CSSProperties;
}

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

const initChart = async (
  rootElement: string | HTMLDivElement,
  spec: ChartSpec
) => {
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
    new NumericAxis(wasmContext, { autoRange: EAutoRange.Always })
  );

  // Create Y Axis
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  // Create data series
  const dataSeries = new XyDataSeries(wasmContext);

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

  // Add chart modifiers
  // sciChartSurface.chartModifiers.add(
  //   new MouseWheelZoomModifier(),
  //   new ZoomPanModifier({ enableZoom: true }),
  //   new ZoomExtentsModifier()
  // );

  return { sciChartSurface, unsubscribeDataUpdates };
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ chartSpec, style }) => {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup subscription when component unmounts
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return (
    <SciChartReact
      initChart={async (rootElement) => initChart(rootElement, chartSpec)}
      onDelete={(initResult) => initResult.unsubscribeDataUpdates()}
      style={style}
    />
  );
};

export default ChartPanel;
