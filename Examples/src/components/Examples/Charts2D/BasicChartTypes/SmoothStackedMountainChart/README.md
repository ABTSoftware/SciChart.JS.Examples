# Smooth Stacked Mountain Chart Example

## Overview

This example demonstrates how to create a smooth stacked mountain chart using SciChart.js. The chart renders ten randomly generated smooth stacked mountain series with individual animations and supports interactive modifiers such as zoom, pan, and mouse wheel zoom. Implementations are provided for Angular, React, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.js** – High performance charting library
-   **Angular** – Uses scichart-angular component to initialize the chart
-   **React** – Uses SciChartReact with Material UI components for UI controls
-   **Vanilla JavaScript/TypeScript** – The core chart drawing is implemented in both JS and TS

## Code Explanation

The example is structured with multiple source files:

-   **angular.ts**: The Angular entry point that imports the SciChartAngularComponent and binds the `drawExample` function.

-   **drawExample.js / drawExample.ts**: These files contain the main logic to create a SciChartSurface. They set up numeric axes, a StackedMountainCollection, and populate it with ten SmoothStackedMountainRenderableSeries. Each series is assigned a ScaleAnimation with a 500ms duration and an increasing delay. Interactivity is added with zoom, pan, and mouse wheel modifiers as well as a LegendModifier for displaying series legends. The function also exposes a control to toggle the 100% stacked mode.

-   **index.tsx**: The React implementation. It wraps the chart in a React component using the SciChartReact component and displays a toggle button group (from Material UI) to switch between regular stacked mode and 100% stacked mode. The React component makes use of the same `drawExample` function to initialize the chart and updates the chart using a controls reference.

-   **javascript-smooth-stacked-mountain-chart.jpg**: An image file, typically used as a thumbnail or preview image for the example.

## Customization

Key configuration options in the example include:

-   **Animation Duration and Delay**: Each smooth stacked mountain series uses a `ScaleAnimation` with a duration set to 500ms and a delay that increases with the series index (i.e., `delay: index * 200`).
-   **Series Appearance**: The series fill and stroke use `AUTO_COLOR` and have a stroke thickness of 2.
-   **Interactivity**: Zoom, pan, and mouse wheel zoom modifiers are added to enhance chart navigation. A legend is configured to display series markers, checkboxes, and layout options.
-   **100% Stacked Mode Toggle**: There is a control that allows switching between regular stacking and 100% stacking mode.

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
