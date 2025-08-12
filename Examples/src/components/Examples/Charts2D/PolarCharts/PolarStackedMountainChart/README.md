# Polar Stacked Mountain Chart

## Overview

This example creates a **JavaScript Polar Stacked Mountain Chart** using SciChart's powerful JavaScript Charts and its range of features. It demonstrates multiple stacked mountain series on a polar coordinate system with smooth animations and interactive modifiers.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   WebAssembly – For optimized performance
-   React/Angular/Vanilla JS – Framework-specific implementations available
-   TypeScript – Used in Angular and React examples

## Code Explanation

The example centers around the `drawExample` function which initializes a polar chart surface and configures:

1. **Axes Setup**:

    - A radial `PolarNumericAxis` (Y-axis) configured for right alignment with custom range (0-9)
    - An angular `PolarNumericAxis` (X-axis) starting at 12 o'clock (π/2) and moving clockwise

2. **Data Series**:

    - Multiple datasets (`MountainsDatasets`) each containing yValues and fill colors
    - `XyDataSeries` for each mountain series, with closed-loop data (first point repeated at end)

3. **Rendering**:

    - `PolarStackedMountainCollection` to manage stacked mountain series
    - `PolarStackedMountainRenderableSeries` for each dataset with semi-transparent fills (75% opacity)
    - `WaveAnimation` applied to the entire collection (800ms duration)

4. **Interactivity**:
    - `PolarPanModifier` for dragging/panning
    - `PolarZoomExtentsModifier` for resetting zoom
    - `PolarMouseWheelZoomModifier` for zooming
    - `PolarLegendModifier` with checkboxes to toggle series visibility

## Customization

Key non-obvious customizations include:

1. **Closed-Loop Data**:

    ```typescript
    xValues: [...xValues, xValues[xValues.length - 1] + 1], // Extra xValue to close loop
    yValues: [...yValues, yValues[0]] // Draw back to first yValue
    ```

    This technique ensures seamless stacking by completing the circular path.

2. **Polar Axis Configuration**:

    ```typescript
    startAngle: Math.PI / 2, // Start at 12 o'clock
    flippedCoordinates: true // Go clockwise
    ```

    These properties control the angular orientation and direction.

3. **Opacity Control**:
    ```typescript
    fill: fillColor + "BB"; // 75% opacity via hex alpha channel
    ```
    The "BB" suffix sets the alpha channel for semi-transparent fills.

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to Examples**:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Run Development Server**:
    ```bash
    npm run dev
    ```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md) or the [Polar Stacked Mountain Series documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-stacked-mountain-renderable-series/).
