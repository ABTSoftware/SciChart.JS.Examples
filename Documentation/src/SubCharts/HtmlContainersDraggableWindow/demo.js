const xValues = [];
const yValues = [];
for (let i = 0; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
}

const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    Rect,
    ECoordinateMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    BoxAnnotation,
    NumberRange,
    generateGuid
} = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"

// #region createSubChartContainer
function createSubChartContainer(sciChartSurface, subChartOptions) {
    // Create the subChartContainer HTML and add to the DOM
    const container = document.createElement("div");
    container.id = generateGuid(); // generateGuid imported from SciChart
    container.style.position = "absolute";
    container.style.border = "1px solid #4682b4";
    document.body.appendChild(container);

    const { title, ...subChartOptionsNoTitle } = subChartOptions;

    // Create a top bar header HTML element for the subchart
    const topBar = document.createElement("div");
    topBar.style.pointerEvents = "all";
    topBar.style.position = "absolute";
    topBar.style.top = "0";
    topBar.style.width = "100%";
    topBar.style.height = "30px";
    topBar.style.backgroundColor = "#4682b4";
    // className is required to specify that this is a top-section bar, to be positioned outside the chart
    // even if this class isn't used or specified in the DOM.
    // Default available options are "top-section", "bottom-section", "left-section", "right-section"
    topBar.className = "top-section";
    container.appendChild(topBar);

    const containerTitle = document.createElement("span");
    containerTitle.style.userSelect = "none";
    containerTitle.style.color = "#eee";
    containerTitle.style.fontFamily = "Arial";
    containerTitle.style.fontWeight = "Bold";
    containerTitle.style.left = "10px";
    containerTitle.style.top = "5px";
    containerTitle.style.position = "relative";
    containerTitle.innerText = title;

    topBar.appendChild(containerTitle);

    // Add a Sub-Charts to the main surface. This will display a rectangle showing the current zoomed in area on the parent chart
    const subChart = sciChartSurface.addSubChart({
        ...subChartOptionsNoTitle,
        theme: sciChartSurface.themeProvider,
        // Specify the subChartContainer
        subChartContainerId: container
    });

    // Track dragging state
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRect;

    // Handle pointer down to start drag
    container.onpointerdown = e => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startRect = subChart.subPosition;

        // Capture pointer to receive events outside container
        container.setPointerCapture(e.pointerId);
    };

    // Handle pointer move to update position
    container.onpointermove = e => {
        if (!isDragging) return;

        // Calculate delta movement in pixels
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Convert pixel movement to relative coordinates (0..1)
        const parentWidth = sciChartSurface.domChartRoot.clientWidth;
        const parentHeight = sciChartSurface.domChartRoot.clientHeight;
        const relativeX = deltaX / parentWidth;
        const relativeY = deltaY / parentHeight;

        // Update subchart position
        subChart.subPosition = new Rect(
            startRect.x + relativeX,
            startRect.y + relativeY,
            startRect.width,
            startRect.height
        );
    };

    // Handle pointer up to end drag
    container.onpointerup = e => {
        isDragging = false;
        container.releasePointerCapture(e.pointerId);
    };

    return subChart;
}
// #endregion

async function simpleSubChart(divElementId) {
    // Create a parent (regular) SciChartSurface which will contain the sub-chart
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Create X,Y axis on the parent chart and programmatically zoom into part of the data
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region addSubChart
    const subChart = createSubChartContainer(sciChartSurface, {
        position: new Rect(0.1, 0.1, 0.4, 0.4),
        isTransparent: false,
        isVisible: true,
        coordinateMode: ECoordinateMode.Relative,
        title: "Draggable Sub-Chart Window"
    });

    // Add x,y axis to the subchart
    subChart.xAxes.add(new NumericAxis(wasmContext));
    subChart.yAxes.add(new NumericAxis(wasmContext));

    // Add a series to the subchart
    subChart.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#47bde6",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            })
        })
    );
    // #endregion
}

simpleSubChart("scichart-root");
