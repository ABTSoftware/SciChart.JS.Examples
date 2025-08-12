# Polar Spline Line Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Spline Line Chart** using SciChart.js, featuring both cubic and Bézier interpolation algorithms. It visualizes original data alongside smoothed versions using polar coordinates.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   WebGL – For GPU-accelerated rendering
-   TypeScript – Used for type-safe implementation

## Code Explanation

The example centers around the `drawExample` function which creates a `SciChartPolarSurface` with:

1. **Axes Configuration**:

    - Radial (Y) axis: Configured with `EPolarAxisMode.Radial` and custom inner radius for donut effect
    - Angular (X) axis: Using `EPolarAxisMode.Angular` with clockwise orientation (`flippedCoordinates: true`)

2. **Data Series**:

    - Three `PolarLineRenderableSeries` showing:
        - Original data (white line)
        - Cubic spline interpolation (orange line)
        - Bézier curve smoothing (purple line)

3. **Smoothing Techniques**:

    - Cubic spline via `SplineRenderDataTransform` with 30 interpolation points
    - Bézier via `BezierRenderDataTransform` with curvature 0.5 and 30 interpolation points

4. **Interactivity**:
    - `PolarPanModifier` for panning
    - `PolarZoomExtentsModifier` for zoom-to-fit
    - `PolarMouseWheelZoomModifier` for zooming
    - `PolarLegendModifier` with checkboxes for series toggling

## Customization

Key configuration aspects include:

-   **Animation**: Sequential `WaveAnimation` with 500ms duration and staggered delays
-   **Polar Layout**:
    -   `innerRadius: 0.1` creates a donut hole effect
    -   `flippedCoordinates: true` makes angles progress clockwise
-   **Smoothing Parameters**:
    -   `interpolationPoints: 30` controls curve smoothness
    -   `curvature: 0.5` adjusts Bézier tension
-   **Axis Styling**:
    -   `drawMinorTickLines: false` simplifies radial axis
    -   `polarLabelMode: EPolarLabelMode.Parallel` for better angle label readability

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

4. **Start Development Server**:
    ```bash
    npm run dev
    ```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md) and [Polar Chart Documentation](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html).
