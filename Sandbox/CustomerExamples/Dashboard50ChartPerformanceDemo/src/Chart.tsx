import React from "react";
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  NumberRange,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
  SweepAnimation,
  SciChartJsNavyTheme,
  EllipsePointMarker,
  XyDataSeries,
} from "scichart";
import { SciChartReact } from "scichart-react";

const initChart = async (rootElement: string | HTMLDivElement) => {
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

  // Create Line Series
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "steelblue",
    strokeThickness: 3,
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 11,
      height: 11,
      fill: "#fff",
    }),
    animation: new SweepAnimation({
      duration: 300,
      fadeEffect: true,
    }),
    dataSeries,
  });

  // Add axes and series to chart
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);
  sciChartSurface.renderableSeries.add(lineSeries);

  // Add chart modifiers
  sciChartSurface.chartModifiers.add(
    new MouseWheelZoomModifier(),
    new ZoomPanModifier({ enableZoom: true }),
    new ZoomExtentsModifier()
  );

  return { sciChartSurface };
};

export const Chart = () => {
  return (
    <SciChartReact
      initChart={initChart}
      style={{ maxWidth: 900, height: 600 }}
    />
  );
};

export default Chart;
