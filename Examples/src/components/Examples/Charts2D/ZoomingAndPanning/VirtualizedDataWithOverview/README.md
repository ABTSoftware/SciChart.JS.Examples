# Virtualized Data with Overview

## Overview

This example demonstrates how to implement a dynamically updating chart with virtualized data and an integrated overview. The example is built using SciChart.JS with a React implementation. It showcases how to load a large data set in a virtualized manner by adjusting the data based on the visible range and simultaneously displays an overview chart that provides a zoomed-out perspective of the entire dataset.

## Technologies Used

-   **SciChart.JS**: A high-performance charting library for JavaScript.
-   **React**: The example uses React with TypeScript (TSX) for rendering the charts.
-   **RxJS**: Used to debounce visible range changes and control data update frequency.
-   **TypeScript/JavaScript**: Both JS and TS source files are provided.
-   **CSS Modules**: Used for styling as observed via the imported `Examples.module.scss` file.

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files define the core chart initialization logic via the function `getChartsInitializationApi`. They create a main chart with numeric axes, a data series, and renderable series using a fast line renderer. The data is loaded via an API call that fetches JSON data based on the current visible range. RxJS is employed to debounce these updates and avoid overloading the chart with too frequent updates. In addition, the functions set up various chart modifiers (ZoomExtentsModifier, XAxisDragModifier, YAxisDragModifier, ZoomPanModifier, and MouseWheelZoomModifier) to allow interactive zooming and panning.
-   **index.tsx**: This file is the primary React component that renders the example. It uses the `SciChartReact` component to mount both the main chart and the overview chart. The overview chart is initialized only after the main chart has been rendered, and it displays a complete dataset by loading points over an extended range (0 to 10,000,000). The component makes use of React hooks (useState) for managing the chart initialization state.
-   **virtualized-data-javascript-chart.jpg**: This image file serves as a visual reference for the chart, displaying how the final chart appearance might look.

## Customization

Key configuration options in this example include:

-   **Visible Range**: The main chart’s xAxis visible range is set explicitly (e.g., from 4,000,000 to 5,000,000) with the autoRange disabled.
-   **Axis Settings**: Both the xAxis and yAxis are customized in terms of alignment, range, and label precision. The yAxis is animated to update its range after data updates.
-   **Chart Modifiers**: Options such as zoom extents, dragging, panning, and mouse wheel zoom have been configured to allow smooth and interactive chart behavior.
-   **Debounce Duration**: The RxJS debounce time is set to 250ms to control how frequently the data is reloaded during range changes.
-   **Styling**: Stroke colors, line thickness, and annotation styles (for error messages) are defined using the provided application theme.

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
