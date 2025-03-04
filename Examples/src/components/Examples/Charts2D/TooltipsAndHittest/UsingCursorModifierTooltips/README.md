# Using Cursor Modifier Tooltips Example

## Overview

This example demonstrates how to add sophisticated cursor behavior to a SciChart.JS chart by using the CursorModifier to display crosshairs and custom tooltips. The example shows implementations for Angular, React, and Vanilla JavaScript/TypeScript, allowing you to see how similar functionality is achieved across different frameworks.

## Technologies Used

-   SciChart.JS: High performance charting library
-   SciChart Angular components
-   SciChart React components
-   Vanilla JavaScript/TypeScript
-   Web technologies (HTML, CSS)

## Code Explanation

-   **Angular Implementation (angular.ts):**
    This file defines a standalone Angular component that utilizes the `scichart-angular` component. It passes the `drawExample` function as an input to initialize and render the chart.

-   **Chart Drawing Functions (drawExample.js / drawExample.ts):**
    These files contain the core logic to create a SciChartSurface with X and Y numeric axes, add multiple FastLineRenderableSeries with custom point markers, and configure various chart modifiers. A `CursorModifier` is added with custom options including crosshair styles, axis label colors, and an overridden tooltip legend template function that generates an SVG tooltip displaying formatted series information.

-   **React Implementation (index.tsx):**
    The React file imports the `SciChartReact` component and uses the `drawExample` function to initialize the chart, wrapping it in a component to render within a typical React application.

-   **Vanilla JavaScript/TypeScript (vanilla.js / vanilla.ts):**
    These files demonstrate how to create and render the chart using straight JavaScript or TypeScript, including a cleanup function to properly dispose of the chart instance when needed.

## Customization

Key configuration options in the example include:

-   **Axis Settings:** Adjustments to the `growBy`, `labelFormat`, and `labelPrecision` for both X and Y axes.
-   **Series Styling:** Configuration of stroke thickness, colors, and custom ellipse point markers for each line series.
-   **Cursor Modifier Customization:** The `CursorModifier` is set up with options for showing crosshairs (including stroke color and thickness), enabling tooltips and axis labels with customized colors, and providing a custom legend template function that generates an SVG tooltip with series names and formatted X/Y values.

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
