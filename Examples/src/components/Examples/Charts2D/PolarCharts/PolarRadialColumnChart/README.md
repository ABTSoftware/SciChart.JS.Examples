# Polar Radar Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Radar Chart**, also known as a **Spider Chart** using SciChart.js, which visualizes the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of two popular sorting algorithms (Quick Sort and Bubble Sort) in a polar coordinate system.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   TypeScript – Used for type safety and better developer experience
-   WebGL – For high-performance rendering

## Code Explanation

The example centers around the `drawExample` function which creates a `SciChartPolarSurface` and configures it with polar axes and renderable series:

1. **Polar Axes Setup**:

    - `PolarNumericAxis` (radial Y-axis): Configures radial values with polygon gridlines and custom styling.
    - `PolarCategoryAxis` (angular X-axis): Handles category labels (Complexity, Memory Usage, etc.) with horizontal orientation.

2. **Data Series**:

    - Two datasets representing Quick Sort and Bubble Sort algorithms
    - `PolarMountainRenderableSeries`: Creates a filled radar chart for Quick Sort with transparent fill
    - `PolarLineRenderableSeries`: Creates a line radar chart for Bubble Sort with point markers

3. **Special Configuration**:

    - `startAngle: Math.PI / 2`: Starts the chart at 12 o'clock position
    - `flippedCoordinates: true`: Makes the chart render clockwise
    - `xValues` array includes an extra point to complete the radar loop

4. **Interactivity**:
    - `PolarPanModifier`: Allows panning the chart
    - `PolarZoomExtentsModifier`: Provides zoom-to-fit functionality
    - `PolarMouseWheelZoomModifier`: Enables zooming with mouse wheel
    - `PolarLegendModifier`: Shows interactive legend with checkboxes

## Customization

Key customizations in this example include:

1. **Radar Completion**:

    - The xValues array includes an extra point (`length: LABELS.length + 1`) and each data series appends its first value again to complete the radar shape without gaps.

2. **Styling**:

    - Gridlines use dashed strokes (`strokeDashArray: [5, 5]`) for better visibility
    - Mountain series uses semi-transparent fill (`fill: color + "30"`)
    - Line series features `EllipsePointMarker` with white border for clear data point indication

3. **Performance Optimizations**:
    - `useNativeText: true` on both axes for crisp text rendering
    - `FadeAnimation` applied to both series for smooth initial rendering

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md) and the [Polar Radar Chart documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-radar-chart/).
