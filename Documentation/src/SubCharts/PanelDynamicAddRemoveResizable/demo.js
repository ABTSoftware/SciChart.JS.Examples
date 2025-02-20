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
  ECoordinateMode,
} = SciChart;

// or, import { SciChartSurface, ... } from "scichart" for npm

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

// Store panel sizes and UI elements
let panelSizes = []; // Store heights in pixels
let chartSplitters = []; // Store splitter instances
let chartCloseButtons = []; // Store close button instances
const MIN_PANEL_SIZE = 100; // Minimum panel size in pixels

class ChartCloseButton {
  constructor(parentElement, index, onClickCallback) {
    this.element = document.createElement("button");
    this.element.className = "chart-close-button";
    this.element.innerHTML = "×";
    this.buttonIndex = index;

    this.element.onclick = (e) => {
      e.stopPropagation();
      onClickCallback(this.buttonIndex);
    };

    parentElement.appendChild(this.element);
    this.setVisibility(false); // Initially hidden
  }

  setPosition(position) {
    this.element.style.top = `${position + 10}px`;
  }

  setIndex(index) {
    this.buttonIndex = index;
  }

  setVisibility(visible) {
    this.element.style.display = visible ? "block" : "none";
  }

  remove() {
    this.element.remove();
  }
}

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

// #region ChartSplitter
class ChartSplitter {
  constructor(parentElement, index, position, onDragCallback) {
    this.element = document.createElement("div");
    this.element.className = "grid-splitter";
    this.element.style.top = `${position}px`;
    this.element.dataset.index = index;
    this.isDragging = false;
    this.onDragCallback = onDragCallback;

    this.setupEvents();
    parentElement.appendChild(this.element);
  }

  setupEvents() {
    this.element.addEventListener("pointerdown", (e) => {
      this.isDragging = true;
      this.element.setPointerCapture(e.pointerId);
      document.body.style.userSelect = "none";
    });

    this.element.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;

      const container = this.element.parentElement;
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;

      this.onDragCallback(parseInt(this.element.dataset.index), mouseY);
    });

    const endDrag = (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        this.element.releasePointerCapture(e.pointerId);
        document.body.style.userSelect = "";
      }
    };

    this.element.addEventListener("pointerup", endDrag);
    this.element.addEventListener("pointercancel", endDrag);
  }

  setPosition(position) {
    this.element.style.top = `${position}px`;
  }

  remove() {
    this.element.remove();
  }
}

// Updates chart positions and sizes using SciChartSubSurface.subPosition
function updateChartPositions(parentSciChartSurface) {
  const width = parentSciChartSurface.domChartRoot.clientWidth;
  let currentY = 0;
  for (let i = 0; i < panelSizes.length; i++) {
    const chart = parentSciChartSurface.subCharts[i];
    chart.subPosition = new Rect(0, currentY, width, panelSizes[i]);
    currentY += panelSizes[i];
  }
}

// Updates grid splitter positions based on panel sizes
function updateSplitterPositions() {
  let currentY = 0;
  chartSplitters.forEach((splitter, index) => {
    currentY += panelSizes[index];
    splitter.setPosition(currentY);
  });
}

// Updates the position of close buttons relative to chart panels on resize
function updateCloseButtonPositions() {
  chartCloseButtons.forEach((btn, index) => {
    // Position each button 10px from the top of its corresponding panel
    const yPos = panelSizes.slice(0, index).reduce((a, b) => a + b, 0);
    btn.setPosition(yPos);
  });
}
// #endregion

// #region addNewChart
// Function for adding a new SubChart to an existing parent SciChartSurface.
// All subcharts will be resized to occupy equal height on the parent surface.
function addNewChart(parentSciChartSurface, wasmContext, axisSynchronizer) {
  const chartCount = parentSciChartSurface.subCharts?.length ?? 0;

  const containerHeight = parentSciChartSurface.domChartRoot.clientHeight;
  const containerWidth = parentSciChartSurface.domChartRoot.clientWidth;

  // Calculate new panel size in pixels
  if (panelSizes.length === 0) {
    panelSizes.push(containerHeight); // First panel takes full height
  } else {
    // Resize existing panels and add new one
    const newSize = containerHeight / (chartCount + 1);
    panelSizes = panelSizes.map(
      (size) => (size * chartCount) / (chartCount + 1)
    );
    panelSizes.push(newSize);
  }

  // Add new chart
  const newChart = parentSciChartSurface.addSubChart({
    position: new Rect(0, 0, containerWidth, panelSizes[chartCount]),
    theme: new SciChartJsNavyTheme(),
    title: `Chart ${chartCount + 1}`,
    titleStyle: { fontSize: 14 },
    coordinateMode: ECoordinateMode.Pixel,
  });

  // Add close button for the new chart
  const newChartButton = new ChartCloseButton(
    parentSciChartSurface.domChartRoot,
    chartCount,
    (index) =>
      removeSpecificChart(index, parentSciChartSurface, axisSynchronizer)
  );
  chartCloseButtons.push(newChartButton);
  chartCloseButtons.forEach((btn, i) => {
    btn.setIndex(i);
    btn.setVisibility(chartCloseButtons.length > 1);
  });

  // Add splitter if this isn't the first chart
  if (chartCount > 0) {
    // Calculate the correct position for the splitter
    const splitterPosition = panelSizes
      .slice(0, chartCount)
      .reduce((a, b) => a + b, 0);

    const splitter = new ChartSplitter(
      parentSciChartSurface.domChartRoot,
      chartCount - 1,
      splitterPosition,
      (splitterIndex, mouseY) => {
        // Only adjust the two panels adjacent to this splitter
        const upperPanelIndex = splitterIndex;
        const lowerPanelIndex = splitterIndex + 1;

        // Calculate total size of the affected panels
        const totalAffectedSize =
          panelSizes[upperPanelIndex] + panelSizes[lowerPanelIndex];

        // Calculate new sizes
        const newUpperSize =
          mouseY -
          panelSizes.slice(0, upperPanelIndex).reduce((a, b) => a + b, 0);
        const newLowerSize = totalAffectedSize - newUpperSize;

        // Prevent shrinking below minimum size
        if (newUpperSize < MIN_PANEL_SIZE || newLowerSize < MIN_PANEL_SIZE) {
          return;
        }

        // Update panel sizes
        panelSizes[upperPanelIndex] = newUpperSize;
        panelSizes[lowerPanelIndex] = newLowerSize;

        // Apply the changes
        updateChartPositions(parentSciChartSurface);
        updateSplitterPositions();
        updateCloseButtonPositions();
      }
    );
    chartSplitters.push(splitter);
  }

  // Update all chart positions
  updateChartPositions(parentSciChartSurface);
  updateSplitterPositions(); // Ensure all splitters are correctly positioned
  updateCloseButtonPositions();

  console.log(
    `chartCloseButtons visibility: ${chartCloseButtons.map(
      (btn) => btn.element.style.display
    )}`
  );
  console.log(
    `chartCloseButtons top: ${chartCloseButtons.map(
      (btn) => btn.element.style.top
    )}`
  );

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
// Helper function to remove a specific Sub-chart pane from a parent SciChartSurface
function removeSpecificChart(index, parentSciChartSurface, axisSynchronizer) {
  const chartCount = parentSciChartSurface.subCharts?.length ?? 0;
  if (chartCount <= 1) return; // Keep at least one chart

  const chartToRemove = parentSciChartSurface.subCharts[index];

  // Remove axis from synchronizer before removing chart
  axisSynchronizer.removeAxis(chartToRemove.xAxes[0]);

  // Remove chart and update panel sizes
  parentSciChartSurface.removeSubChart(chartToRemove);
  panelSizes.splice(index, 1);

  // Remove corresponding splitter and close buttons
  // Remove splitter
  if (index > 0) {
    chartSplitters[index - 1].remove();
    chartSplitters.splice(index - 1, 1);
  } else if (chartSplitters.length > 0) {
    chartSplitters[0].remove();
    chartSplitters.splice(0, 1);
  }

  // Remove close button for this chart
  chartCloseButtons[index].remove();
  chartCloseButtons.splice(index, 1);

  // Update indices and visibility of remaining close buttons
  chartCloseButtons.forEach((btn, i) => {
    btn.setIndex(i);
    btn.setVisibility(chartCloseButtons.length > 1);
  });

  // Recalculate panel sizes to fill available space
  const containerHeight = parentSciChartSurface.domChartRoot.clientHeight;
  const newPanelHeight = containerHeight / panelSizes.length;
  panelSizes = panelSizes.map(() => newPanelHeight);

  // Update positions
  updateChartPositions(parentSciChartSurface);
  updateSplitterPositions();
  updateCloseButtonPositions();
}

// Function to reomve the last chart from the SciChartSurface
function removeChart(parentSciChartSurface, axisSynchronizer) {
  removeSpecificChart(
    parentSciChartSurface.subCharts.length - 1,
    parentSciChartSurface,
    axisSynchronizer
  );
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

  // Create initial chart with two sub charts, each occupying 50% height
  addNewChart(sciChartSurface, wasmContext, axisSynchronizer);
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
    removeChart: (index) =>
      removeSpecificChart(index, sciChartSurface, axisSynchronizer),
  };
}

createDynamicPanelChart("scichart-root");
// #endregion
