# Create A Custom Theme

## Overview

This example demonstrates how to create and apply a custom theme to a SciChart.JS chart. The example shows how to configure visual properties such as colors for axes, series, grid lines, annotations and more. Implementations for Angular, React, and Vanilla JavaScript/TypeScript are provided.

## Technologies Used

-   SciChart.JS library
-   Angular (standalone component with TypeScript)
-   React (using a TSX component)
-   Vanilla JavaScript and TypeScript

## Code Explanation

-   **drawExample (drawExample.ts / drawExample.js):** This file contains the main logic that creates the chart surface, applies a custom theme using the `applyTheme` function, sets up numeric axes with defined ranges, and adds three renderable series: a line series, a candlestick series, and a column series. It also creates a tooltip behaviour with the `RolloverModifier`.
-   **Data Files (data.js and data.ts):** These files provide sample data series (date values and OHLC values) used by the candlestick series as well as other chart series.
-   **Framework Specific Files:**
    -   **Angular (angular.ts):** Contains the standalone Angular component that integrates the SciChart surface via the `scichart-angular` component. It directly calls the `drawExample` function to initialize the chart.
    -   **React (index.tsx):** Provides a React component that renders the chart using the `SciChartReact` component with `drawExample` as the initialization method.
    -   **Vanilla (vanilla.js and vanilla.ts):** These files call the `drawExample` function, create the chart on a DOM element with id "chart", and set up a cleanup function to delete the chart when necessary.
-   **Image File (javascript-chart-custom-themed.jpg):** Likely a screenshot of the custom themed chart.

## Customization

The custom theme is applied by calling `sciChartSurface.applyTheme()` with an object that specifies various styling options. Some of the key configuration options include:

-   Colors for annotations, axes, grids, and labels
-   Brush colors for various series types (line, column, candlestick)
-   Background colors for the chart and grid
-   Configuration for interactive elements such as rubber band, rollover modifiers, and scrollbars

Developers can modify these visual properties to match the desired look and feel of their application.

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
