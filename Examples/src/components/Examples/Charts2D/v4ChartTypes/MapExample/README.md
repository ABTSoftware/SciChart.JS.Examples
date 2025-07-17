# Band Series Chart

## Overview

This example demonstrates how to create a band series chart using SciChart.js. It renders two distinct band series with different styling and animations, and provides implementations for React (TSX), Angular (TS), and Vanilla JavaScript.

## Technologies Used

-   SciChart.js – High performance charting library
-   Angular – For Angular integration
-   React – For React integration
-   Vanilla JavaScript – For plain JavaScript implementation
-   TypeScript – Used in Angular and Vanilla examples

## Code Explanation

The example is structured around a central function, `drawExample`, defined in both JavaScript and TypeScript versions. This function creates a SciChartSurface, adds numeric X and Y axes, generates data for X, Y, and Y1 values, and renders two band series using `XyyDataSeries`. One series uses solid fill colors with transparent overlays and a SweepAnimation, while the second series is styled with linear gradient fills. Interactivity is added via zoom extents, pan, and mouse wheel zoom modifiers. The framework-specific files include:

-   **angular.ts**: An Angular component that initializes the chart using the SciChart Angular component.
-   **index.tsx**: A React component that utilizes the SciChartReact wrapper to create the chart.
-   **vanilla.js / vanilla.ts**: Vanilla JavaScript and TypeScript implementations that call `drawExample` and provide a cleanup mechanism.
-   **javascript-band-chart.jpg**: An image asset that likely serves as a preview or thumbnail for the example.

## Customization

Key configuration options in this example include:

-   **Animation Duration**: The SweepAnimation is set to 800 milliseconds for both band series.
-   **Chart Styling**: The example uses theme-based colors (such as VividOrange and VividSkyBlue) for strokes and fills, with variations including solid fills with transparency and linear gradient fills.
-   **Interactivity**: Interactive modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier are added to provide a dynamic user experience.

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
