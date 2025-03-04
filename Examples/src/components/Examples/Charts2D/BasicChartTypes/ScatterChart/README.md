# Scatter Chart Example

## Overview

This example demonstrates how to create a scatter chart using SciChart.JS. The example displays two scatter series with different point markers, one using an ellipse and the other using a triangle. Implementations are provided for multiple frameworks including Angular, React, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.JS Library**: For rendering high-performance charts
-   **Angular**: Uses the `scichart-angular` component
-   **React**: Utilizes the `SciChartReact` component from `scichart-react`
-   **Vanilla JavaScript/TypeScript**: Standard implementation with plain JS/TS
-   **WebAssembly (WASM)**: For rendering and chart performance

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts)**: This file contains the core logic for creating the chart. It initializes a SciChartSurface, adds numeric X and Y axes, and generates two scatter series with 250 data points each. The first series uses an ellipse point marker while the second one uses a triangle point marker. Both series include a sweep animation effect with configurable duration and optional delay. Additionally, interactivity is added through zooming and panning modifiers.
-   **angular.ts**: This file defines an Angular component that uses the `scichart-angular` component to initialize and render the chart using the `drawExample` function.
-   **index.tsx**: The React entry file renders the chart within a React component using the `SciChartReact` component, again initializing the chart via `drawExample`.
-   **vanilla.js / vanilla.ts**: These files show how to integrate the chart in plain JavaScript or TypeScript by calling `drawExample` on a target HTML element (with id "chart"). They also provide a cleanup mechanism by returning a destructor function to delete the chart when needed.
-   **javascript-scatter-chart.jpg**: An image asset likely representing a screenshot of the resulting scatter chart.

## Customization

Key configuration options include:

-   **Data Generation**: Generates 250 data points with randomness in the y-values.
-   **Point Markers**: Uses different point markers (Ellipse for one series and Triangle for the second) with configurable color, width, and height.
-   **Animation**: Both series are animated with a sweep animation (duration set to 600ms, fade effect, and an optional delay of 200ms for the second series).
-   **Modifiers**: Includes interactivity modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier for improved user interaction.

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
