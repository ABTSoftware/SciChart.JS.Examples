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
} = SciChart;

// Store panel sizes and splitter state
let panelSizes = [];
let isDragging = false;
let activeSplitter = null;
const MIN_PANEL_SIZE = 0.1; // 10% minimum panel height

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

function createSplitter(index, position) {
  const splitter = document.createElement("div");
  splitter.className = "grid-splitter";
  splitter.style.top = `${position * 100}%`;
  splitter.dataset.index = index;
  return splitter;
}

function updateChartPositions(parentSciChartSurface) {
  let currentY = 0;
  for (let i = 0; i < panelSizes.length; i++) {
    const chart = parentSciChartSurface.subCharts[i];
    chart.subPosition = new Rect(0, currentY, 1, panelSizes[i]);
    currentY += panelSizes[i];
  }
}

function updateSplitterPositions() {
  const splitters = document.querySelectorAll(".grid-splitter");
  let currentY = 0;
  splitters.forEach((splitter, index) => {
    currentY += panelSizes[index];
    splitter.style.top = `${currentY * 100}%`;
  });
}

// #region addNewChart
// Function for adding a new SubChart to an existing parent SciChartSurface.
// All subcharts will be resized to occupy equal height on the parent surface.
function addNewChart(parentSciChartSurface, wasmContext, axisSynchronizer) {
  const chartCount = parentSciChartSurface.subCharts?.length ?? 0;

  // Calculate new panel size
  if (panelSizes.length === 0) {
    panelSizes.push(1); // First panel takes full height
  } else {
    // Resize existing panels and add new one
    const newSize = 1 / (chartCount + 1);
    panelSizes = panelSizes.map(
      (size) => size * (chartCount / (chartCount + 1))
    );
    panelSizes.push(newSize);
  }

  // Add new chart
  const newChart = parentSciChartSurface.addSubChart({
    position: new Rect(0, 0, 1, panelSizes[chartCount]),
    theme: new SciChartJsNavyTheme(),
    title: `Chart ${chartCount + 1}`,
    titleStyle: { fontSize: 14 },
  });

  // Add splitter if this isn't the first chart
  if (chartCount > 0) {
    const splitter = createSplitter(chartCount - 1, panelSizes[chartCount - 1]);
    document.getElementById("scichart-root").appendChild(splitter);
    setupSplitterEvents(splitter, parentSciChartSurface);
  }

  // Update all chart positions
  updateChartPositions(parentSciChartSurface);

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
function setupSplitterEvents(splitter, parentSciChartSurface) {
  splitter.addEventListener("pointerdown", (e) => {
    isDragging = true;
    activeSplitter = splitter;
    splitter.setPointerCapture(e.pointerId);
  });

  splitter.addEventListener("pointermove", (e) => {
    if (!isDragging || !activeSplitter) return;

    const container = document.getElementById("scichart-root");
    const rect = container.getBoundingClientRect();
    const mouseY = (e.clientY - rect.top) / rect.height;
    const splitterIndex = parseInt(activeSplitter.dataset.index);

    // Calculate minimum and maximum allowed positions
    const minY =
      splitterIndex > 0 ? MIN_PANEL_SIZE * (splitterIndex + 1) : MIN_PANEL_SIZE;
    const maxY = 1 - MIN_PANEL_SIZE * (panelSizes.length - splitterIndex - 1);

    if (mouseY >= minY && mouseY <= maxY) {
      // Update panel sizes
      const totalSizeAbove = panelSizes
        .slice(0, splitterIndex + 1)
        .reduce((a, b) => a + b, 0);
      const scale = mouseY / totalSizeAbove;

      // Scale panels above splitter
      for (let i = 0; i <= splitterIndex; i++) {
        panelSizes[i] *= scale;
      }

      // Scale panels below splitter
      const remainingSize = 1 - mouseY;
      const oldRemainingSize = 1 - totalSizeAbove;
      const remainingScale = remainingSize / oldRemainingSize;
      for (let i = splitterIndex + 1; i < panelSizes.length; i++) {
        panelSizes[i] *= remainingScale;
      }

      // Update positions
      updateChartPositions(parentSciChartSurface);
      updateSplitterPositions();
    }
  });

  splitter.addEventListener("pointerup", (e) => {
    if (isDragging) {
      isDragging = false;
      activeSplitter = null;
      splitter.releasePointerCapture(e.pointerId);
    }
  });

  splitter.addEventListener("pointerleave", (e) => {
    if (isDragging) {
      isDragging = false;
      activeSplitter = null;
      splitter.releasePointerCapture(e.pointerId);
    }
  });
}

function removeChart(parentSciChartSurface, axisSynchronizer) {
  const chartCount = parentSciChartSurface.subCharts?.length ?? 0;
  if (chartCount <= 1) return; // Keep at least one chart

  const chartToRemove = parentSciChartSurface.subCharts[chartCount - 1];

  // Remove axis from synchronizer before removing chart
  axisSynchronizer.removeAxis(chartToRemove.xAxes[0]);

  // Remove chart and update panel sizes
  parentSciChartSurface.removeSubChart(chartToRemove);
  panelSizes.pop();

  // Remove last splitter
  const splitters = document.querySelectorAll(".grid-splitter");
  if (splitters.length > 0) {
    splitters[splitters.length - 1].remove();
  }

  // Normalize remaining panel sizes
  const totalSize = panelSizes.reduce((a, b) => a + b, 0);
  panelSizes = panelSizes.map((size) => size / totalSize);

  // Update positions
  updateChartPositions(parentSciChartSurface);
  updateSplitterPositions();
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
