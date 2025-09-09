# Correlation Plot Example

## Overview

This example demonstrates a high performance Scatter chart grid with 5000 points per chart using the subcharts api in SciChart.js which can be used to create a Correlation Plot. Implementations are provided for multiple frameworks including Angular, React, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.JS Library**: For rendering high-performance charts
-   **Angular**: Uses the `scichart-angular` component
-   **React**: Utilizes the `SciChartReact` component from `scichart-react`
-   **Vanilla JavaScript/TypeScript**: Standard implementation with plain JS/TS
-   **WebAssembly (WASM)**: For rendering and chart performance

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts)**: This file contains the core logic for creating the chart. It initializes a SciChartSurface, adds numeric X and Y axes, and generates a grid of subcharts, each with 5000 points of randomly generated data with a random correlation.
-   **correlationLinePoints.ts**: This file contains a function to calculate the line of best fit.
-   **angular.ts**: This file defines an Angular component that uses the `scichart-angular` component to initialize and render the chart using the `drawExample` function.
-   **index.tsx**: The React entry file renders the chart within a React component using the `SciChartReact` component, again initializing the chart via `drawExample`.
-   **vanilla.js / vanilla.ts**: These files show how to integrate the chart in plain JavaScript or TypeScript by calling `drawExample` on a target HTML element (with id "chart"). They also provide a cleanup mechanism by returning a destructor function to delete the chart when needed.

## Customization

Key configuration options include:

-   **Data Generation**: You can configure the number of points per chart and the number of rows and columns
-   **Modifiers**: Includes interactivity modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier both on the individual charts, and on the main surface, allowing zooming and panning of the grid as a whole.

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
