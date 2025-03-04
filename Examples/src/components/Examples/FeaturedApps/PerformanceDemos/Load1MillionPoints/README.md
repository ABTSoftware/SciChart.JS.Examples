# Load One Million Points Example

## Overview

This example demonstrates the creation and performance testing of a SciChart.js chart that loads one million data points. The example is implemented with both Angular and React frameworks. Users can reload the data points and view performance metrics such as data generation time, point appending time, and rendering time.

## Technologies Used

-   **SciChart.js** for high performance charting
-   **Angular**: Standalone Angular component using SciChartAngular
-   **React**: React component implementation with SciChartReact
-   **Material UI**: Angular Material components and MUI for UI controls
-   **TypeScript/JavaScript** for chart and control logic

## Code Explanation

-   **angular.ts**: Contains the Angular component which integrates the SciChartAngular component. It sets up the chart by calling the `drawExample` function. A toolbar provides a button to reload the chart data and a display for performance metrics. It handles the connection between the UI and the chart controls exposed by the drawExample function.

-   **drawExample.js / drawExample.ts**: These files implement the chart creation and data loading logic. They create a SciChartSurface with numeric X and Y axes and add watermark annotations and renderable series. One million data points are generated and appended to a data series, and performance timings for data generation, appending, and frame rendering are recorded. The functions `startUpdate`, `stopUpdate`, and `reloadOnce` allow for continuous reloading of data, while `subscribeToInfo` provides a way to relay the performance information to the UI.

-   **index.tsx**: This file provides the React implementation of the example. It uses the SciChartReact component and Material UI buttons to let the user toggle continuous data reload and perform a one-off reload test. Performance results are displayed via MUI alerts. It demonstrates similar functionality as the Angular version, but with React-specific state management and hooks.

-   **javascript-chart-performance-load-one-million-points.jpg**: An image asset included with the example that likely serves as a preview or screenshot of the rendered chart.

## Customization

Key configuration options include:

-   **Chart Appearance**: Axes ranges and themes can be customized via the SciChartSurface configuration and the `appTheme` object, including colors, stroke thickness, and annotation styles.
-   **Data Generation & Performance Metrics**: The example measures and displays the time taken for generating one million data points, appending them to the series, and rendering the frame. These metrics can be used to evaluate performance improvements or to tweak data generation parameters.
-   **Chart Modifiers**: The chart supports zooming and panning through tools like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier which can be configured or extended as needed.

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
