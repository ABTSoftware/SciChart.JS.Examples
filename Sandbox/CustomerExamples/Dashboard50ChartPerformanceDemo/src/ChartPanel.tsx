import React from "react";
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
} from "scichart";
import { SciChartReact } from "scichart-react";
import { ChartSpec, ChartType } from "./ChartSpec";

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
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));

  // Create Y Axis
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      growBy: new NumberRange(0.1, 0.1),
    })
  );

  // Create data series
  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yValues = [
    0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173, 0.7833,
  ];

  // Create series based on chart type and add to chart
  sciChartSurface.renderableSeries.add(
    createRenderableSeries(
      wasmContext,
      new XyDataSeries(wasmContext, { xValues, yValues }),
      spec.chartType
    )
  );

  // Add chart modifiers
  // sciChartSurface.chartModifiers.add(
  //   new MouseWheelZoomModifier(),
  //   new ZoomPanModifier({ enableZoom: true }),
  //   new ZoomExtentsModifier()
  // );

  return { sciChartSurface };
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ chartSpec, style }) => {
  return (
    <SciChartReact
      initChart={(rootElement) => initChart(rootElement, chartSpec)}
      style={style}
    />
  );
};

export default ChartPanel;
