import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { UniformHeatmapDataSeries } from "scichart/Charting/Model/UniformHeatmapDataSeries";
import { UniformHeatmapRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { CursorModifier } from "scichart/Charting/ChartModifiers/CursorModifier";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

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
    new NumericAxis(wasmContext, { axisTitle: "Heatmap X" })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Heatmap Y",
      axisAlignment: EAxisAlignment.Left
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
  const colorMap = new HeatmapColorMap({
    minimum: 0,
    maximum: 11,
    gradientStops
  });

  // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
  // HeatmapDataSeries which correspond to gradient stops at 0..1
  const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
    opacity: 0.5,
    dataSeries: heatmapDataSeries,
    colorMap
  });

  // Add heatmap to the chart
  sciChartSurface.renderableSeries.add(heatmapSeries);

  const initialZValues2 = [
    [1, 2, 1, 2],
    [2, 1, 2, 3]
  ];

  // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
  const heatmapDataSeries2 = new UniformHeatmapDataSeries(
    wasmContext,
    0,
    1,
    3,
    1,
    initialZValues2
  );

  // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
  // HeatmapDataSeries which correspond to gradient stops at 0..1
  const heatmapSeries2 = new UniformHeatmapRenderableSeries(wasmContext, {
    opacity: 0.5,
    dataSeries: heatmapDataSeries2,
    colorMap
  });

  // Add heatmap to the chart
  sciChartSurface.renderableSeries.add(heatmapSeries2);

  const allHeatmaps = [heatmapSeries, heatmapSeries2];

  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Averages",
      axisAlignment: EAxisAlignment.Right,
      id: "y2axis"
    })
  );

  const xValues = [0.5, 1.5, 2.5, 3.5];
  const yValues = calcYValues(allHeatmaps);

  let lineChartData = new XyDataSeries(wasmContext, {
    xValues,
    yValues
  });

  const lineRendSeries = new FastLineRenderableSeries(wasmContext, {
    dataSeries: lineChartData,
    yAxisId: "y2axis",
    strokeThickness: 3
  });

  sciChartSurface.renderableSeries.add(lineRendSeries);

  // Add interaction
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));

  const checkbox1 = document.querySelector("#firstHeatmap");
  checkbox1.addEventListener("change", e => {
    heatmapSeries.isVisible = (e.target as HTMLInputElement).checked;
    updateLineChart();
    sciChartSurface.zoomExtents();
  });

  const checkbox2 = document.querySelector("#secondHeatmap");
  checkbox2.addEventListener("change", e => {
    heatmapSeries2.isVisible = (e.target as HTMLInputElement).checked;
    updateLineChart();
    sciChartSurface.zoomExtents();
  });

  const updateLineChart = () => {
    const newYValues = calcYValues(allHeatmaps);
    const newLineChartData = new XyDataSeries(wasmContext, {
      xValues,
      yValues: newYValues
    });
    lineRendSeries.dataSeries = newLineChartData;
    lineChartData.delete();
    lineChartData = newLineChartData;
  }
}

initSciChart();

const calcYValues = (
  allHeatmaps: UniformHeatmapRenderableSeries[],
  width = 4
) => {
  const res = [];
  for (let i = 0; i < 4; i++) {
    let count = 0;
    let sum = 0;
    allHeatmaps.forEach(hs => {
      if (hs.isVisible) {
        const heatmapDataSeries = hs.dataSeries as UniformHeatmapDataSeries;
        const rows = heatmapDataSeries.arrayHeight;
        count += rows;
        for (let j = 0; j < rows; j++) {
          sum += heatmapDataSeries.getZValue(j, i);
        }
      }
    });
    const resTemp = count > 0 ? sum / count : 0;
    res.push(resTemp);
  }
  return res;
};
