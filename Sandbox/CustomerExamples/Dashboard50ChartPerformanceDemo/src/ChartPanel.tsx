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
      title: "SciChart.js First Chart",
      titleStyle: { fontSize: 22 },
    }
  );

  // Set theme
  sciChartSurface.applyTheme(new SciChartJsNavyTheme());

  // Create X Axis
  const xAxis = new NumericAxis(wasmContext, {
    axisTitle: "X Axis",
    growBy: new NumberRange(0.1, 0.1),
  });

  // Create Y Axis
  const yAxis = new NumericAxis(wasmContext, {
    axisTitle: "Y Axis",
    growBy: new NumberRange(0.1, 0.1),
  });

  // Create data series
  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yValues = [
    0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173, 0.7833,
  ];
  const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });

  // Create series based on chart type
  const renderableSeries = createRenderableSeries(
    wasmContext,
    dataSeries,
    spec.chartType
  );

  // Add axes and series to chart
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);
  sciChartSurface.renderableSeries.add(renderableSeries);

  // Add chart modifiers
  sciChartSurface.chartModifiers.add(
    new MouseWheelZoomModifier(),
    new ZoomPanModifier({ enableZoom: true }),
    new ZoomExtentsModifier()
  );

  return { sciChartSurface };
};

export const ChartPanel: React.FC<ChartPanelProps> = ({ chartSpec }) => {
  return (
    <SciChartReact
      initChart={(rootElement) => initChart(rootElement, chartSpec)}
      style={{ maxWidth: 900, height: 300 }}
    />
  );
};

export default ChartPanel;
