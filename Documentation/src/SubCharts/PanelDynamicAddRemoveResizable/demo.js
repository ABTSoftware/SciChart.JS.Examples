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
    FastLineRenderableSeries
} = SciChart;

// or, import { SciChartSurface, ... } from "scichart" for npm

let colorIndex = 0;
function getRandomColor() {
    return ["#47bde6", "#ae418d", "#e97064", "#68bcae", "#634e96"][colorIndex++ % 5];
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

// #region AxisSynchroniser
// Helper class to synchronize the visible range of multiple axes in multi-chart examples
class AxisSynchroniser {
    constructor(initialRange, axes) {
        this.visibleRange = initialRange;
        this.axes = [];
        this.visibleRangeChanged = new EventHandler();

        this.publishChange = this.publishChange.bind(this);
        if (axes) {
            axes.forEach(a => this.addAxis(a));
        }
    }

    publishChange(data) {
        this.visibleRange = data.visibleRange;
        this.axes.forEach(a => (a.visibleRange = this.visibleRange));
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
        const index = this.axes.findIndex(a => a === axis);
        if (index >= 0) {
            this.axes.splice(index, 1);
            axis.visibleRangeChanged.unsubscribe(this.publishChange);
        }
    }
}
// #endregion

// #region gridSplitterHelperFunctions
// Function which creates and adds a grid splitter between chart panes
function createSplitter(index, position) {
    const splitter = document.createElement("div");
    splitter.className = "grid-splitter";
    splitter.style.top = `${position * 100}%`;
    splitter.dataset.index = index;
    return splitter;
}

// Updates chart positions and sizes using SciChartSubSurface.subPosition
function updateChartPositions(parentSciChartSurface) {
    let currentY = 0;
    for (let i = 0; i < panelSizes.length; i++) {
        const chart = parentSciChartSurface.subCharts[i];
        chart.subPosition = new Rect(0, currentY, 1, panelSizes[i]);
        currentY += panelSizes[i];
    }
}

// Updates grid splitter positions based on panel sizes
function updateSplitterPositions() {
    const splitters = document.querySelectorAll(".grid-splitter");
    let currentY = 0;
    splitters.forEach((splitter, index) => {
        currentY += panelSizes[index];
        splitter.style.top = `${currentY * 100}%`;
    });
}

// Sets up event handlers for grid splitter for dragging
function setupSplitterEvents(splitter, parentSciChartSurface, axisSynchronizer) {
    splitter.addEventListener("pointerdown", e => {
        isDragging = true;
        activeSplitter = splitter;
        splitter.setPointerCapture(e.pointerId);
        document.body.style.userSelect = "none"; // Prevent text selection while dragging
    });

    splitter.addEventListener("pointermove", e => {
        if (!isDragging || !activeSplitter) return;

        const container = document.getElementById("scichart-root");
        const rect = container.getBoundingClientRect();
        const mouseY = (e.clientY - rect.top) / rect.height;
        const splitterIndex = parseInt(activeSplitter.dataset.index);

        // Calculate minimum and maximum allowed positions
        const minY = splitterIndex > 0 ? MIN_PANEL_SIZE * (splitterIndex + 1) : MIN_PANEL_SIZE;
        const maxY = 1 - MIN_PANEL_SIZE * (panelSizes.length - splitterIndex - 1);

        if (mouseY >= minY && mouseY <= maxY) {
            // Get the current positions of adjacent splitters
            const splitters = Array.from(document.querySelectorAll(".grid-splitter"));
            const currentSplitterIndex = splitters.indexOf(activeSplitter);
            const prevSplitterPosition =
                currentSplitterIndex > 0 ? parseFloat(splitters[currentSplitterIndex - 1].style.top) / 100 : 0;
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
            const totalAffectedSize = panelSizes[upperPanelIndex] + panelSizes[lowerPanelIndex];

            // Calculate new positions relative to the fixed panels
            const upperPanelStart =
                upperPanelIndex > 0 ? panelSizes.slice(0, upperPanelIndex).reduce((a, b) => a + b, 0) : 0;

            // Calculate new sizes for the affected panels
            const newUpperSize = mouseY - upperPanelStart;
            const newLowerSize = totalAffectedSize - newUpperSize;

            // Get container height for pixel calculations
            const containerHeight = container.offsetHeight;
            const minSizeRatio = 100 / containerHeight;

            // Check if either panel would be smaller than 100px
            if (newUpperSize * containerHeight < 100 || newLowerSize * containerHeight < 100) {
                return;
            }

            // Update only the affected panels
            panelSizes[upperPanelIndex] = newUpperSize;
            panelSizes[lowerPanelIndex] = newLowerSize;

            // Update positions
            updateChartPositions(parentSciChartSurface);
            updateSplitterPositions();
            updateCloseButtons(parentSciChartSurface, axisSynchronizer);
        }
    });

    splitter.addEventListener("pointerup", e => {
        if (isDragging) {
            isDragging = false;
            activeSplitter = null;
            splitter.releasePointerCapture(e.pointerId);
            document.body.style.userSelect = ""; // Restore text selection
        }
    });

    splitter.addEventListener("pointercancel", e => {
        if (isDragging) {
            isDragging = false;
            activeSplitter = null;
            splitter.releasePointerCapture(e.pointerId);
            document.body.style.userSelect = ""; // Restore text selection
        }
    });
}

// Function which adds a close button to the chart
function addCloseButton(chart, index, parentSciChartSurface, axisSynchronizer) {
    if (parentSciChartSurface.subCharts.length <= 1) return;

    const closeBtn = document.createElement("button");
    closeBtn.className = "chart-close-button";
    closeBtn.innerHTML = "×";
    closeBtn.dataset.chartIndex = index;

    closeBtn.onclick = e => {
        e.stopPropagation();
        removeSpecificChart(parseInt(closeBtn.dataset.chartIndex), parentSciChartSurface, axisSynchronizer);
    };

    // Add to the scichart-root container instead
    document.getElementById("scichart-root").appendChild(closeBtn);

    // Position the button relative to the chart's position
    const yPos = panelSizes.slice(0, index).reduce((a, b) => a + b, 0);
    closeBtn.style.top = `calc(${yPos * 100}% + 10px)`;
}

// Updates the position of close buttons relative to chart panels on resize
function updateCloseButtons(parentSciChartSurface, axisSynchronizer) {
    // Remove all existing close buttons
    document.querySelectorAll(".chart-close-button").forEach(btn => btn.remove());

    // Add new close buttons if there's more than one chart
    if (parentSciChartSurface.subCharts.length > 1) {
        parentSciChartSurface.subCharts.forEach((chart, index) => {
            addCloseButton(chart, index, parentSciChartSurface, axisSynchronizer);
        });
    }
}
// #endregion

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
        panelSizes = panelSizes.map(size => size * (chartCount / (chartCount + 1)));
        panelSizes.push(newSize);
    }

    // Add new chart
    const newChart = parentSciChartSurface.addSubChart({
        position: new Rect(0, 0, 1, panelSizes[chartCount]),
        theme: new SciChartJsNavyTheme(),
        title: `Chart ${chartCount + 1}`,
        titleStyle: { fontSize: 14 }
    });

    // Add splitter if this isn't the first chart
    if (chartCount > 0) {
        // Calculate the correct position for the splitter by summing all panel sizes before it
        const splitterPosition = panelSizes.slice(0, chartCount).reduce((a, b) => a + b, 0);
        const splitter = createSplitter(chartCount - 1, splitterPosition);
        document.getElementById("scichart-root").appendChild(splitter);
        setupSplitterEvents(splitter, parentSciChartSurface, axisSynchronizer);
    }

    // Update all chart positions
    updateChartPositions(parentSciChartSurface);
    updateSplitterPositions(); // Ensure all splitters are correctly positioned

    // Add axes and modifiers
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "XAxis",
        axisTitleStyle: { fontSize: 12 }
    });

    newChart.xAxes.add(xAxis);
    newChart.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "YAxis",
            axisTitleStyle: { fontSize: 12 }
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
        dataSeries
    });
    newChart.renderableSeries.add(lineSeries);

    // Synchronize the x-axis
    axisSynchronizer.addAxis(xAxis);

    // Update close buttons for all charts
    updateCloseButtons(parentSciChartSurface, axisSynchronizer);

    return {
        sciChartSurface: newChart,
        wasmContext
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

    // Remove corresponding splitter
    const splitters = document.querySelectorAll(".grid-splitter");
    if (index > 0) {
        splitters[index - 1].remove();
    } else if (splitters.length > 0) {
        splitters[0].remove();
    }

    // Normalize remaining panel sizes
    const totalSize = panelSizes.reduce((a, b) => a + b, 0);
    panelSizes = panelSizes.map(size => size / totalSize);

    // Update positions
    updateChartPositions(parentSciChartSurface);
    updateSplitterPositions();
    updateCloseButtons(parentSciChartSurface, axisSynchronizer);
}

// Function to reomve the last chart from the SciChartSurface
function removeChart(parentSciChartSurface, axisSynchronizer) {
    removeSpecificChart(parentSciChartSurface.subCharts.length - 1, parentSciChartSurface, axisSynchronizer);
}
// #endregion

// #region createDynamicPanelChart
// Async function to create a dynamic panel chart with SubCharts
// Each chart will occupy 100% width, and each successive chart will occupy 1/n height
async function createDynamicPanelChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Initialize minimum panel size
    updateMinPanelSize();

    // Update minimum panel size when window resizes
    window.addEventListener("resize", updateMinPanelSize);

    // Create axis synchronizer with initial range
    const axisSynchronizer = new AxisSynchroniser();

    // Create initial chart with two sub charts, each occupying 50% height
    addNewChart(sciChartSurface, wasmContext, axisSynchronizer);
    addNewChart(sciChartSurface, wasmContext, axisSynchronizer);

    // Wire up button handlers
    document.getElementById("addChartBtn").onclick = () => addNewChart(sciChartSurface, wasmContext, axisSynchronizer);
    document.getElementById("removeChartBtn").onclick = () => removeChart(sciChartSurface, axisSynchronizer);

    // return the parent scichartsurface and add/remove chart functions
    return {
        sciChartSurface,
        addChart: () => addNewChart(sciChartSurface, wasmContext, axisSynchronizer),
        removeChart: index => removeSpecificChart(index, sciChartSurface, axisSynchronizer)
    };
}

createDynamicPanelChart("scichart-root");
// #endregion
