# Contours Chart Example

## Overview

This example demonstrates how to create a heatmap with a contour lines overlay using SciChart.JS. The example showcases implementations for both Angular and React. It builds an interactive chart with hidden numeric axes, a heatmap data series, a contour renderable series overlay, and a dedicated heatmap legend. In addition, the example adds common interaction modifiers such as zoom pan, zoom extents, and mouse wheel zoom.

## Technologies Used

-   **SciChart.JS** for high performance charting
-   **Angular** (using the SciChart Angular component) and **React** (using SciChartReact)
-   **WebAssembly** for rendering performance
-   **TypeScript/JavaScript** for example implementations

## Code Explanation

-   **angular.ts**: Defines an Angular standalone component which integrates the SciChart Angular component. It passes in the `drawExample` function as the initializer for the chart.
-   **drawExample.js / drawExample.ts**: These files contain the main logic to create the SciChartSurface, add invisible numeric axes, and configure a heatmap data series. They then add a contour renderable series on top of a background heatmap renderable series. Key configuration parameters such as heatmap dimensions, color palette limits, contour intervals, and styling options (opacity, gradient stops, stroke thickness, and stroke color) are defined here. They also add common chart modifiers for interactivity (zoom pan, zoom extents, and mouse wheel zoom).
-   **drawHeatmapLegend function**: Found in the same drawExample files, this function creates and configures a heatmap legend with customized theme and axis styling, using the same color mapping as the main heatmap.
-   **index.tsx**: Provides a React component that uses the SciChartReact wrapper. It loads the main chart using the `drawExample` function and overlays the heatmap legend using the `drawHeatmapLegend` function. The component is wrapped in a chart group loader to manage layout and styling.
-   **javascript-heatmap-chart-with-contours.jpg**: An image file showcasing a preview of the example output.

## Customization

-   **Heatmap Data Series Settings**: The heatmap dimensions (width and height) and the z-values are generated with configurable parameters. The color palette minimum and maximum values are set (0 to 200), and a custom gradient with multiple stops is defined using theme colors.
-   **Contour Settings**: The contour renderable series is configured with a z-min, z-max, and a step interval (zStep) that controls the spacing of contour lines. Stroke thickness and stroke color are also customizable.
-   **Interaction Modifiers**: Zoom Pan, Zoom Extents, and Mouse Wheel Zoom modifiers are added to enable interactive navigation of the chart.
-   **Heatmap Legend**: The legend is configured with inner axis options and customized theme colors, ensuring consistency with the main heatmap color mapping.

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
