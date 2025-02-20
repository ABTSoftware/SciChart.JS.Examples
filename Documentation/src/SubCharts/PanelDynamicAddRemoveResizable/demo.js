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

class ChartPanel {
  static MIN_PANEL_SIZE = 100;

  constructor(parentSciChartSurface, index, wasmContext, axisSynchronizer) {
    this.parentSciChartSurface = parentSciChartSurface;
    this.index = index;
    this.height = 0;
    this.splitter = null;
    this.closeButton = null;
    this.chart = null;

    this.createChart(wasmContext, axisSynchronizer);
  }

  get containerHeight() {
    return this.parentSciChartSurface.domChartRoot.clientHeight;
  }

  get containerWidth() {
    return this.parentSciChartSurface.domChartRoot.clientWidth;
  }

  createChart(wasmContext, axisSynchronizer) {
    this.chart = this.parentSciChartSurface.addSubChart({
      position: new Rect(0, 0, this.containerWidth, 0),
      theme: new SciChartJsNavyTheme(),
      title: `Chart ${this.index + 1}`,
      titleStyle: { fontSize: 14 },
      coordinateMode: ECoordinateMode.Pixel,
    });

    const xAxis = new NumericAxis(wasmContext, {
      axisTitle: "XAxis",
      axisTitleStyle: { fontSize: 12 },
    });

    this.chart.xAxes.add(xAxis);
    this.chart.yAxes.add(
      new NumericAxis(wasmContext, {
        axisTitle: "YAxis",
        axisTitleStyle: { fontSize: 12 },
      })
    );

    this.chart.chartModifiers.add(new ZoomPanModifier());
    this.chart.chartModifiers.add(new MouseWheelZoomModifier());
    this.chart.chartModifiers.add(new ZoomExtentsModifier());

    const dataSeries = new XyDataSeries(wasmContext);
    const { xValues, yValues } = generateRandomData();
    dataSeries.appendRange(xValues, yValues);

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      stroke: getRandomColor(),
      strokeThickness: 2,
      dataSeries,
    });
    this.chart.renderableSeries.add(lineSeries);

    axisSynchronizer.addAxis(xAxis);
  }

  createCloseButton(onClose) {
    this.closeButton = new ChartCloseButton(
      this.parentSciChartSurface.domChartRoot,
      this.index,
      onClose
    );
  }

  createSplitter(onDrag) {
    this.splitter = new ChartSplitter(
      this.parentSciChartSurface.domChartRoot,
      this.index,
      0,
      onDrag
    );
  }

  setHeight(height) {
    this.height = height;
    this.chart.subPosition = new Rect(
      0,
      this.yPosition,
      this.containerWidth,
      height
    );
  }

  setIndex(index) {
    this.index = index;
    if (this.closeButton) {
      this.closeButton.setIndex(index);
    }
    if (this.splitter) {
      this.splitter.element.dataset.index = index;
    }
  }

  get yPosition() {
    return chartPanels
      .slice(0, this.index)
      .reduce((sum, panel) => sum + panel.height, 0);
  }

  updatePositions() {
    if (this.closeButton) {
      this.closeButton.setPosition(this.yPosition);
    }
    if (this.splitter) {
      this.splitter.setPosition(this.yPosition + this.height);
    }
  }

  remove(axisSynchronizer) {
    axisSynchronizer.removeAxis(this.chart.xAxes[0]);
    this.parentSciChartSurface.removeSubChart(this.chart);
    if (this.closeButton) this.closeButton.remove();
    if (this.splitter) this.splitter.remove();
  }
}

// Store chart panels
let chartPanels = [];

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

// #endregion

// #region addNewChart
// Function for adding a new SubChart to an existing parent SciChartSurface.
// All subcharts will be resized to occupy equal height on the parent surface.
function addNewChart(parentSciChartSurface, wasmContext, axisSynchronizer) {
  const chartCount = chartPanels.length;
  const containerHeight = parentSciChartSurface.domChartRoot.clientHeight;

  // Create new panel
  const newPanel = new ChartPanel(
    parentSciChartSurface,
    chartCount,
    wasmContext,
    axisSynchronizer
  );
  chartPanels.push(newPanel);

  // Add close button
  newPanel.createCloseButton((index) =>
    removeSpecificChart(index, parentSciChartSurface, axisSynchronizer)
  );

  // Add splitter if this isn't the first chart
  if (chartCount > 0) {
    const previousPanel = chartPanels[chartCount - 1];
    previousPanel.createSplitter((splitterIndex, mouseY) => {
      const upperPanel = chartPanels[splitterIndex];
      const lowerPanel = chartPanels[splitterIndex + 1];

      const totalSize = upperPanel.height + lowerPanel.height;
      const newUpperSize = mouseY - upperPanel.yPosition;
      const newLowerSize = totalSize - newUpperSize;

      if (
        newUpperSize < ChartPanel.MIN_PANEL_SIZE ||
        newLowerSize < ChartPanel.MIN_PANEL_SIZE
      ) {
        return;
      }

      upperPanel.setHeight(newUpperSize);
      lowerPanel.setHeight(newLowerSize);

      chartPanels.forEach((panel) => panel.updatePositions());
    });
  }

  // Calculate and set heights
  const newHeight = containerHeight / (chartCount + 1);
  chartPanels.forEach((panel) => panel.setHeight(newHeight));
  chartPanels.forEach((panel) => panel.updatePositions());

  // Show/hide close buttons based on panel count
  const showCloseButtons = chartPanels.length > 1;
  chartPanels.forEach((panel) => {
    if (panel.closeButton) {
      panel.closeButton.setVisibility(showCloseButtons);
    }
  });

  return {
    sciChartSurface: newPanel.chart,
    wasmContext,
  };
}
// #endregion

// #region removeChart
// Helper function to remove a specific Sub-chart pane from a parent SciChartSurface
function removeSpecificChart(index, parentSciChartSurface, axisSynchronizer) {
  if (chartPanels.length <= 1) return; // Keep at least one chart

  // Remove the panel
  const panelToRemove = chartPanels[index];
  panelToRemove.remove(axisSynchronizer);
  chartPanels.splice(index, 1);

  // Update indices of remaining panels
  chartPanels.forEach((panel, i) => panel.setIndex(i));

  // Recalculate heights to fill available space
  const newHeight =
    parentSciChartSurface.domChartRoot.clientHeight / chartPanels.length;
  chartPanels.forEach((panel) => panel.setHeight(newHeight));

  // Update all positions
  chartPanels.forEach((panel) => panel.updatePositions());

  // Show/hide close buttons based on panel count
  const showCloseButtons = chartPanels.length > 1;
  chartPanels.forEach((panel) => {
    if (panel.closeButton) {
      panel.closeButton.setVisibility(showCloseButtons);
    }
  });
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
