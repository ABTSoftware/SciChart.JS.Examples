# Draw Behind Axes Example

## Overview

This example demonstrates how to render series behind the chart axes in SciChart.JS. It includes implementations for Angular, Vanilla JavaScript, and React. The example shows how to configure a SciChartSurface to draw its series behind the axes (placing the axes within the chart area) and provides an interactive toggle (in the React version) to switch between drawing series behind the axes and clipping series at the viewport edge.

## Technologies Used

-   SciChart.JS
-   Angular
-   Vanilla JavaScript
-   React
-   TypeScript
-   Material UI (for React toggle buttons)

## Code Explanation

-   **angular.ts**: This file sets up the Angular implementation using the SciChartAngularComponent. It imports and passes the `drawExample` function to initialize the chart.
-   **drawExample.js / drawExample.ts**: These files contain the core chart setup code. They create a SciChartSurface, configure numerical X and Y axes, and add two FastLineRenderableSeries. A key configuration is the property `drawSeriesBehindAxis` set to `true`, which renders the series behind the axes. These files also add zoom and pan modifiers for interactive navigation.
-   **index.tsx**: This React component initializes the SciChartSurface using SciChartReact. It includes a toggle button group (from Material UI) that allows users to switch between drawing series behind the axes and clipping the series at the viewport edge. The toggle button updates the chart title and axis border properties dynamically.
-   **javascript-draw-behind-axes.jpg**: This image provides a visual preview of the example output.

## Customization

Key configuration options in this example include:

-   **Chart Appearance**: The chart uses a custom theme (`appTheme.SciChartJsTheme`), and the title style is customized with specific font properties and padding.
-   **Axes Configuration**: Both X and Y axes are configured with properties such as `growBy`, `visibleRange`, and custom border colors and label styles.
-   **Series Styling**: The FastLineRenderableSeries are styled with different stroke thicknesses and semi-transparent stroke colors.
-   **Interactive Controls**: In the React version, toggle buttons allow switching between rendering the series behind the axes and clipping them at the viewport edge, updating properties like axis border thickness and chart title on the fly.

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
