const {
  SciChartSurface,
  NumericAxis,
  SciChartJsNavyTheme,
  Rect,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  NumericRange,
  EventHandler,
  XyDataSeries,
  FastLineRenderableSeries,
} = SciChart;

let colorIndex = 0;
function getRandomColor() {
  return ["#47bde6", "#ae418d", "#e97064", "#68bcae", "#634e96"][
    colorIndex++ % 5
  ];
}

function generateRandomData(count = 100) {
  const xValues = [];
  const yValues = [];
  for (let i = 0; i < count; i++) {
    xValues.push(i);
    yValues.push(Math.random() * 100);
  }
  return { xValues, yValues };
}

// or, import { SciChartSurface, ... } from "scichart" for npm

// #region AxisSynchroniser
// Helper class to synchronize the visible range of multiple axes in multi-chart examples
class AxisSynchroniser {
  constructor(initialRange, axes) {
    this.visibleRange = initialRange;
    this.axes = [];
    this.visibleRangeChanged = new EventHandler();

    this.publishChange = this.publishChange.bind(this);
    if (axes) {
      axes.forEach((a) => this.addAxis(a));
    }
  }

  publishChange(data) {
    this.visibleRange = data.visibleRange;
    this.axes.forEach((a) => (a.visibleRange = this.visibleRange));
    this.visibleRangeChanged.raiseEvent(data);
  }

  addAxis(axis) {
    if (!this.axes.includes(axis)) {
      this.axes.push(axis);
      axis.visibleRange = this.visibleRange;
      axis.visibleRangeChanged.subscribe(this.publishChange);
    }
  }

  removeAxis(axis) {
    const index = this.axes.findIndex((a) => a === axis);
    if (index >= 0) {
      this.axes.splice(index, 1);
      axis.visibleRangeChanged.unsubscribe(this.publishChange);
    }
  }
}
// #endregion

// #region addNewChart
// Function for adding a new SubChart to an existing parent SciChartSurface.
// All subcharts will be resized to occupy equal height on the parent surface.
function addNewChart(parentSciChartSurface, wasmContext, axisSynchronizer) {
  const chartCount = parentSciChartSurface.subCharts?.length ?? 0;
  const newChartHeight = 1.0 / (chartCount + 1);

  console.log(
    `Adding new chart. Chart count: ${chartCount}, New chart height: ${newChartHeight}`
  );

  // Resize existing charts
  for (let i = 0; i < chartCount; i++) {
    const chart = parentSciChartSurface.subCharts[i];
    chart.subPosition = new Rect(0, i * newChartHeight, 1, newChartHeight);
  }

  // Add new chart
  const newChart = parentSciChartSurface.addSubChart({
    position: new Rect(0, chartCount * newChartHeight, 1, newChartHeight),
    theme: new SciChartJsNavyTheme(),
    title: `Chart ${chartCount + 1}`,
    titleStyle: { fontSize: 14 },
  });

  // Add axes and modifiers
  const xAxis = new NumericAxis(wasmContext, {
    axisTitle: "XAxis",
    axisTitleStyle: { fontSize: 12 },
  });

  newChart.xAxes.add(xAxis);
  newChart.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "YAxis",
      axisTitleStyle: { fontSize: 12 },
    })
  );

  // Add modifiers
  newChart.chartModifiers.add(new ZoomPanModifier());
  newChart.chartModifiers.add(new MouseWheelZoomModifier());
  newChart.chartModifiers.add(new ZoomExtentsModifier());

  // Add random data series
  const dataSeries = new XyDataSeries(wasmContext);
  const { xValues, yValues } = generateRandomData();
  dataSeries.appendRange(xValues, yValues);

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: getRandomColor(),
    strokeThickness: 2,
    dataSeries,
  });
  newChart.renderableSeries.add(lineSeries);

  // Synchronize the x-axis
  axisSynchronizer.addAxis(xAxis);

  return {
    sciChartSurface: newChart,
    wasmContext,
  };
}
// #endregion

// #region removeChart
// Helper function to remove a Sub-chart pane from a parent SciChartSurface
function removeChart(parentSciChartSurface, axisSynchronizer) {
  const chartCount = parentSciChartSurface.subCharts?.length ?? 0;
  if (chartCount <= 1) return; // Keep at least one chart

  const chartToRemove = parentSciChartSurface.subCharts[chartCount - 1];

  // Remove axis from synchronizer before removing chart
  axisSynchronizer.removeAxis(chartToRemove.xAxes[0]);

  // Remove chart
  parentSciChartSurface.removeSubChart(chartToRemove);

  // Resize remaining charts
  const newChartHeight = 1.0 / (chartCount - 1);
  for (let i = 0; i < chartCount - 1; i++) {
    const chart = parentSciChartSurface.subCharts[i];
    chart.subPosition = new Rect(0, i * newChartHeight, 1, newChartHeight);
  }
}
// #endregion

// #region createDynamicPanelChart
// Async function to create a dynamic panel chart with SubCharts
// Each chart will occupy 100% width, and each successive chart will occupy 1/n height
async function createDynamicPanelChart(divElementId) {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Create axis synchronizer with initial range
  const axisSynchronizer = new AxisSynchroniser();

  // Create initial chart at 100% width, 100% height
  addNewChart(sciChartSurface, wasmContext, axisSynchronizer);

  // Wire up button handlers
  document.getElementById("addChartBtn").onclick = () =>
    addNewChart(sciChartSurface, wasmContext, axisSynchronizer);
  document.getElementById("removeChartBtn").onclick = () =>
    removeChart(sciChartSurface, axisSynchronizer);

  // return the parent scichartsurface and add/remove chart functions
  return {
    sciChartSurface,
    addChart: () => addNewChart(sciChartSurface, wasmContext, axisSynchronizer),
    removeLastChart: () => removeChart(sciChartSurface, axisSynchronizer),
  };
}

createDynamicPanelChart("scichart-root");
// #endregion
