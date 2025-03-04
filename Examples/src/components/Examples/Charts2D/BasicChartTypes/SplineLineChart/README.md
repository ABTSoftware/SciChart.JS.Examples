# Spline Line Chart Example

## Overview

This example demonstrates how to create a SciChart.JS chart that includes both a standard line series and a smoothed spline line series with animation and interactivity. Implementations for Angular, React, and Vanilla JavaScript are provided.

## Technologies Used

-   SciChart.JS for high performance charting using WebAssembly
-   Angular, React, and Vanilla JavaScript implementations
-   TypeScript and JavaScript
-   WaveAnimation for animated rendering
-   Various chart modifiers including ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, and LegendModifier
-   SplineLineRenderableSeries and FastLineRenderableSeries for rendering smoothed and standard line series respectively
-   BezierRenderDataTransform for additional spline interpolation customization

## Code Explanation

-   **angular.ts**: Defines an Angular standalone component that initializes the SciChart surface by referencing the drawExample function and uses the provided scichart-angular component.
-   **drawExample.js/drawExample.ts**: Contains the core chart setup function. It creates the SciChart surface, adds numeric X and Y axes, and defines data series with hard-coded x and y values. It adds three main renderable series:
    -   A standard line series (FastLineRenderableSeries) used as a baseline comparison.
    -   A spline series (SplineLineRenderableSeries) with a configurable number of interpolation points for smoothing.
    -   A Bezier series with an associated BezierRenderDataTransform and a draggable AxisMarkerAnnotation to adjust curvature interactively.
        Interactive modifiers for zoom, pan, and legends are also added.
-   **index.tsx**: Serves as the React component entry point using SciChartReact to initialize and render the chart within a React application.
-   **vanilla.js/vanilla.ts**: Entry point files for a Vanilla JavaScript implementation that create the chart and provide a cleanup function to delete the SciChart surface when no longer needed.
-   **javascript-spline-smoothed-line-chart.jpg**: An image file likely used as a screenshot of the example output.

## Customization

Key configuration options include:

-   The number of interpolation points (set to 10) on the spline series for controlling the degree of smoothing.
-   Stroke colors and thickness for each renderable series defined via the appTheme settings.
-   Animation settings are configured using WaveAnimation, with parameters such as duration, zeroLine, pointDurationFraction, and fadeEffect.
-   The Y-Axis is set to grow by a specific range to ensure appropriate padding around data points.
-   Interactive chart modifiers for zooming, panning, and legend display can be customized as needed.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**: Install the necessary packages using npm:

    ```bash
    npm install
    ```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

    ```bash
    npm run dev
    ```

    This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
