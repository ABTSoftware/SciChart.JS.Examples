import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {UniformHeatmapDataSeries} from "scichart/Charting/Model/UniformHeatmapDataSeries";
import {UniformHeatmapRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import {HeatmapColorMap} from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {CursorModifier} from "scichart/Charting/ChartModifiers/CursorModifier";
import {EAxisAlignment} from "scichart/types/AxisAlignment";

async function initSciChart() {
  // LICENSING //
  // Set your license code here
  // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  //
  // e.g.
  //
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
  //
  // Also, once activated (trial or paid license) having the licensing wizard open on your machine
  // will mean any or all applications you run locally will be fully licensed.

  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "X Axis" })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "Y Axis", axisAlignment: EAxisAlignment.Left })
  );

  const initialZValues = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11]
  ];

  // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
  const heatmapDataSeries = new UniformHeatmapDataSeries(
    wasmContext,
    0,
    1,
    0,
    1,
    initialZValues
  );

  const gradientStops = [
    { offset: 0, color: "yellow" },
    { offset: 1, color: "red" }
  ];

  // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
  // HeatmapDataSeries which correspond to gradient stops at 0..1
  const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
    opacity: 0.5,
    dataSeries: heatmapDataSeries,
    colorMap: new HeatmapColorMap({ minimum: 0, maximum: 11, gradientStops })
  });

  // Add heatmap to the chart
  sciChartSurface.renderableSeries.add(heatmapSeries);

  // Add interaction
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
}

initSciChart();

async function initSciChart2() {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root-2"
  );
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisAlignment: EAxisAlignment.Left,
      axisTitle: "X Axis",
      flippedCoordinates: true
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisAlignment: EAxisAlignment.Bottom,
      axisTitle: "Y Axis",
      flippedCoordinates: true
    })
  );

  const initialZValues = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11]
  ];

  // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
  const heatmapDataSeries = new UniformHeatmapDataSeries(
    wasmContext,
    0,
    1,
    0,
    1,
    initialZValues
  );

  const gradientStops = [
    { offset: 0, color: "yellow" },
    { offset: 1, color: "red" }
  ];

  // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
  // HeatmapDataSeries which correspond to gradient stops at 0..1
  const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
    opacity: 0.5,
    dataSeries: heatmapDataSeries,
    colorMap: new HeatmapColorMap({ minimum: 0, maximum: 11, gradientStops })
  });

  // Add heatmap to the chart
  sciChartSurface.renderableSeries.add(heatmapSeries);

  // Add interaction
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
}

initSciChart2();
