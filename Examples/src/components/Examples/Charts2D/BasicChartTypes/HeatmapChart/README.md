# Heatmap Chart

## Overview

This example demonstrates a real-time updating heatmap chart using SciChart.JS. The example showcases implementations for Angular, React, and a Vanilla JavaScript/TypeScript version. Users can start and stop the real-time updates, view live statistics such as heatmap size and FPS, and interact with the chart through zoom and pan modifiers.

## Technologies Used

-   **SciChart.JS** – High performance charting library
-   **Angular** – Angular component integration via scichart-angular
-   **React** – React integration using SciChartReact
-   **TypeScript & JavaScript** – Implementing the chart drawing logic
-   **Material UI** – Used for toolbar buttons and icons in the React example

## Code Explanation

-   **angular.ts**: The Angular component sets up the chart layout including toolbar buttons and chart areas. It imports the drawing functions from the supporting file and uses the SciChartAngular component. The component subscribes to render statistics and provides start/stop controls for the real-time data updates.

-   **drawExample.js / drawExample.ts**: These files contain the main logic for creating and updating the heatmap chart. They:

    -   Create a SciChartSurface with hidden axes to focus on the heatmap.
    -   Generate a two-dimensional array of heat values using a custom data generation function.
    -   Configure a UniformHeatmapDataSeries and a UniformHeatmapRenderableSeries with a custom color map that uses a series of gradient stops.
    -   Add interaction modifiers (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier) to enable chart interaction.
    -   Implement a timer-based update mechanism (using setTimeout) to continuously update the heatmap data in real time.
    -   Expose control functions (startUpdate, stopUpdate) and a method to subscribe to render statistics, such as FPS and heatmap dimensions.

-   **index.tsx**: The React example uses the SciChartReact component to initialize the heatmap chart and legend. It incorporates a toolbar built with Material UI buttons that allow users to start and stop the data updates. The component also subscribes to render statistics similarly to the Angular version and offers a layout that overlays the heatmap legend on the chart area.

-   **javascript-heatmap-chart.jpg**: This image file likely provides a preview or screenshot of the rendered heatmap chart.

## Customization

Key customization options in this example include:

-   **Data Generation**: The custom data generation function allows adjustments to the heatmap’s size (width and height), data value limits (e.g., maximum value set to 200), and update cycle (timer interval set at 20ms).
-   **Color Map Configuration**: The heatmap color map is defined with multiple gradient stops. You can modify the colors and offsets to change the visual style of the heatmap.
-   **Chart Modifiers**: The example uses various interaction modifiers (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier) that can be enabled or adjusted to alter user interaction with the chart.

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
