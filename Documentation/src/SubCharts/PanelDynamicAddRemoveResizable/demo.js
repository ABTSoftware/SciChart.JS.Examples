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
let MIN_PANEL_SIZE = 0.05; // Will be calculated based on container height

// Calculate minimum panel size as ratio of container height
function updateMinPanelSize() {
  const container = document.getElementById("scichart-root");
  MIN_PANEL_SIZE = 100 / container.offsetHeight;
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
    // Calculate the correct position for the splitter by summing all panel sizes before it
    const splitterPosition = panelSizes
      .slice(0, chartCount)
      .reduce((a, b) => a + b, 0);
    const splitter = createSplitter(chartCount - 1, splitterPosition);
    document.getElementById("scichart-root").appendChild(splitter);
    setupSplitterEvents(splitter, parentSciChartSurface);
  }

  // Update all chart positions
  updateChartPositions(parentSciChartSurface);
  updateSplitterPositions(); // Ensure all splitters are correctly positioned

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
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
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
      // Get the current positions of adjacent splitters
      const splitters = Array.from(document.querySelectorAll(".grid-splitter"));
      const currentSplitterIndex = splitters.indexOf(activeSplitter);
      const prevSplitterPosition =
        currentSplitterIndex > 0
          ? parseFloat(splitters[currentSplitterIndex - 1].style.top) / 100
          : 0;
      const nextSplitterPosition =
        currentSplitterIndex < splitters.length - 1
          ? parseFloat(splitters[currentSplitterIndex + 1].style.top) / 100
          : 1;

      // Ensure we don't cross adjacent splitters
      if (mouseY <= prevSplitterPosition || mouseY >= nextSplitterPosition) {
        return;
      }

      // Only adjust the two panels adjacent to this splitter
      const upperPanelIndex = splitterIndex;
      const lowerPanelIndex = splitterIndex + 1;

      // Calculate the total size of the two affected panels
      const totalAffectedSize =
        panelSizes[upperPanelIndex] + panelSizes[lowerPanelIndex];

      // Calculate new positions relative to the fixed panels
      const upperPanelStart =
        upperPanelIndex > 0
          ? panelSizes.slice(0, upperPanelIndex).reduce((a, b) => a + b, 0)
          : 0;

      // Calculate new sizes for the affected panels
      const newUpperSize = mouseY - upperPanelStart;
      const newLowerSize = totalAffectedSize - newUpperSize;

      // Get container height for pixel calculations
      const containerHeight = container.offsetHeight;
      const minSizeRatio = 100 / containerHeight;

      // Check if either panel would be smaller than 100px
      if (
        newUpperSize * containerHeight < 100 ||
        newLowerSize * containerHeight < 100
      ) {
        return;
      }

      // Update only the affected panels
      panelSizes[upperPanelIndex] = newUpperSize;
      panelSizes[lowerPanelIndex] = newLowerSize;

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
      document.body.style.userSelect = ""; // Restore text selection
    }
  });

  splitter.addEventListener("pointercancel", (e) => {
    if (isDragging) {
      isDragging = false;
      activeSplitter = null;
      splitter.releasePointerCapture(e.pointerId);
      document.body.style.userSelect = ""; // Restore text selection
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

  // Initialize minimum panel size
  updateMinPanelSize();

  // Update minimum panel size when window resizes
  window.addEventListener("resize", updateMinPanelSize);

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
