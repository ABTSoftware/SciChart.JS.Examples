# Overview Modifier Example

## Overview

This example demonstrates the Overview Modifier functionality in SciChart.js. It shows how to integrate a nested overview (scrollbar) that automatically reflects the state of the main chart. Users can zoom the main chart or drag the overview, and the two will update in sync. This example is implemented in both Vanilla JavaScript (JS/TS) and React (TSX) to illustrate usage across different frameworks.

## Technologies Used

-   **SciChart.js** – High performance charting library
-   **React** – Used in the React implementation via the SciChartReact component and SciChartNestedOverview
-   **TypeScript/JavaScript** – Provided in both TS and JS versions
-   **RandomWalkGenerator** – Utility for generating random data series
-   **Chart Modifiers** – Such as ZoomPanModifier, RubberBandXyZoomModifier, ZoomExtentsModifier, and MouseWheelZoomModifier

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main logic to create and configure the SciChartSurface. They set up numeric axes, generate two random walk data series (one rendered as a fast line series and the other as a scatter series), and add a NativeTextAnnotation that explains the interactive functionality. In addition, several interaction modifiers are added to handle zooming and panning. Although the code comments mention an Overview chart creation function, the example demonstrates binding the overview through the React component.

-   **index.tsx**: This file is the React component implementation. It uses the `SciChartReact` component to initialize the chart by calling the `drawExample` function. The `SciChartNestedOverview` component is embedded within the layout and linked with the main chart via options. This file shows how to integrate the overview modifier in a React context.

-   **javascript-overview-chart.jpg**: An image file provided to illustrate what the overview chart might look like, though it is not used directly in the code.

## Customization

Key configuration options include:

-   **Axis Ranges**: The visible range for the X-Axis is set explicitly and the Y-Axis uses auto-range with custom growBy settings.
-   **Series Styles**: Stroke thickness, color, and point marker customization (e.g., EllipsePointMarker for scatter series) are defined.
-   **Annotations**: A text annotation is added with relative positioning, custom font size, and opacity to provide user instructions.
-   **Chart Modifiers**: Multiple modifiers are enabled (zoom pan, rubber band zoom, zoom extents, mouse wheel zoom) which can be further customized as required.
-   **Theme**: The appTheme from SciChart.js is applied to maintain consistent styling across the chart and overview.

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
