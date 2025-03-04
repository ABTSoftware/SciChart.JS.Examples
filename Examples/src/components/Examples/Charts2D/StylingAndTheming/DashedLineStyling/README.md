# Dashed Line Styling

## Overview

This example demonstrates how to style chart renderable series using dashed and dotted line patterns with SciChart.JS. It showcases multiple series including a mountain renderable series with a dashed stroke and two line renderable series with different dash patterns. The example is implemented for Angular, React, and Vanilla JavaScript/TypeScript, providing a cross-framework demonstration of SciChart's charting capabilities.

## Technologies Used

-   **SciChart.JS**: Core charting library
-   **Angular**: Standalone component integration (Angular TS)
-   **React**: Component integration using SciChartReact (TSX)
-   **Vanilla JavaScript/TypeScript**: Standard implementation for charts
-   **SciChart Modifiers**: Zoom, pan, and mouse wheel interaction
-   **ExampleDataProvider**: Dummy data generation for Fourier series

## Code Explanation

-   **drawExample.js/ts**: This file contains the main chart creation logic. It creates a SciChartSurface, sets up numeric X and Y axes, and adds multiple renderable series:
    -   A Mountain series with a custom dashed stroke ([10, 5]) and a linear gradient fill.
    -   Two Line series with dotted line effects using different stroke dash arrays ([5, 5] and [3, 3]).
    -   A Band series is also added to the chart with dashed styling options (comments indicate where dash arrays can be set).
    -   Chart modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier are added to enable interactivity.
-   **angular.ts**: Integrates the SciChartAngularComponent and initializes the chart using the drawExample function.
-   **index.tsx**: Provides the React component that uses the SciChartReact integration to render the chart.
-   **vanilla.js/ts**: These files set up the chart in a vanilla JavaScript or TypeScript project by calling the drawExample function and providing a cleanup method to delete the chart when necessary.
-   **javascript-dashed-line-chart.jpg**: An image preview of the chart, demonstrating the dashed and dotted line styling.

## Customization

Key configuration options in this example include:

-   **StrokeDashArray**: Defines the pattern of dashes and gaps for each renderable series (e.g. [10, 5] for the Mountain series and [5, 5] or [3, 3] for the line series).
-   **StrokeThickness and Stroke Colors**: Customize the line appearance, including thickness and color (e.g. using "SteelBlue" or theme-based colors).
-   **Gradient Fill**: The Mountain series uses a linear gradient fill defined via GradientParams to create a visually appealing fill under the dashed line.
-   **Chart Modifiers**: Add interactivity such as zooming and panning with modifiers like MouseWheelZoomModifier and ZoomPanModifier.

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
