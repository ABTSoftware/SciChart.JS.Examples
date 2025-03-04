# Static Axis Example

## Overview

This example demonstrates how to create and use a static axis in SciChart.js. In this example, two X axes are created: one configured as a static axis (gridlines and labels remain fixed on visible range changes) and a normal axis. A line series with sine-based data is added and continuously updated in real‑time. The example includes a React implementation using TypeScript, along with a Vanilla JavaScript version.

## Technologies Used

-   [SciChart.js](https://www.scichart.com/scichart-js-documentation/) for charting
-   React with TypeScript (using the SciChartReact component from scichart-react)
-   Material-UI for UI elements such as Toggle Buttons

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main logic to set up the chart. They create two X axes: one marked as a static axis by setting `isStaticAxis: true` (so gridlines and labels maintain their initial positions even when the visible range changes) and a normal axis. The static axis is used to synchronize the normal axis’s visible range via a subscription to the static axis’s `visibleRangeChanged` event. A Y axis is also created, and a sine-based data series is built and rendered as a fast line renderable series. The example continuously appends new data points using `setInterval`, and a horizontal line annotation is added at y = 0. An internal control function `toggleStaticAxis` allows switching the primary axis between the static and normal axes.
-   **index.tsx**: The React component wraps the chart within a styled container and uses the `SciChartReact` component to initialize the chart using the `drawExample` function. A Material-UI ToggleButtonGroup is provided in the toolbar to switch the primary axis between the static and normal axes by calling the `toggleStaticAxis` control from the chart.
-   **javascript-static-axis.jpg**: This image file shows a preview of the chart rendered by the example.

## Customization

Key configuration options in this example include:

-   **Axis Properties**: The static X axis is configured with `labelPrecision`, `autoRange`, `axisAlignment`, and `axisTitle`. Setting `isStaticAxis: true` makes the gridlines and labels remain fixed even when new data updates the visible range.
-   **Data Series Styling**: The line series is styled with a stroke color (using a vivid orange factor from the theme) and a specified stroke thickness.
-   **Real-time Data Update**: The example demonstrates how to update the data series continuously using a setInterval callback that appends new points.
-   **UI Controls**: The toggle button in the React component allows switching which axis is marked as the primary axis, enabling users to observe the behavior difference between a static axis and a normal axis in real‑time.

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
