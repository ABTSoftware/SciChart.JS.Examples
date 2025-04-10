# Non Uniform Heatmap Chart

## Overview

This example demonstrates how to create a non uniform heatmap chart using SciChart.js. The chart displays a 2D array of calculated values with nonuniform cell sizes defined by custom x and y offsets. It includes implementations for React, Angular, and Vanilla JavaScript/TypeScript, all utilizing the same core chart drawing logic.

## Technologies Used

-   SciChart.js for chart rendering and interactivity
-   TypeScript and JavaScript
-   React (using TSX)
-   Angular

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts)**: Contains the core logic to create a SciChartSurface with a specific theme, add numeric x and y axes, and generate a nonuniform heatmap series. It computes a 2D array of z-values based on chart dimensions, defines nonuniform cell offsets via mapping functions, and applies a HeatmapColorMap with several gradient stops. The function also adds interactive chart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier.
-   **angular.ts**: Defines an Angular component that uses the SciChart Angular integration, calling the shared drawExample function to render the chart.
-   **index.tsx**: Provides the React version of the example by rendering a SciChartReact component that initializes the chart via drawExample. This highlights how the same core drawing logic can be reused across frameworks.
-   **vanilla.js and vanilla.ts**: Showcase the usage of the drawExample function in a plain JavaScript/TypeScript environment. The files include a cleanup mechanism to dispose of the SciChartSurface when no longer needed.
-   **javascript-non-uniform-heatmap-chart.jpg**: An image asset for the example, likely used as a preview or thumbnail.

## Customization

Key configuration options in this example include:

-   **Data Configuration**: The 2D array of z-values is calculated dynamically, and the cell offsets are defined by custom mapping functions for both x and y axes.
-   **Color Mapping**: The HeatmapColorMap is configured with a minimum and maximum, a series of gradient stops, and options such as opacity and filling values out of range. This allows for detailed control over the appearance of each heatmap cell.
-   **Data Labels**: Custom styling is applied to data labels, including font family and size, to improve readability.
-   **Interactivity**: Chart modifiers are added for zooming and panning, ensuring the chart is fully interactive.

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
