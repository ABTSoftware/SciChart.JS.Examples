# Drag Axis To Scale

## Overview

This example demonstrates how to enable interactivity by allowing users to drag chart axes. The X-Axes can be dragged for panning while the Y-Axes can be dragged for scaling. Implementations are provided for React (TSX), Angular (TS), and Vanilla JavaScript (JS/TS).

## Technologies Used

-   **SciChart.js** – High performance charting library
-   **React** – Via the SciChartReact component (TSX)
-   **Angular** – Standalone component using SciChartAngularComponent (TS)
-   **Vanilla JavaScript/TypeScript** – Simple implementations without any framework

## Code Explanation

-   **drawExample.js/ts**: Contains the main logic. It creates a SciChartSurface and four numeric axes (two X-Axes and two Y-Axes). The top and bottom X-Axes are both titled "Drag the X-Axis to Pan" while the left and right Y-Axes are titled "Drag the Y-Axis to Scale". Two line series are created with sine-wave data and assigned to the corresponding axes. Chart modifiers are added: a XAxisDragModifier with drag mode set to panning, and a YAxisDragModifier with drag mode set to scaling. A ZoomExtentsModifier is also added for a double-click zoom to fit.
-   **angular.ts**: Sets up an Angular component that initializes the chart using the SciChartAngularComponent. It links to the drawExample function to render the chart.
-   **index.tsx**: Provides a React component that uses the SciChartReact component which in turn calls the drawExample function.
-   **vanilla.js/vanilla.ts**: Offer a plain JavaScript and TypeScript implementation that calls drawExample on a specified HTML element and returns a destructor for cleanup.

## Customization

Key configuration options include:

-   **Axis Configuration**: Titles, alignment (top, bottom, left, right), numeric format, and label precision settings.
-   **Data Series**: The sine-wave data for the line series is generated dynamically using configurable parameters such as step size, amplitude, and frequency.
-   **Modifiers**: The use of XAxisDragModifier and YAxisDragModifier allows you to customize the drag behavior. The X-Axes are set to pan while the Y-Axes are set to scale, which you can adjust by modifying the `EDragMode` for each modifier.

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
